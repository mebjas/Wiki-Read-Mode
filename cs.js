//================================================
// init values from localStorage
//================================================
var ewprops = {
    enabled: true,
    font: "Calibri",
    size: 30,
    reference: 0,
    links: 0
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
if (localStorage['ew_reference']) {
    ewprops.reference = localStorage['ew_reference'];
}
if (localStorage['ew_links']) {
    ewprops.links = localStorage['ew_links'];
}

/**
 * Array of those pages that are blacklisted by default
 */
var blacklist = ['Main_Page','Portal:Contents','Portal:Featured_content','Portal:Current_events','KPOB','Help:Contents','Wikipedia:Community_portal','Special:RecentChanges','Wikipedia:Contact_us'];

/**
 * Function to implement basic modification
 */
function modify() {

    //check for blacklist here
    if (isBlackListed()) {
        document.getElementById('ewcheckbox').checked = false;
        return false;
    }

    try {
        document.getElementsByClassName('infobox')[0].style.display = 'none';
    } catch (err) { /** do we need to do something about this error? **/ }

    try {
        document.getElementById('mw-panel').style.display = 'none';
    } catch (err) { /** do we need to do something about this error? **/ }

    document.getElementById('content').style.marginLeft = '50px';
    document.getElementById('content').style.marginRight = '50px';
    document.getElementById('content').style.fontSize = ewprops.size +'px';
    document.getElementById('content').style.fontFamily = ewprops.font;
    document.getElementById('ewcheckbox').checked = true;
    if(ewprops.reference) {
        //remove references
        var references = document.getElementsByClassName('reference');
        for(var i = references.length -1; i>=0; i--) {
            references[i].style.display = "none";
        }
    } else {
        //add references back
        var references = document.getElementsByClassName('reference');
        for(var i = references.length -1; i>=0; i--) {
            references[i].style.display = "";
        }
    }
    if(ewprops.links) {
        var links = document.getElementsByTagName("a");
        for(var i = links.length -1; i>=0; i--) {
            links[i].setAttribute("style", "color:#000000")
        }
    } else {
        var links = document.getElementsByTagName("a");
        for(var i = links.length -1; i>=0; i--) {
            links[i].setAttribute("style", "color:#0645ad")
        }
    }
}

/**
 * Function to reset basic modification
 */
function resetModification()
{
    try {
        document.getElementsByClassName('infobox')[0].style.display = '';
    } catch (err) {
        /** do we need to do something about this error? **/
    }
    try {
        document.getElementById('mw-panel').style.display = '';
    } catch (err) { /** do we need to do something about this error? **/ }

    document.getElementById('content').style.marginLeft = '12em';
    document.getElementById('content').style.marginRight = '';
    document.getElementById('content').style.fontSize = '';
    document.getElementById('content').style.fontFamily = '';

    document.getElementById('ewcheckbox').checked = false;
    var references = document.getElementsByClassName('reference');
    for(var i = references.length -1; i>=0; i--) {
        references[i].style.display = "";
    }
    var links = document.getElementsByTagName("a");
    for(var i = links.length -1; i>=0; i--) {
        links[i].setAttribute("style", "color:#0645ad")
    }
}

/**
 * Function to check if current url is blacklisted
 * @param: void
 * @return: bool, true for blacklisted, else false
 */
function isBlackListed()
{
    var str = location.href.split('/')[4];
    for(var i = 0; i < blacklist.length; i++) {
        if(blacklist[i] === str)
            return true;
    }
    if (/.*:\/\/.*\/wiki\/.*\/.*/.exec(document.location.href) != null)
        return true;
    return false;
}

var menuIcon = chrome.extension.getURL("icons/navicon.png");
var downIcon = chrome.extension.getURL("icons/chevron-down.png");
var upIcon = chrome.extension.getURL("icons/chevron-up.png");
var searchIcon = chrome.extension.getURL("icons/search-ltr.png");
var script_url = chrome.extension.getURL("inject.js");

// #todo: change state to inactive by default
var newDiv = "<div id='easywiki'><img src='"
    +menuIcon
    +"' class='ewcmenu px20img' state='inactive' title='View Contents'><input type='checkbox' id='ewcheckbox' onchange='checkChange()'> Read Mode | <input type='text' id='ewsearch' placeholder='Search' style='background-image: url(" +searchIcon +")'> <div class='ewmenu'><span>"
    +"<img src='" +upIcon +"' class='movetotop px20img' title='Move to top'>"
    +"</span></div></div>"
    +"<div id='searchsuggestions'><div class='ew_ss_header'><span class='ew_search_title'>Search Suggestions</span>"
    +"<!--<span class='ew_ss_min'>-</span>--><span class='ew_ss_close'>X</span>"
    +"</div><div class='ew_ss_results'></div></div>";
document.body.innerHTML += newDiv;
//document.getElementsByClassName('ewmenu')[0].innerHTML += "<div class='ewsubmenu'><div option='blacklist'>Never Modify this page</div><div option='top'>Move to top&nbsp;&nbsp;&uarr;</div></div>";

//code to inject the script to wikipedia
var script_ew = document.createElement('script');
script_ew.src = script_url;
(document.head||document.documentElement).appendChild(script_ew);


//trigger the modifying function
if(ewprops.enabled)
    modify();

/**
 * Code for recieving property update message from extension
 * And for proper action
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.enabled != undefined
            && request.font != undefined
            && request.size != undefined ) {

            ewprops.enabled = request.enabled;
            ewprops.font = request.font;
            ewprops.size = request.size;
            ewprops.reference = request.reference;
            ewprops.links = request.links;

            localStorage['ew_enabled'] = ewprops.enabled;
            //need to reflect these changes
            localStorage['ew_size'] = ewprops.size;
            localStorage['ew_font'] = ewprops.font;
            localStorage['ew_reference'] = ewprops.reference;
            localStorage['ew_links'] = ewprops.links;

            if (ewprops.enabled) {

                /**
                 * hide the not required data before implementing new property
                 */
                try {
                    document.getElementsByClassName('infobox')[0].style.display = 'none';
                } catch (err) { /** do we need to do something about this error? **/ }

                try {
                    document.getElementById('mw-panel').style.display = 'none';
                } catch (err) { /** do we need to do something about this error? **/ }
                document.getElementById('content').style.marginLeft = '10px';

                /**
                 * implement the new properties
                 */
                document.getElementById('content').style.fontSize = ewprops.size +'px';
                document.getElementById('content').style.fontFamily = ewprops.font;
                document.getElementById('ewcheckbox').checked = true;
                if(ewprops.reference) {
                    //remove references
                    var references = document.getElementsByClassName('reference');
                    for(var i = references.length -1; i>=0; i--) {
                        references[i].style.display = "none";
                    }
                } else {
                    //add references back
                    var references = document.getElementsByClassName('reference');
                    for(var i = references.length -1; i>=0; i--) {
                        references[i].style.display = "";
                    }
                }
                if(ewprops.links) {
                    var links = document.getElementsByTagName("a");
                    for(var i = links.length -1; i>=0; i--) {
                        links[i].setAttribute("style", "color:#000000")
                    }
                } else {
                    var links = document.getElementsByTagName("a");
                    for(var i = links.length -1; i>=0; i--) {
                        links[i].setAttribute("style", "color:#0645ad")
                    }
                }
            } else {
                resetModification();
            }

            sendResponse({ack: true});
        }
    });
