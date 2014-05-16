

//testing notification

var flag = false;
/** for chrome notification **/
var opt = {
  type: "basic",
  title: "Secunic:",
  message: "testing notification",
  iconUrl: "icon.png"
}



var list = [];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    
  	if (request.domain != undefined) {
  		console.log("domain information recieved");
  		console.log(sender);
  		return;
  	}

    log(request.url);

    //testing notification
    if (!flag) {
    	console.log("trigger notif");
    	flag = true;
    	chrome.notifications.create("testnotif", opt, function getnotifid(id){});
    }
});


chrome.browserAction.setBadgeBackgroundColor({color: [0,255,0,0]});
var count = 0;
function log(message) {
	
	chrome.browserAction.setBadgeText({text: '' + ++count});
	var domain = getDomain(message);
	var i;
	for (i = 0; i < list.length; i++) {
		if (list[i].url == domain) {
			list[i].count++;
			break;
		}
	}

	if (i === list.length) {
		//not in list yet
		list[i] = {};
		list[i].url = domain;
		list[i].count = 1;
		$("section").append("<div data='" +domain.replace('.','') +"'><div class='count inlineblock'>1</div><div class='domain inlineblock'>" +domain +"</div></div>");
	} else {
		$("section div[data='" +domain.replace('.','') +"']").children(".count").html(list[i].count);
	}
}

function getDomain(url) {
	var arr = url.split('/');
	return arr[2];
}

