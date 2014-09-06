//=========================================
// Load init values from localStorage if they exist and 
// Make suitable output to dom
//=========================================
var property = {
					enabled : true,
					font: "Calibri",
					size: 18
				}

// For enabled property, Enabled by default
if (localStorage['enabled'] && localStorage['enabled'] === "false") {
	$(".enabled").html("Disabled")
		.removeClass("enabled")
		.addClass("disabled");
	$(".button-disabled").html("Enable")
		.removeClass("button-disabled")
		.addClass("button-enabled");
	$(".custom-size, .custom-font").attr("disabled","true");

	property.enabled = false;
}

// For font property, Calibri by default
if (localStorage['font'] && localStorage['font'] != "Calibri") {
	$(".custom-font").val(localStorage['font']);
	property.font = localStorage['font'];
}

// For font-size, 18px by default
if (localStorage['size'] && parseInt((localStorage['size'])) != 18) {
	$(".custom-size").val(parseInt(localStorage['size']));
	property.size = parseInt(localStorage['size']);
}

//=========================================
// Adding event listeners
//=========================================
$(document).ready(function() {

	//for disable enable button
	$(".button-disabled,.button-enabled").click(function() {
		if ($(this).attr("class") == "button-disabled") {
			//disable
			localStorage['enabled'] = false;
			$(".enabled").html("Disabled")
				.removeClass("enabled")
				.addClass("disabled");
			$(".button-disabled").html("Enable")
				.removeClass("button-disabled")
				.addClass("button-enabled");
			$(".custom-size, .custom-font").attr("disabled","true");

			property.enabled = false;
		} else {
			//enable
			localStorage['enabled'] = true;
			$(".disabled").html("Enabled").removeClass("disabled").addClass("enabled");
			$(".button-enabled").html("Disable")
				.removeClass("button-enabled")
				.addClass("button-disabled");

			//removeProp() not functional in jquery so using js for this
			document.getElementsByClassName("custom-font")[0].removeAttribute("disabled");
			document.getElementsByClassName("custom-size")[0].removeAttribute("disabled");

			property.enabled = true;
		}

		//save changes to existing pages
		passData();
	});

	//for changing font
	$(".custom-font").change(function() {
		localStorage['font'] = $(this).val();
		property.font = $(this).val();
		
		//pass this as message to active tabs
		passData();
	});
	
	//for changing font size
	$(".custom-size").change(function() {
		localStorage['size'] = $(this).val();
		property.size = $(this).val();

		//pass this as message to active tabs
		passData();
	});
});

// Animation during saving config
function saveAnimation() {
	var icon1 = "./icons/pencil.png";
	var icon2 = "./icon.png";
	$('.logoimg').css('background-image', "url(" +icon2 +")");
	//chrome.browserAction.setIcon({path: icon1});
	setTimeout(function() {
		$('.logoimg').css('background-image', "url(" +icon1 +")");
		//chrome.browserAction.setIcon({path: icon2});
	}, 500);
}

//function to pass the configuration to content script
function passData() {
	//console.log(property);
	

	//send the data as a message
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, property, function(response) {
	  	console.log(response);

	  	try {
		    if (response.ack != undefined) {
		    	if (response.ack === true)
		    		saveAnimation();
		    }
		} catch (err) {
			
		}
	  });
	});
}

var t;