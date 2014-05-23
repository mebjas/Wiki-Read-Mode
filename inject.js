var ewprops = {
	enabled: true,
	font: "Calibri",
	size: 30
}
if (localStorage['ew_enabled'] && localStorage['ew_enabled'] == "false") {
	ewprops.enabled = false;
}
if (localStorage['ew_font']) {
	ewprops.font = localStorage['ew_font'];
}
if (localStorage['ew_size']) {
	ewprops.size = localStorage['ew_size'];
}

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

function checkChange() {
	if (document.getElementById('ewcheckbox').checked) setModification();
	else resetModification();
}

var y1 = -50;var y2 = 2;
var currentPos = document.body.scrollTop;
function monitor(){
	var dy = (currentPos - document.body.scrollTop) / 5;
	if (document.getElementById('easywiki').style.top == '')
		document.getElementById('easywiki').style.top = '2px';
	var y = parseInt(document.getElementById('easywiki').style.top) + dy;
	if (y > y2) y = y2;
	if (y < y1) y = y1;
	currentPos = document.body.scrollTop;
	document.getElementById('easywiki').style.top = y + 'px';

	//on scrollup focus on the searchbox
	if (dy < 0) {
		document.getElementById('ewsearch').focus();
	}
}
document.body.onscroll = monitor;


//adding search capability to easywiki
function searchew(event) {
	var source = document.getElementById('ewsearch');
	if (event.which == 13 && source.value.length) {
		window.location.href = "http://en.wikipedia.org/wiki/w/index.php?search=" +source.value;
	}
}

document.getElementById('ewsearch').onkeyup = searchew;