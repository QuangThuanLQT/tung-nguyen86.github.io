
/* ------ Start Global Variables & Constants Declaration ------*/
var pageSizeOptions = [
    { value: 5,  text: '05 bản ghi / trang' }, 
    { value: 10, text: '10 bản ghi / trang' }, 
    { value: 15, text: '15 bản ghi / trang' }, 
    { value: 20, text: '20 bản ghi / trang' }, 
    { value: 30, text: '30 bản ghi / trang' }, 
    { value: 0,  text: 'Toàn bộ Danh sách'  }
];

const DEFAULT_PAGE_SIZE = '10';

const DEFAULT_PAGINATION_CONFIG = {
    selfContainer   : divPaginationContainer, // parent of the pagination box
    selfBox         : null,                   // the pagination box
    recordsPerPage  : getRecordsPerPage(),    // pageSize
    activePage      : 1                       // activePage
};
/* ------ End Global Variables & Constants Declaration ------*/

/* ------ Start Functions Declaration ------*/
function createPaginationBox(paginationConfig, actionType = EMPTY_STRING) {
    let divPaginationBox;

    if (!(paginationConfig.selfBox instanceof Element)) {
        paginationConfig.selfBox = document.createElement('div');
    }
    divPaginationBox = paginationConfig.selfBox;

    let recordsPerPage = paginationConfig.recordsPerPage;
    let trs = getTableRowList(paginationConfig.selfContainer);

    if (trs.length <= 5) {
        divPaginationContainer.className = 'hidden-pagination-box-container';
        divPaginationBox.className = 'hidden-pagination-box';
    } else {
        divPaginationContainer.className = 'pagination-box-container';
        divPaginationBox.className = 'pagination-box';
    }

    // Get & Set the current active page.
    let page = paginationConfig.activePage;

    // Get the page total.
    let pages = (recordsPerPage > 0) ? Math.ceil(trs.length/recordsPerPage) : 1;

    if (pages < 1) {
        pages = 1;
    }

    if (page > pages) {
        page = pages;
    }

    actionType = actionType.toLowerCase().trim();
    if (actionType === ACTION_ADD_STUDENT) {
        page = 1;
    }

    paginationConfig.activePage = page;
 
    // Hide rows which are not in the current active page.
    for (let i = 0; i < trs.length; i++) {
        if (typeof(trs[i]['data-display']) === 'undefined') {
            trs[i]['data-display'] = trs[i].style.display || EMPTY_STRING;
        }

        if (recordsPerPage > 0) {
            if (i < page * recordsPerPage && i >= (page - 1) * recordsPerPage) {
                trs[i].style.display = trs[i]['data-display'];
            } else {
                trs[i].style.display = 'none';
            }
        } else {
            trs[i].style.display = trs[i]['data-display'];
        }
    }

    let paginationElement = document.createElement('ul');
    paginationElement.className = 'pagination';

    let prevItem = createPaginationItem(
        '&laquo;', 
        (page > 1 ? page - 1 : 1),  
        paginationConfig, 
        (page === 1), 
        false
    );
    paginationElement.appendChild(prevItem);

    for (let i = 1; i <= pages; i++) {
        let li = createPaginationItem(i, i, paginationConfig, false, (page === i));
        paginationElement.appendChild(li);
    }

    let nextItem = createPaginationItem(
        '&raquo;', 
        (pages > page ? page + 1 : page), 
        paginationConfig, 
        (page === pages), 
        false
    );

    paginationElement.appendChild(nextItem);

    if (divPaginationBox.childNodes.length) {
        while (divPaginationBox.childNodes.length > 1) {
            divPaginationBox.removeChild(divPaginationBox.childNodes[0]);
        }

        divPaginationBox.replaceChild(paginationElement, divPaginationBox.childNodes[0]);
    } else {
        divPaginationBox.appendChild(paginationElement);
    }

    let divSettingPageSizeContainer = document.createElement('div');
    divSettingPageSizeContainer.className = 'setting-page-size-container';

    let divSettingPageSize = document.createElement('div');
    divSettingPageSize.className = 'setting-page-size';

    let select = document.createElement('select');

    for (let i = 0; i < pageSizeOptions.length; i++) {
        let opt = document.createElement('option');
        opt.value = pageSizeOptions[i].value;
        opt.text = pageSizeOptions[i].text;
        select.appendChild(opt);
    }

    select.value = recordsPerPage;
    select.addEventListener('change', function() {
        paginationConfig.recordsPerPage = this.value;
        setRecordsPerPage(this.value);
        createPaginationBox(paginationConfig);
    }, false);
    divSettingPageSize.appendChild(select);

    let downArrow = document.createElement('div');
    downArrow.className = 'down-arrow';
    downArrow.innerHTML = '&#9660;';
    divSettingPageSize.appendChild(downArrow);

    divSettingPageSizeContainer.appendChild(divSettingPageSize);

    let spanTotalRecordInfo = document.createElement('span');
    spanTotalRecordInfo.className = 'total-record-info';
    spanTotalRecordInfo.innerHTML = getTotalRecordInfo(trs.length);
    divSettingPageSizeContainer.appendChild(spanTotalRecordInfo);

    divPaginationBox.appendChild(divSettingPageSizeContainer);
    resetBgColorOfAllTableRows();

    return divPaginationBox;
}

function createPaginationItem(hyperlinkText, index, paginationConfig, disabled, active) {
    let li = document.createElement('li');
    let a = document.createElement('a');

    a.className = 'pagination-link';
    a.href = 'javascript:void(0);';
    a.innerHTML = hyperlinkText;
    a.addEventListener('click', function(event) {
        event.preventDefault();
        this.parentNode.click();
        return false;
    }, false);

    li.appendChild(a);

    let classes = ['pagination-item'];
    if (disabled) {
        classes.push('disabled');
    }

    if (active) {
        classes.push('active');
    }

    li.className = classes.join(' ');
    li.addEventListener('click', function() {
        if (this.className.split(' ').indexOf('disabled') === -1) {
            paginationConfig.activePage = index;
            createPaginationBox(paginationConfig);
        }
    }, false);

    return li;
}

function getTableRowList(divTableContainer) {
    let table = divTableContainer.parentNode.getElementsByTagName('table')[0];
    let tbody = table.getElementsByTagName('tbody')[0];
    let children = tbody.children;
    let trs = [];

    for (let i = 1; i < children.length; i++) {
        if (children[i].nodeType = 'tr') {
            if (children[i].getElementsByTagName('td').length > 0) {
                trs.push(children[i]);
            }
        }
    }

    return trs;
}

function getTotalRecordInfo(totalRecord) {
    let totalRecordInfo = `<font color='#0000ff'>${setStringForNumberValue(totalRecord)}</font> sinh viên`;

    if (txtKeywordSearch.value.trim() === EMPTY_STRING && selGender.selectedIndex === 0) {
        return `Tổng số: ${totalRecordInfo}`;
    } else {
        return `Kết quả tìm kiếm: ${totalRecordInfo}`;
    }
}

function initializeRecordsPerPage() {
    localStorage.setItem('page_size', getRecordsPerPage().toString());
}

function getRecordsPerPage() {
    try {
        let pageSize = localStorage.getItem('page_size');

        if (pageSize && pageSize.length > 0) {
            if (!isValidPageSize(pageSize) || !isPageSizeInRange(pageSize)) {
                pageSize = DEFAULT_PAGE_SIZE;
            }
        } else {
            pageSize = DEFAULT_PAGE_SIZE;
        }

        return parseInt(pageSize);
    } catch(exception) {
        return MINUS_ONE_NUMBER.toString();
    }
}

function setRecordsPerPage(recordsPerPage) {
    localStorage.setItem('page_size', recordsPerPage.toString());
}

function isValidPageSize(pageSize) {
    return /^[0-9]+$/.test(pageSize);
}

function isPageSizeInRange(pageSize) {
    for (let i = 0; i < pageSizeOptions.length; i++) {
        if (pageSize === pageSizeOptions[i].value.toString()) {
            return true;
        }
    }

    return false;
}
/* ------ End Functions Declaration ------*/