/**
 * code to trigger the clicked() on page load
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {

	/**
	 * attempting to inject before complete load
	 * this will result in earl loading of all anims
	 */
	
	//chrome.tabs.executeScript(tabId, {code:'clicked(false);'});
	
	if (changeInfo.status === 'complete') {
	
		/**
		 * injecting code once load has been completed
		 */
		chrome.tabs.executeScript(tabId, { file: "jquery-2.1.0.min.js" }, function() {
			chrome.tabs.executeScript(tabId, {file: "code.js"}, function(){
			});
		});
		
    }

});