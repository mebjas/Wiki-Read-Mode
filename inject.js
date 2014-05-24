/**
 * Wikipedia Read Mode, inject.js
 * This script will be injected to the wikipedia page
 * And it will function as a wiki script rather than a content 
 * Script
 */


//==================================================================
// loading properties from localStorage
//================================================================== 

var ewprops = {
	enabled: true,
	font: "Calibri",
	size: 30
}

if (localStorage['ew_enabled'] 
	&& localStorage['ew_enabled'] == "false") {
	ewprops.enabled = false;
}
if (localStorage['ew_font']) {
	ewprops.font = localStorage['ew_font'];
}
if (localStorage['ew_size']) {
	ewprops.size = localStorage['ew_size'];
}

//==================================================================
// Methods that will be called by eventlisteners
//==================================================================

//function to refref the properties
function refreshProperty() {
	if (localStorage['ew_font']) {
		ewprops.font = localStorage['ew_font'];
	}
	if (localStorage['ew_size']) {
		ewprops.size = localStorage['ew_size'];
	}
}

//add a function to reset the modifications
function setModification() {
	//refresh property first
	refreshProperty();

	try { 
		document.getElementsByClassName('infobox')[0].style.display = 'none';
	} catch (err) { /** do we need to do something about this error? **/ }

	try {
		document.getElementById('mw-panel').style.display = 'none';
	} catch (err) { /** do we need to do something about this error? **/ }
	
	document.getElementById('content').style.marginLeft = '10px';
	document.getElementById('content').style.fontSize = ewprops.size +'px';
	document.getElementById('content').style.fontFamily = ewprops.font;
}

//reset modifications done by the set function
function resetModification() {
	try { 
		document.getElementsByClassName('infobox')[0].style.display = '';
	} catch (err) {
		/** do we need to do something about this error? **/
	}

	try {
		document.getElementById('mw-panel').style.display = '';
	} catch (err) { /** do we need to do something about this error? **/ }

	document.getElementById('content').style.marginLeft = '12em';
	document.getElementById('content').style.fontSize = '';
	document.getElementById('content').style.fontFamily = '';
}

//called by checkbox, for readmode in UI
function checkChange() {
	if (document.getElementById('ewcheckbox').checked) setModification();
	else resetModification();
}

/**
 * Code implement, scroll up/down of the EW menu, with document scroll
 */
var y1 = -50;var y2 = 2;
var currentPos = document.body.scrollTop;
function monitor(event){
	var dy = (currentPos - document.body.scrollTop) / 5;
	if (document.getElementById('easywiki').style.top == '')
		document.getElementById('easywiki').style.top = '2px';
	var y = parseInt(document.getElementById('easywiki').style.top) + dy;
	if (y > y2) y = y2;
	if (y < y1) y = y1;
	currentPos = document.body.scrollTop;
	document.getElementById('easywiki').style.top = y + 'px';
}
document.body.onscroll = monitor;


/**
 * Adding search capability to easywiki
 */
function searchew(event) {
	var source = document.getElementById('ewsearch');

	if (event.which == 13 && source.value.length) {
		window.location.href = "http://en.wikipedia.org/wiki/w/index.php?search=" +source.value;
	}
}

document.getElementById('ewsearch').onkeyup = searchew;