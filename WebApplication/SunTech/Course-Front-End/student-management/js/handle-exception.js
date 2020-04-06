
/* ------ Start Functions Declaration ------*/
function handleExceptionsForPage() {
    // Handle exception of localStorage which is not supported by some Browsers in some cases.
    alert('localStorage = ', localStorage);
    alert('typeof(localStorage) = ', typeof(localStorage));
    if (typeof(localStorage) === 'undefined') {
        alert('handleExceptionsForPage()');
        handleExceptionOfLocalStorage();
    }
}

function handleExceptionOfLocalStorage() {
    alert('handleExceptionOfLocalStorage()');
    let exceptionObject = {
        messageForAlertNotification : 'abc', 
        messageForStudentDataTable  : 'def'
    };
    alert('exceptionObject = ', exceptionObject);
    alert('exceptionObject.messageForAlertNotification = ', exceptionObject.messageForAlertNotification);
    alert('exceptionObject.messageForStudentDataTable = ', exceptionObject.messageForStudentDataTable);

    let currentBrowser = getCurrentBrowser().toLowerCase().trim();
    alert('currentBrowser = ', currentBrowser);

    if (currentBrowser === 'safari') {
        alert('using safari');
        alert('exceptionObject = ', exceptionObject);
        alert('typeof(exceptionObject) = ', typeof(exceptionObject));
        alert('exceptionObject.messageForAlertNotification = ', exceptionObject.messageForAlertNotification);
        alert('exceptionObject.messageForStudentDataTable = ', exceptionObject.messageForStudentDataTable);
        throwExceptionMessagesInSafari(exceptionObject);
    } else if (currentBrowser === 'edge') {
        throwExceptionMessagesInEdge(exceptionObject);
    } else {
        alert('using another browser');
        throwExceptionMessagesInOtherBrowsers(exceptionObject);
    }
}

function throwExceptionMessagesInSafari(exceptionObject) {
    exceptionObject.messageForAlertNotification = `
        Chức năng này không khả dụng do Safari ở chế độ thông thường (Public) không hỗ trợ lưu trữ dữ liệu.<br>
        Bạn vui lòng chuyển Trình duyệt sang chế độ riêng tư (Private) để sử dụng chương trình.
    `;

    exceptionObject.messageForStudentDataTable = `
        Safari ở chế độ thông thường (Public) không hỗ trợ lưu trữ dữ liệu (Local Storage).<br>
        Bạn vui lòng chuyển Trình duyệt sang chế độ riêng tư (Private) để sử dụng chương trình.
    `;

    throw exceptionObject;
}

function throwExceptionMessagesInEdge(exceptionObject) {
    exceptionObject.messageForAlertNotification = `
        Chức năng này không khả dụng do Microsoft Edge không hỗ trợ lưu trữ dữ liệu khi chạy trực tiếp HTML File.<br>
        Bạn vui lòng chạy File chương trình qua http/https server.<br>
        Hoặc bạn có thể sử dụng Trình duyệt khác như: Chrome, Opera hoặc Firefox.
    `;

    exceptionObject.messageForStudentDataTable = `
        Microsoft Edge không hỗ trợ lưu trữ dữ liệu (Local Storage) khi chạy trực tiếp HTML File.<br>
        Bạn vui lòng chạy File chương trình qua http/https server (localhost, GitHub, ...).<br>
        Hoặc bạn có thể sử dụng Trình duyệt khác như: Chrome, Opera hoặc Firefox.
    `;

    throw exceptionObject;
}

function throwExceptionMessagesInOtherBrowsers(exceptionObject) {
    exceptionObject.messageForAlertNotification = `
        Chức năng này không khả dụng do Trình duyệt hiện tại không hỗ trợ lưu trữ dữ liệu.<br>
        Bạn vui lòng chuyển qua Trình duyệt khác như: Chrome, Opera hoặc Firefox để sử dụng chương trình.
    `;

    exceptionObject.messageForStudentDataTable = `
        Trình duyệt hiện tại không hỗ trợ lưu trữ dữ liệu (Local Storage).<br>
        Bạn vui lòng chuyển qua Trình duyệt khác như: Chrome, Opera hoặc Firefox để sử dụng chương trình.
    `;

    throw exceptionObject;
}

function handleUndefinedException(isFunctionCallOnLoadPage = true) {
    let messageForAlertNotification = `
        Chức năng này không khả dụng do xảy ra lỗi chưa xác định.<br>
        Bạn vui lòng liên hệ với Tác giả của chương trình để được trợ giúp.
    `;

    let messageForStudentDataTable = `
        Lỗi chưa xác định !!!<br>
        Bạn vui lòng liên hệ với Tác giả của chương trình để được trợ giúp.
    `;

    if (isFunctionCallOnLoadPage) {
        initializeSettingsWhenException(messageForAlertNotification);
        renderTableForErrorInfo(messageForStudentDataTable);
    } else {
        sendAlertNotification(`${messageForAlertNotification}`, 6000);
    }
}

function renderTableForErrorInfo(exceptionMessage) {
    let tableContent = TABLE_HEADER;

    tableContent += `
        <tr class="error-info">
            <td align="center" colspan="${TABLE_COLUMN_COUNT}">
                ${exceptionMessage}
            </td>
        </tr>
    `;

    tblStudentInfoList.innerHTML = tableContent;
}
/* ------ End Functions Declaration ------*/