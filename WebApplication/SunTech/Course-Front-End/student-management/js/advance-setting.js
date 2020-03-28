
/* ------ Start Global Variables Declaration ------*/
var divAdvanceSettingIcon   = document.getElementById('divAdvanceSettingIcon');
var divSettingBoxContainer  = document.querySelector('div.advance-setting-container div.setting-box-container');

var txtKeywordSearch        = document.getElementById('txtKeywordSearch');
var btnClearText            = document.getElementById('btnClearText');
var selGender               = document.getElementById('selGender');

var chkNotificationAdd      = document.getElementById('chkNotificationAdd');
var chkNotificationUpdate   = document.getElementById('chkNotificationUpdate');
var chkNotificationDelete   = document.getElementById('chkNotificationDelete');

var isCtrlKeyPressed        = false;
/* ------ End Global Variables Declaration ------*/

/* ------ Start Functions Declaration ------*/
divAdvanceSettingIcon.onclick   = function() { processAdvanceSettingBox(); }

txtKeywordSearch.onkeypress     = function() { processOnKeyPressForKeywordSearch(event); }
txtKeywordSearch.onkeyup        = function() { processOnKeyUpForKeywordSearch(event); }
txtKeywordSearch.onkeydown      = function() { processOnKeyDownForKeywordSearch(event); }
btnClearText.onclick            = function() { clearTextOfKeywordSearch(); }

chkNotificationAdd.onclick      = function() { switchNotificationAdd(); }
chkNotificationUpdate.onclick   = function() { switchNotificationUpdate(); }
chkNotificationDelete.onclick   = function() { switchNotificationDelete(); }

function processAdvanceSettingBox() {
    if (divAdvanceSettingIcon.className.toLowerCase() !== 'transformed-menu') {
        showAdvanceSettingBox();
    } else {
        hideAdvanceSettingBox();
    }
}

function showAdvanceSettingBox() {
    divSettingBoxContainer.classList.remove('hidden-setting-box-container-1');
    divSettingBoxContainer.classList.remove('hidden-setting-box-container-2');
    divSettingBoxContainer.classList.toggle('visible-setting-box-container');

    divAdvanceSettingIcon.classList.toggle('transformed-menu');
}

function hideAdvanceSettingBox() {
    divSettingBoxContainer.classList.remove('visible-setting-box-container');
    divSettingBoxContainer.classList.toggle('hidden-setting-box-container-1');

    setTimeout(function() {
        divSettingBoxContainer.classList.toggle('hidden-setting-box-container-2');
        divAdvanceSettingIcon.classList.toggle('transformed-menu');
    }, 500);
}

function processOnKeyPressForKeywordSearch(event) {
    // Handle when end-user press Enter key on the keyboard.
    if (event.keyCode == 13) {
        event.preventDefault();
        filterSearch();
    }
}

function processOnKeyUpForKeywordSearch(event) {
    let inputTextLength = txtKeywordSearch.value.length;
    let buttonClassName = btnClearText.className.toLowerCase().trim();

    if (inputTextLength > 0) {
        btnClearText.classList.remove('hidden-button');

        if (buttonClassName.indexOf('visible-button') === -1) {
            btnClearText.classList.add('visible-button');
        }
    }

    // Handle when end-user press Backspace or Delete key on the keyboard.
    if (event.keyCode === 8 || event.keyCode === 46) {
        processDisplayOfClearTextButton(inputTextLength, buttonClassName);
    }

    // Handle when end-user press Ctrl+X on the keyboard.
    if (event.keyCode === 88 && isCtrlKeyPressed) {
        processDisplayOfClearTextButton(inputTextLength, buttonClassName);
    }
}

function processOnKeyDownForKeywordSearch(event) {
    // Handle when end-user press Ctrl key on the keyboard.
    if (event.ctrlKey) {
        isCtrlKeyPressed = true;
    } else {
        isCtrlKeyPressed = false;
    }
}

function processDisplayOfClearTextButton(inputTextLength, buttonClassName) {
    if (inputTextLength > 0) {
        btnClearText.classList.remove('hidden-button');

        if (buttonClassName.indexOf('visible-button') === -1) {
            btnClearText.classList.add('visible-button');
        }
    } else {
        btnClearText.classList.remove('visible-button');

        if (buttonClassName.indexOf('hidden-button') === -1) {
            btnClearText.classList.add('hidden-button');
        }
    }
}

function clearTextOfKeywordSearch() {
    txtKeywordSearch.value = EMPTY_STRING;
    txtKeywordSearch.focus();

    btnClearText.classList.remove('visible-button');
    btnClearText.classList.toggle('hidden-button');
}

function switchNotificationAdd() {
    try {
        handleExceptionOfLocalStorage();

        if (chkNotificationAdd.checked === true) {
            localStorage.setItem('isAddNotificationSent', '1');
        } else {
            localStorage.setItem('isAddNotificationSent', '0');
        }
    } catch(exception) {
        sendAlertNotification(`
            Chức năng này không khả dụng do Trình duyệt hiện tại không hỗ trợ lưu trữ dữ liệu (Local Storage).<br>
            Bạn vui lòng sử dụng Trình duyệt khác như: Chrome, Opera hoặc FireFox.
        `, 4500);
    }
}

function switchNotificationUpdate() {
    try {
        handleExceptionOfLocalStorage();

        if (chkNotificationUpdate.checked === true) {
            localStorage.setItem('isUpdateNotificationSent', '1');
        } else {
            localStorage.setItem('isUpdateNotificationSent', '0');
        }
    } catch(exception) {
        sendAlertNotification(`
            Chức năng này không khả dụng do Trình duyệt hiện tại không hỗ trợ lưu trữ dữ liệu (Local Storage).<br>
            Bạn vui lòng sử dụng Trình duyệt khác như: Chrome, Opera hoặc FireFox.
        `, 4500);
    }
}

function switchNotificationDelete() {
    try {
        handleExceptionOfLocalStorage();

        if (chkNotificationDelete.checked === true) {
            localStorage.setItem('isDeleteNotificationSent', '1');
        } else {
            localStorage.setItem('isDeleteNotificationSent', '0');
        }
    } catch(exception) {
        sendAlertNotification(`
            Chức năng này không khả dụng do Trình duyệt hiện tại không hỗ trợ lưu trữ dữ liệu (Local Storage).<br>
            Bạn vui lòng sử dụng Trình duyệt khác như: Chrome, Opera hoặc FireFox.
        `, 4500);
    }
}

function initializeAllNotificationSettings() {
    initializeNotificationAdd();
    initializeNotificationUpdate();
    initializeNotificationDelete();
}

function initializeNotificationAdd() {
    handleExceptionOfLocalStorage();

    let isAddNotificationSent = localStorage.getItem('isAddNotificationSent');

    if (isAddNotificationSent) {
        if (isAddNotificationSent === '1') {
            chkNotificationAdd.checked = true;
        } else if (isAddNotificationSent === '0') {
            chkNotificationAdd.checked = false;
        } else {
            localStorage.setItem('isAddNotificationSent', '1');
            chkNotificationAdd.checked = true;
        }
    } else {
        localStorage.setItem('isAddNotificationSent', '1');
        chkNotificationAdd.checked = true;
    }
}

function initializeNotificationUpdate() {
    handleExceptionOfLocalStorage();

    let isUpdateNotificationSent = localStorage.getItem('isUpdateNotificationSent');

    if (isUpdateNotificationSent) {
        if (isUpdateNotificationSent === '1') {
            chkNotificationUpdate.checked = true;
        } else if (isUpdateNotificationSent === '0') {
            chkNotificationUpdate.checked = false;
        } else {
            localStorage.setItem('isUpdateNotificationSent', '1');
            chkNotificationUpdate.checked = true;
        }
    } else {
        localStorage.setItem('isUpdateNotificationSent', '1');
        chkNotificationUpdate.checked = true;
    }
}

function initializeNotificationDelete() {
    handleExceptionOfLocalStorage();

    let isDeleteNotificationSent = localStorage.getItem('isDeleteNotificationSent');

    if (isDeleteNotificationSent) {
        if (isDeleteNotificationSent === '1') {
            chkNotificationDelete.checked = true;
        } else if (isDeleteNotificationSent === '0') {
            chkNotificationDelete.checked = false;
        } else {
            localStorage.setItem('isDeleteNotificationSent', '1');
            chkNotificationDelete.checked = true;
        }
    } else {
        localStorage.setItem('isDeleteNotificationSent', '1');
        chkNotificationDelete.checked = true;
    }
}
/* ------ End Functions Declaration ------*/