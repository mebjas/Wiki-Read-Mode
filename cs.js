//================================================
// init values from localStorage
//================================================
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


var blacklist = ['Main_Page','Portal:Contents','Portal:Featured_content','Portal:Current_events','KPOB','Help:Contents','Wikipedia:Community_portal','Special:RecentChanges','Wikipedia:Contact_us']

function modify() {

	//check for blacklist here
	if (isBlackListed()) {
		document.getElementById('ewcheckbox').checked = false;
		document.getElementById('ewbutton').innerHTML = 'Remove from Blacklist';
		return false;
	} 

	try { 
	  document.getElementsByClassName('infobox')[0].style.display = 'none';
	} catch (err) { /** do we need to do something about this error? **/ }

	try {
		document.getElementById('mw-panel').style.display = 'none';
	} catch (err) { /** do we need to do something about this error? **/ }

	document.getElementById('content').style.marginLeft = '10px';
	document.getElementById('content').style.fontSize = ewprops.size +'px';
	document.getElementById('content').style.fontFamily = ewprops.font;
	document.getElementById('ewcheckbox').checked = true;
}

function isBlackListed()
{
	var str = location.href.split('/')[4];
	for(var i = 0; i < blacklist.length; i++) {
		if(blacklist[i] === str)
			return true;
	}
	return false;
}



var newDiv = "<div id='easywiki'><input type='checkbox' id='ewcheckbox' onchange='checkChange()'> Read Mode | <input type='text' id='ewsearch' placeholder='Search'> <div class='ewmenu'><span>&#x25BC;</span></div></div>";
document.body.innerHTML += newDiv;
document.getElementsByClassName('ewmenu')[0].innerHTML += "<div class='ewsubmenu'><div option='blacklist'>Blacklist this page</div><div option='top'>Move to top&nbsp;&nbsp;&uarr;</div></div>";

//code to inject the script to wikipedia 
function reqListener () {
	var script_ew = document.createElement('script');
	script_ew.textContent = this.responseText;
	(document.head||document.documentElement).appendChild(script_ew);
}

var url = chrome.extension.getURL("inject.js");
var xhrObj = new XMLHttpRequest();
xhrObj.onload = reqListener;
xhrObj.open("GET",url);
xhrObj.send();



//trigger the modifying function
if(ewprops.enabled)
	modify();

//for recieving property update message from extension
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.enabled != undefined 
    	&& request.font != undefined
    	&& request.size != undefined ) {

    	ewprops.enabled = request.enabled;
    	ewprops.font = request.font;
    	ewprops.size = request.size;

    	localStorage['ew_enabled'] = ewprops.enabled;
    	//need to reflect these changes
    	localStorage['ew_size'] = ewprops.size;
    	localStorage['ew_font'] = ewprops.font;

    	if (ewprops.enabled) {
    		document.getElementById('content').style.fontSize = ewprops.size +'px';
			document.getElementById('content').style.fontFamily = ewprops.font;
			document.getElementById('ewcheckbox').checked = true;
    	}

    	sendResponse({ack: true});
    }
});
