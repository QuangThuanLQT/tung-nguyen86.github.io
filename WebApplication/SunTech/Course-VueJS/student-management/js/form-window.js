
/* ------ Start Global Variables Declaration ------*/
var boxStudentFormContainer = document.getElementById('boxStudentFormContainer');
var winStudentForm          = document.getElementById('winStudentForm');
/* ------ End Global Variables Declaration ------*/

/* ------ Start Functions Declaration ------*/
function processFormWindow(title, buttonLabelText, buttonValue, focusedElementBefore, callback) {
    createContentOfFormWindow(title, buttonLabelText, buttonValue);
    addFeaturesForFormWindow(winStudentForm, focusedElementBefore, callback);
    showFormWindow();
}

function createContentOfFormWindow(title, buttonLabelText, buttonValue) {
    winStudentForm.innerHTML = `
        <div class="header-area">
            <div class="left-item">
                <img src="./images/suntech_logo.png">
                <label>${title}</label>
            </div>
            <div class="right-item" tabindex="0" title="Click để Đóng hộp thoại này">&times;</div>
        </div>

        <div class="main-area">
            <h3>Thông tin sinh viên</h3>

            <label>Họ và Tên:</label>
            <input type="text" id="txtFullName" tabindex="1">
            <br>

            <label>Địa chỉ Email:</label>
            <input type="text" id="txtEmailAddress" tabindex="1">
            <br>

            <label>Số điện thoại:</label>
            <input type="text" id="txtPhoneNumber" tabindex="1">
            <br>

            <label>Quê quán:</label>
            <input type="text" id="txtHomeTown" tabindex="1">
            <br>

            <label id="lblGender">Giới tính:</label>
            <input type="radio" name="gender" id="male" value="1" tabindex="1"> Nam
            <input type="radio" name="gender" id="female" value="2" tabindex="1"> Nữ
            <br>

            <label></label>
            <div id="divErrorInfo"></div>

            <label></label>
            <button type="button" id="btnSaveStudentInfo" value="${buttonValue}" tabindex="1">${buttonLabelText}</button>
            <div id="divResetStudentInfo" tabindex="1">
                <i class="fa fa-refresh" aria-hidden="true"></i>
            </div>
        </div>
    `;
}

function addFeaturesForFormWindow(divFormWindow, focusedElementBefore, callback) {
    txtFullName                 = document.getElementById('txtFullName');
    txtEmailAddress             = document.getElementById('txtEmailAddress');
    txtPhoneNumber              = document.getElementById('txtPhoneNumber');
    txtHomeTown                 = document.getElementById('txtHomeTown');
    radMale                     = document.getElementById('male');
    radFemale                   = document.getElementById('female');
    btnSaveStudentInfo          = document.getElementById('btnSaveStudentInfo');
    divResetStudentInfo         = document.getElementById('divResetStudentInfo');
    divErrorInfo                = document.getElementById('divErrorInfo')

    txtFullName.onkeypress      = function() { processOnKeyPress(event); }
    txtEmailAddress.onkeypress  = function() { processOnKeyPress(event); }
    txtPhoneNumber.onkeypress   = function() { processOnKeyPress(event); }
    txtHomeTown.onkeypress      = function() { processOnKeyPress(event); }
    radMale.onkeypress          = function() { processOnKeyPress(event); }
    radFemale.onkeypress        = function() { processOnKeyPress(event); }
    btnSaveStudentInfo.onclick  = function() { processOnSaveStudentInfo(); }
    divResetStudentInfo.onclick = function() { resetStudentForm(); }

    let divCloseFormWindow      = document.querySelector(`div#${divFormWindow.id} div.header-area div.right-item`);
    divCloseFormWindow.onclick  = function() { formCancel(focusedElementBefore, callback); }

    moveFormWindow(divFormWindow);
}

function moveFormWindow(divFormWindow) {
    var currentCoordinateX  = 0, 
        currentCoordinateY  = 0, 
        startCoordinateX    = 0, 
        startCoordinateY    = 0;

    let divFormWindowHeader = document.querySelector(`div#${divFormWindow.id} div.header-area`);

    if (divFormWindowHeader) {
        divFormWindowHeader.onmousedown = dragMouseDown;
    } else {
        divFormWindow.onmousedown = dragMouseDown;
    }

    function dragMouseDown(event) {
        event = event || window.event;

        startCoordinateX        = event.clientX;
        startCoordinateY        = event.clientY;

        document.onmousemove    = moveFormWindow;
        document.onmouseup      = stopMovingFormWindow;
    }

    function moveFormWindow(event) {
        event = event || window.event;

        currentCoordinateX      = startCoordinateX - event.clientX;
        currentCoordinateY      = startCoordinateY - event.clientY;

        startCoordinateX        = event.clientX;
        startCoordinateY        = event.clientY;

        divFormWindow.style.left = (divFormWindow.offsetLeft - currentCoordinateX) + "px";
        divFormWindow.style.top  = (divFormWindow.offsetTop - currentCoordinateY) + "px";
    }

    function stopMovingFormWindow() {
        document.onmousemove    = null;
        document.onmouseup      = null;
    }
}

function formCancel(focusedElementBefore, callback) {
    hideFormWindow();
    focusedElementBefore.focus();
    callback(false);
}

function showFormWindow() {
    let scrollbarWidth = getVerticalScrollbarWidthOfPage();

    if (scrollbarWidth > 0) {
        document.body.setAttribute('style', `overflow: hidden; padding-right: ${scrollbarWidth}px;`);
        boxStudentFormContainer.setAttribute('style', `padding-right: ${scrollbarWidth}px;`);
    }

    boxStudentFormContainer.classList.remove('hidden-overlay');
    boxStudentFormContainer.classList.add('visible-overlay');

    winStudentForm.removeAttribute('style');
    winStudentForm.classList.remove('hidden-window');
    winStudentForm.classList.remove('hidden-window-2');
    winStudentForm.classList.add('visible-window');
}

function hideFormWindow() {
    document.body.removeAttribute('style');

    boxStudentFormContainer.removeAttribute('style');
    boxStudentFormContainer.classList.remove('visible-overlay');
    boxStudentFormContainer.classList.add('hidden-overlay');

    winStudentForm.classList.remove('visible-window');
    winStudentForm.classList.add('hidden-window');
    setTimeout(function() { winStudentForm.classList.add('hidden-window-2'); }, 250);
}
/* ------ End Functions Declaration ------*/