/* ------ Start Constants Declaration ------*/

const DISPLAY_TABLE_STRING = 'Display Multiplication Table';
const HIDE_TABLE_STRING = 'Hide Multiplication Table';
const EMPTY_STRING = '';

/* ------ End Constants Declaration ------*/


/* ------ Start Global Variables Declaration ------*/

var isTableVisible = false; // used for checking whether table is being visible or hidden.
var divDisplayTable = document.getElementById('divMultiplicationTable');

var btnDisplayTable = document.getElementById('btnDisplayTable');
var txtStartNumber = document.getElementById('txtStartNumber');
var txtEndNumber = document.getElementById('txtEndNumber');

var errorInfo = document.getElementById('errorInfo');
var errorContent = EMPTY_STRING; // used for assigning the content value of the object 'errorInfo'.

/* ------ End Global Variables Declaration ------*/


/* ------ Start Functions Declaration ------*/

function createMultiplicationTable(startNumber, endNumber, flag = false) {
	let content = `<table>`;

	for (let x = 1; x <= 10; x++) {
		content += `<tr>`;

		for (let y = startNumber; y <= endNumber; y++) {
			if (y % 2 === 0) {
				content += `<td><font color='red'>${y} x ${x} = ${x * y}</font></td>`;
			} else {
				content += `<td><font color='blue'>${y} x ${x} = ${x * y}</font></td>`;
			}
		}

		content += `</tr>`;
	}

	content += `</table>`;

	return content;
}

function displayMultiplicationTable() {
	if (!isTableVisible) {
		if (validateForm()) {
			isTableVisible = true;
			divDisplayTable.className = 'visible-table';
			btnDisplayTable.value = HIDE_TABLE_STRING;

			let startNumber = parseInt(txtStartNumber.value.trim());
			let endNumber = parseInt(txtEndNumber.value.trim());
			divDisplayTable.innerHTML = createMultiplicationTable(startNumber, endNumber);

			errorInfo.innerHTML = EMPTY_STRING;
			errorInfo.className = 'hidden-error-info';
		} else {
			isTableVisible = false;
			divDisplayTable.className = 'hidden-table';

			errorInfo.innerHTML = errorContent;
			errorInfo.className = 'visible-error-info';
		}
	} else {
		isTableVisible = false;
		divDisplayTable.className = 'hidden-table';
		btnDisplayTable.value = DISPLAY_TABLE_STRING;
	}
}

function validateForm() {
	let startNumber = txtStartNumber.value.trim();
	let endNumber = txtEndNumber.value.trim();

	if (isEmpty(startNumber)) {
		errorContent = 'Start Number is required !!!';
		txtStartNumber.focus();
		return false;
	} else if (isEmpty(endNumber)) {
		errorContent = 'End Number is required !!!';
		txtEndNumber.focus();
		return false;
	} else if (isNotNumeric(startNumber)) {
		errorContent = 'Start Number must be a numeric value !!!';
		txtStartNumber.focus();
		return false;
	} else if (isNotNumeric(endNumber)) {
		errorContent = 'End Number must be a numeric value !!!';
		txtEndNumber.focus();
		return false;
	}

	startNumber = parseInt(startNumber);
	endNumber = parseInt(endNumber);
	if (isInvalidValue(startNumber, endNumber, txtStartNumber, txtEndNumber)) {
		return false;
	}

	return true;
}

function isEmpty(inputData) {
	return ((inputData === EMPTY_STRING) || (inputData.length === 0));
}

function isNotNumeric(inputData) {
	return !(/^(\-{0,1})[0-9]+$/.test(inputData));
}

function isInvalidValue(startNumber, endNumber, txtStartNumber, txtEndNumber) {
	if (startNumber < 1 || startNumber > 10) {
		errorContent = 'Start Number must be an integer from 1 to 10 !!!';
		txtStartNumber.focus();
		return true;
	} else if (endNumber < 1 || endNumber > 10) {
		errorContent = 'End Number must be an integer from 1 to 10 !!!';
		txtEndNumber.focus();
		return true;
	} else if (startNumber > endNumber) {
		errorContent = 'Start Number must be less than or equal to End Number !!!';
		return true;
	}

	return false;
}

function processOnKeyPress(event) {
	if (isTableVisible) {
		isTableVisible = false;
		btnDisplayTable.value = DISPLAY_TABLE_STRING;
	}

	// Handle when end-user press Enter key on the keyboard.
	if (event.keyCode == 13) {
		event.preventDefault();
		displayMultiplicationTable();
	}
}

function processOnKeyUp(event) {
	// Handle when end-user press Backspace or Delete key on the keyboard.
	if (event.keyCode == 8 || event.keyCode == 46) {
		if (!validateForm()) {
			event.stopPropagation();
			btnDisplayTable.value = DISPLAY_TABLE_STRING;
		}
	}
}

/* ------ End Functions Declaration ------*/