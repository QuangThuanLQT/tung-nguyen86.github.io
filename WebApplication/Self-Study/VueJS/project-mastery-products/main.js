
Vue.component('product', {
    props: {
        premium: {
            type: Boolean, 
            required: true
        }, 
        cart: {
            type: Array, 
            required: true, 
            default: []
        }, 
        product: {
            type: Object, 
            required: true
        }, 
        product_index: {
            type: Number, 
            required: true, 
            default: 0
        }, 
        selected_product_index: {
            type: Number, 
            required: true, 
            default: 0
        }
    }, 
    template: `
        <div class="product">
            <div class="product-image">
                <img :src="image" :alt="altText" :title="altText"/>
            </div>

            <div class="product-info">
                <h2>{{ productTitle }}</h2>
                <h3>{{ description }}</h3>

                <p>Shipping Cost: <font color='#0000ff'>{{ shipping }}</font></p>
                <p v-if="inStockForVariant">In Stock</p>
                <p v-else>Out of Stock</p>

                <ul>
                    <li v-for="detail in details">
                        {{ detail }}
                    </li>
                </ul>

                <div class="variants">
                    <div class="color-box" 
                        v-for="(variant, index) in variants" 
                        :key="variant.variantId" 
                        :title="capitalizeFirstLetter(variant.variantColor)" 
                        :style="{ 'background-color': variant.variantColor }" 
                        :class="isActiveBox(product_index, index)" 
                        @click="selectVariantOfProduct(product_index, index)">
                    </div>
                </div>

                <button @click="addToCart" 
                    :disabled="!inStockForProduct" 
                    :class="{ 'disabled-button': !inStockForProduct }">
                    Add to Cart
                </button>
                <button @click="subtractToCart" 
                    :disabled="!inCart" 
                    :class="{ 'disabled-button': !inCart }">
                    Subtract to Cart
                </button>
            </div>
        </div>
    `, 
    data() {
        return {
            selectedVariantIndex: 0
        }
    }, 
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.selected_product_index, this.selectedVariant.variantId);
        }, 
        subtractToCart() {
            this.$emit('subtract-to-cart', this.selected_product_index, this.selectedVariant.variantId);
        }, 
        selectVariantOfProduct(productIndex, variantIndex) {
            this.$emit('select-variant-product', productIndex, variantIndex);
            this.selectedVariantIndex = variantIndex;
        }, 
        isActiveBox(productIndex, variantIndex) {
            if (this.selected_product_index === productIndex && this.selectedVariantIndex === variantIndex) {
                return 'active-color-box';
            } else {
                return 'inactive-color-box';
            }
        }, 
        countVariantInCart(cart, variantId) {
            if (cart.length === 0) {
                return 0;
            }

            let count = 0;

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].variantId === variantId) {
                    count++;
                }
            }

            return count;
        }, 
        lastIndexOf(cart, variantId) {
            for (let i = cart.length - 1; i >= 0; i--) {
                if(cart[i].variantId === variantId) {
                    return i;
                }
            }

            return -1;
        }, 
        capitalizeFirstLetter(inputString) {
            return (inputString.charAt(0).toUpperCase() + inputString.slice(1));
        }
    }, 
    computed: {
        productTitle() {
            return (this.product.brandName + ' ' + this.product.productName);
        }, 
        description() {
            return this.product.description;
        }, 
        altText() {
            return this.product.altText;
        }, 
        details() {
            return this.product.details;
        }, 
        variants() {
            return this.product.variants;
        }, 
        selectedVariant() {
            return this.product.variants[this.selectedVariantIndex];
        }, 
        selectedVariantQuantityInStock() {
            return (this.selectedVariant.variantQuantity - this.countVariantInCart(this.cart, this.selectedVariant.variantId));
        }, 
        image() {
            return this.selectedVariant.variantImage;
        }, 
        inStockForVariant() {
            return (this.selectedVariantQuantityInStock > 0);
        }, 
        inStockForProduct() {
            return (
                (this.selectedVariantQuantityInStock > 0) && 
                (this.selected_product_index === this.product_index)
            );
        }, 
        inCart() {
            return (
                (this.cart.length > 0) && 
                (this.lastIndexOf(this.cart, this.selectedVariant.variantId) !== -1) && 
                (this.selected_product_index === this.product_index)
            );
        }, 
        shipping() {
            if (this.premium) {
                return 'Free';
            } else {
                return '$2.99';
            }
        }
    }
});

Vue.component('cart-detail', {
    props: {
        cart: {
            type: Array, 
            required: true, 
            default: []
        }, 
        products: {
            type: Array, 
            required: true, 
            default: []
        }, 
        selected_product_index: {
            type: Number, 
            required: true, 
            default: 0
        }, 
        selected_variant_index: {
            type: Number, 
            required: true, 
            default: 0
        }
    }, 
    template: `
        <div class="cart-detail-container">
            <div class="outer-angle-up-area"></div>
            <div class="inner-angle-up-area"></div>
            <div class="cart-detail" :class="{ 'empty-cart' : isEmptyCart }">
                <p v-if="isEmptyCart">No Selected Product !!!</p>
                <div v-else>
                    <p style="color: #0000ff; margin-top: 12px">Your Selected Product List:</p>
                    <ul>
                        <li v-for="item in productList" 
                            :class="setClassForSelectedItem(item.productIndex, getVariantIndexById(item.productIndex, item.variantId))" 
                            :style="setStyleForSelectedItem(item.productIndex, getVariantIndexById(item.productIndex, item.variantId))">
                            <img :src="item.productImage" :alt="item.productImage" />
                            {{ item.productDetail }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `, 
    methods: {
        setStringForNumberValue(valueOfNumber) {
            if (valueOfNumber < 0) {
                return 'Invalid Value Of Number';
            } else if (valueOfNumber >= 0 && valueOfNumber < 10) {
                return ('0' + valueOfNumber.toString());
            } else {
                return valueOfNumber.toString();
            }
        }, 
        compareObjectByVariantId(object_1, object_2) {
            if (object_1.variantId < object_2.variantId) {
                return -1;
            }

            if (object_1.variantId > object_2.variantId) {
                return 1;
            }

            return 0;
        }, 
        getVariantIndexById(productIndex, variantId) {
            let variants = this.products[productIndex].variants;

            for (let i = 0; i < variants.length; i++) {
                if (variants[i].variantId === variantId) {
                    return i;
                }
            }

            return 'Undefined Variant Index';
        }, 
        getVariantImageById(variants, variantId) {
            for (let i = 0; i < variants.length; i++) {
                if (variants[i].variantId === variantId) {
                    return variants[i].variantImage;
                }
            }

            return 'Undefined Variant Image';
        }, 
        getVariantColorById(variants, variantId) {
            for (let i = 0; i < variants.length; i++) {
                if (variants[i].variantId === variantId) {
                    return variants[i].variantColor;
                }
            }

            return 'Undefined Variant Color';
        }, 
        getProductTitle(product) {
            return (product.brandName + ' ' + product.productName);
        }, 
        getProductName(product, variantColor, variantQuantity) {
            if (product.description.toLowerCase().indexOf('pair of') !== -1) {
                return (variantColor + ' pair' + (variantQuantity > 1 ? 's': '') + ' of ' + this.getProductTitle(product));
            } else {
                return (variantColor + ' ' + this.getProductTitle(product) + (variantQuantity > 1 ? 's': ''));
            }
        }, 
        getProductListInCart(cart) {
            cart.sort(this.compareObjectByVariantId);

            let productList = [];
            let currentVariantId = null;
            let count = 0;

            let productIndex, variantId;
            let selectedProduct;
            let variants;

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].variantId !== currentVariantId) {
                    if (count > 0) {
                        productList.push({
                            productIndex    : productIndex, 
                            variantId       : variantId, 
                            productImage    : `${this.getVariantImageById(variants, currentVariantId)}`, 
                            productDetail   : `
                                ${this.setStringForNumberValue(count)} 
                                ${this.getProductName(selectedProduct, this.getVariantColorById(variants, currentVariantId), count)}
                            `
                        });
                    }

                    currentVariantId = cart[i].variantId;
                    count = 1;
                } else {
                    count++;
                }

                productIndex    = cart[i].selectedProductIndex;
                variantId       = cart[i].variantId;
                selectedProduct = this.products[cart[i].selectedProductIndex];
                variants        = selectedProduct.variants;
            }

            if (count > 0) {
                productList.push({
                    productIndex    : productIndex, 
                    variantId       : variantId, 
                    productImage    : `${this.getVariantImageById(variants, currentVariantId)}`, 
                    productDetail   : `
                        ${this.setStringForNumberValue(count)} 
                        ${this.getProductName(selectedProduct, this.getVariantColorById(variants, currentVariantId), count)}
                    `
                });
            }

            return productList;
        }, 
        setClassForSelectedItem(productIndex, variantIndex) {
            if (this.selected_product_index === productIndex && this.selected_variant_index === variantIndex) {
                return 'selected-item';
            } else {
                return '';
            }
        }, 
        setStyleForSelectedItem(productIndex, variantIndex) {
            if (this.selected_product_index === productIndex && this.selected_variant_index === variantIndex) {
                return `color: ${this.products[productIndex].variants[variantIndex].variantColor}`;
            } else {
                return '';
            }
        }
    }, 
    computed: {
        isEmptyCart() {
            return (this.cart.length === 0);
        }, 
        productList() {
            return this.getProductListInCart(this.cart);
        }
    }
});

var app = new Vue({
    el: '#app', 
    data: {
        premium: true, 
        isCartDetailShown: false, 
        cart: [], 
        products: [
            {
                productId   : "pro_1001", 
                productName : "Socks", 
                brandName   : "Vue Mastery", 
                description : "A pair of warm, fuzzy socks", 
                altText     : "A pair of socks", 
                details     : ["80% Cotton", "20% Polyester", "Gender-Neutral"], 
                variants    : [
                    {
                        variantId: "var_2001", 
                        variantColor: "green", 
                        variantImage: "./assets/images/vmSocks-green.jpg", 
                        variantQuantity: 10
                    }, 
                    {
                        variantId: "var_2002", 
                        variantColor: "blue", 
                        variantImage: "./assets/images/vmSocks-blue.jpg", 
                        variantQuantity: 5
                    }
                ]
            }, 
            {
                productId   : "pro_1002", 
                productName : "Shoes", 
                brandName   : "Vue Martin", 
                description : "A pair of nice, warm shoes", 
                altText     : "A pair of shoes", 
                details     : ["50% Cotton", "50% Polyester", "Gender-Neutral"], 
                variants    : [
                    {
                        variantId: "var_2003", 
                        variantColor: "red", 
                        variantImage: "./assets/images/vmShoes-red.jpg", 
                        variantQuantity: 3
                    }, 
                    {
                        variantId: "var_2004", 
                        variantColor: "black", 
                        variantImage: "./assets/images/vmShoes-black.jpg", 
                        variantQuantity: 20
                    }, 
                    {
                        variantId: "var_2005", 
                        variantColor: "green", 
                        variantImage: "./assets/images/vmShoes-green.jpg", 
                        variantQuantity: 15
                    }
                ]
            }, 
            {
                productId   : "pro_1003", 
                productName : "Men-Shirt", 
                brandName   : "Vue Canifa", 
                description : "A nice men-shirt", 
                altText     : "A men-shirt", 
                details     : ["90% Cotton", "10% Polyester", "For-Men"], 
                variants    : [
                    {
                        variantId: "var_2006", 
                        variantColor: "black", 
                        variantImage: "./assets/images/vmShirtMen-black.jpg", 
                        variantQuantity: 0
                    }, 
                    {
                        variantId: "var_2007", 
                        variantColor: "purple", 
                        variantImage: "./assets/images/vmShirtMen-purple.jpg", 
                        variantQuantity: 4
                    }, 
                    {
                        variantId: "var_2008", 
                        variantColor: "red", 
                        variantImage: "./assets/images/vmShirtMen-red.jpg", 
                        variantQuantity: 6
                    }
                ]
            }, 
            {
                productId   : "pro_1004", 
                productName : "Women-Shirt", 
                brandName   : "Vue Canifa", 
                description : "A beautiful women-shirt", 
                altText     : "A women-shirt", 
                details     : ["75% Cotton", "25% Polyester", "For-Women"], 
                variants    : [
                    {
                        variantId: "var_2009", 
                        variantColor: "orange", 
                        variantImage: "./assets/images/vmShirtWomen-orange.jpg", 
                        variantQuantity: 4
                    }, 
                    {
                        variantId: "var_2010", 
                        variantColor: "darkblue", 
                        variantImage: "./assets/images/vmShirtWomen-darkblue.jpg", 
                        variantQuantity: 8
                    }, 
                    {
                        variantId: "var_2011", 
                        variantColor: "lightblue", 
                        variantImage: "./assets/images/vmShirtWomen-lightblue.jpg", 
                        variantQuantity: 5
                    }, 
                    {
                        variantId: "var_2012", 
                        variantColor: "black", 
                        variantImage: "./assets/images/vmShirtWomen-black.jpg", 
                        variantQuantity: 2
                    }
                ]
            }
        ], 
        selectedProductIndex: 0, 
        selectedVariantIndex: 0
    }, 
    methods: {
        lastIndexOf(cart, variantId) {
            for (let i = cart.length - 1; i >= 0; i--) {
                if(cart[i].variantId === variantId) {
                    return i;
                }
            }

            return -1;
        }, 
        addToCart(selectedProductIndex, variantId) {
            this.cart.push({
                selectedProductIndex: selectedProductIndex, 
                variantId: variantId
            });
        }, 
        subtractToCart(selectedProductIndex, variantId) {
            this.cart.splice(this.lastIndexOf(this.cart, variantId), 1);
        }, 
        selectProduct(productIndex, variantIndex) {
            this.selectedProductIndex = productIndex;
            this.selectedVariantIndex = variantIndex;
        }, 
        processDisplayForCartDetail() {
            this.isCartDetailShown = !this.isCartDetailShown;
        }
    }, 
    computed: {
        cssValueOfDisplay() {
            if (this.isCartDetailShown) {
                return 'block';
            } else {
                return 'none';
            }
        }
    }
});