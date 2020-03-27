
/* ------ Start Global Variables Declaration ------*/
var btnScrollTop = document.getElementById('btnScrollTop');
var currentLocationFromTop = 0;
/* ------ End Global Variables Declaration ------*/

/* ------ Start Functions Declaration ------*/
// When the end-user scrolls down 340px from the top of the page, show the 'Scroll Top' Button (btnScrollTop).
// document.documentElement.scrollTop => using for Chrome, Firefox, Microsoft Edge/IE and Opera.
// document.body.scrollTop => using for Safari.
window.onscroll = function() { processOnScroll(); }

function processOnScroll() {
    if (document.documentElement.scrollTop > 340 || document.body.scrollTop > 340) {
        btnScrollTop.style.opacity = '1';
        btnScrollTop.style.visibility = 'visible';

        btnScrollTop.style.backgroundColor = '#eeeeee';
        btnScrollTop.style.color = '#909090';
        btnScrollTop.style.borderColor = '#cccccc';

        btnScrollTop.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#dddddd';
            this.style.color = '#666666';
            this.style.borderColor = '#aaaaaa';
        });

        btnScrollTop.addEventListener("mouseout", function() {
            this.style.backgroundColor = '#eeeeee';
            this.style.color = '#909090';
            this.style.borderColor = '#cccccc';
        });
    } else {
        btnScrollTop.style.opacity = '0';
        btnScrollTop.style.visibility = 'hidden';
    }
}

// When the end-user clicks the 'Scroll Top' Button, the Browser will scroll to the top of the page smoothly.
btnScrollTop.onclick = function() { scrollTopOfPage(); }

function scrollTopOfPage() {
    var locationFromTop = (document.documentElement.scrollTop || document.body.scrollTop);

    var interval = setInterval(function() {
        window.scrollTo(0, locationFromTop);
        locationFromTop -= 100;

        if (locationFromTop <= -100) {
            clearInterval(interval);
        }
    }, 20);
}

function scrollTopToFocusForm() {
    var locationFromTop = (document.documentElement.scrollTop || document.body.scrollTop);
    currentLocationFromTop = locationFromTop;

    var interval = setInterval(function() {
        window.scrollTo(0, locationFromTop);
        locationFromTop -= 80;

        if (locationFromTop <= -80) {
            clearInterval(interval);
        }
    }, 40);
}

function scrollBackToFocusedTableRow() {
    var startLocation = 0;

    var interval = setInterval(function() {
        window.scrollTo(currentLocationFromTop, startLocation);
        startLocation += 100;

        if (startLocation >= (currentLocationFromTop + 100)) {
            clearInterval(interval);
        }
    }, 20);
}

function getLocationFromTopOfTableRow(tableRowIndex) {
    let tableRowList        = document.querySelectorAll('div.list-student table tr:not(#first-row)');
    let tableRowObject      = tableRowList[tableRowIndex];

    let offsetTopOfTableRow = tableRowObject.offsetTop;
    let heightOfTableRow    = parseInt(window.getComputedStyle(tableRowObject).height);

    return (offsetTopOfTableRow + heightOfTableRow * 2);
}
/* ------ End Functions Declaration ------*/