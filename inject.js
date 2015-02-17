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
    size: 30,
    reference: 0,
    links: 0
}

// For ajax search capability
var xhr = new XMLHttpRequest();
var xhr_timeout;
// timeout for searching, and showing slow search message
var timeout_freq = 3000;


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
if (localStorage['ew_reference']) {
    ewprops.reference = localStorage['ew_reference'];
}
if (localStorage['ew_links']) {
    ewprops.links = localStorage['ew_links'];
}

var loader_url = $("#__EW_image_urls").attr("loader_icon");
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
    if (localStorage['ew_reference']) {
        ewprops.reference = localStorage['ew_reference'];
    }
    if (localStorage['ew_links']) {
        ewprops.links = localStorage['ew_links'];
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

    document.getElementById('content').style.marginLeft = '50px';
    document.getElementById('content').style.marginRight = '50px';
    document.getElementById('content').style.fontSize = ewprops.size +'px';
    document.getElementById('content').style.fontFamily = ewprops.font;
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
    document.getElementById('content').style.marginRight = '';
    document.getElementById('content').style.fontSize = '';
    document.getElementById('content').style.fontFamily = '';
    var references = document.getElementsByClassName('reference');
    for(var i = references.length -1; i>=0; i--) {
        references[i].style.display = "";
    }
    var links = document.getElementsByTagName("a");
    for(var i = links.length -1; i>=0; i--) {
        links[i].setAttribute("style", "color:#0645ad")
    }
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
    var dy = (currentPos - document.body.scrollTop) / 2;
    if (document.getElementById('easywiki').style.top == '')
        document.getElementById('easywiki').style.top = '2px';
    var y = parseInt(document.getElementById('easywiki').style.top) + dy;
    if (y > y2) y = y2;
    if (y < y1) y = y1;
    currentPos = document.body.scrollTop;
    document.getElementById('easywiki').style.top = y + 'px';

    //hide menu
    //hideSubMenu();
    hideContentMenu();
}
document.body.onscroll = monitor;


/**
 * Adding search capability to easywiki
 */
function searchew(event) {
    var source = document.getElementById('ewsearch');

    if (event.which == 13 && source.value.length) {
        window.location.href = "http://en.wikipedia.org/wiki/w/index.php?search=" +source.value;
    } else if (source.value.length){
        clearTimeout(xhr_timeout);
        var url = "http://en.wikipedia.org/wiki/w/index.php?search=" +source.value;
        // Abort existing operation
        xhr.abort();
        xhr.open('GET', url);
        //Add a property to xhr element
        xhr.url = url;
        xhr.searchKey = source.value;
        $(".ew_ss_header").css("background-image", "url(" +loader_url +")");
        xhr.send();

        // call the timeout for slow search
        var lasturl = url;
        xhr_timeout = setTimeout(function() {
            showtimeoutmessageXHR(lasturl, source.value);
        }, timeout_freq);

        document.getElementById('searchsuggestions').style.display = 'block';
        document.getElementsByClassName('ew_search_title')[0].innerHTML = 'Searching: ' +source.value;
    } else {
        xhr.abort();
        document.getElementById('searchsuggestions').style.display = 'none';
    }
}

// Code to initiate the search suggestion feature
xhr.onreadystatechange = XHRReadyStateChangeFunction;
function XHRReadyStateChangeFunction() {
    document.getElementsByClassName('ew_search_title')[0].innerHTML = 'Result: ' +this.searchKey;
    if (this.readyState == 4 && this.status == 200) {
        clearTimeout(xhr_timeout);

        $(".ew_ss_header").css("background-image", "none");
        if (this.url == this.responseURL) {
            var c = document.createElement('html');
            c.innerHTML = this.responseText;
            var dom = c.getElementsByClassName('mw-search-results');
            document.getElementsByClassName('ew_ss_results')[0].innerHTML = dom[0].outerHTML;
            document.getElementById('searchsuggestions').style.display = 'block';
        } else {
            // Parse and get introduction
            var tmpobj = document.createElement('html');
            tmpobj.innerHTML = this.response;
            var intro = $(tmpobj).find("#mw-content-text").children("p").eq(0)[0].innerText;

            intro = intro.replace(/(?:\[[\d]*\])/g, '');

            if (intro.indexOf('may refer to') != -1) {
                // No possible match found
                intro = $(tmpobj).find("#mw-content-text").children("ul")[0].outerHTML;
            }

            document.getElementsByClassName('ew_ss_results')[0].innerHTML = '<ul><li style="list-style-type:none; list-style-image: none; margin-left: 2px;"><a href="http://en.wikipedia.org/wiki/w/index.php?search=' 
                +this.searchKey 
                +'" style="text-transform: capitalize">' 
                +this.searchKey 
                +'</a><br> ' 
                +intro 
                +'</li></ul>';
            document.getElementById('searchsuggestions').style.display = 'block';
        }
    }
}

function showtimeoutmessageXHR(url, key) {
    document.getElementsByClassName('ew_ss_results')[0].innerHTML = '<div style="padding: 10px">'
    +'<a href="'
    + url
    +'" style="text-transform: capitalize; line-height: 2;" target="blank">'
    +key
    +'</a><br>'
    +'OOPS! the search is taking little longer than usual, wait while we fetch the content for you!</div>';
}

// Attach click listener to close button on search suggestion
document.getElementsByClassName('ew_ss_close')[0].onclick = function() {
    document.getElementById('searchsuggestions').style.display = 'none';
}

// Attach listener to enter button press on search input
document.getElementById('ewsearch').onkeyup = searchew;

// Trigger search when user clicks on search button
document.getElementById('ewsearch').onclick = function(event) {
    var parent_left = this.parentNode.offsetLeft;
    var parent_top = this.parentNode.offsetTop;
    if (event.x >= (parent_left + this.offsetLeft +this.offsetWidth - 10)
        && event.x <= (parent_left + this.offsetLeft +this.offsetWidth)) {
        if (event.y >= (parent_top + this.offsetTop)
            && event.y <= (parent_left + this.offsetLeft +this.offsetHeight)) {
            searchew({which: 13});
        }
    }
};


function hideContentMenu() {
    var target = document.getElementById('toc_');
    if (target != null) {
        target.style.display = 'none';
        document.getElementsByClassName('ewcmenu')[0].setAttribute('state', 'inactive');
    }
}

// Code to enable Move to top functionality
document.getElementsByClassName('movetotop')[0].addEventListener('click', function() {
    document.body.scrollTop = 0;
});


function addEWContextMenu() {
    var content = document.getElementById('toc');
    if (typeof content != undefined
        && content != null) {
        var contentObj = document.createElement('div');
        contentObj.className = "toc";
        contentObj.setAttribute("id", "toc_");
        contentObj.innerHTML = content.innerHTML;

        // Remove the content menu from actual UI
        content.parentNode.removeChild(content);

        // Modify the new content menu to suit our need
        // Insert to DOM
        document.body.appendChild(contentObj);

        // now change the position according to the position of
        // main easywiki box
        contentObj.style.left = document.getElementById('easywiki').offsetLeft +'px';
        contentObj.style.top = document.getElementById('easywiki').offsetHeight
        + 2 +'px';

        //Now change directly
        var contentObj = document.getElementById('toc_');

        // Remove title
        var temp = document.getElementById('toctitle');
        temp.parentNode.removeChild(temp);

        // Add listeners to internal links
        var links = document.getElementById('toc_').getElementsByTagName('a');
        var i;
        for (i = 0; i < links.length; i++) {
            if (links[i].href.indexOf('#') !== -1) {
                links[i].addEventListener('click', function() {
                    setTimeout(function() {
                        document.getElementById('easywiki').style.top =  '2px';
                    }, 300);
                });
            }
        }
        return true;
    }
    return false;
}

var isMenuClickEventAttached = false;
function addEventListenertoMenuImg() {
    // Add listener to cmenu img
    document.getElementsByClassName('ewcmenu')[0].addEventListener('click', function() {
        var source = document.getElementsByClassName('ewcmenu')[0];
        var target = document.getElementById('toc_');
        if (typeof target != undefined
            && target != null) {
            var state = source.getAttribute('state');
            if (typeof state == undefined)
                state = 'inactive';
            if (state == 'inactive') {
                // Need to show
                target.style.display = 'block';
                source.setAttribute('state', 'active');
            } else {
                target.style.display = 'none';
                source.setAttribute('state', 'inactive');
            }
            //hideSubMenu();
        } else {
            addEWContextMenu();
        }
    });
    isMenuClickEventAttached = true;
}

//==================================================================
// Get Content section from the wiki and add it as a context menu
//==================================================================
window.onload = function() {
    addEWContextMenu();
    addEventListenertoMenuImg();

    // adding event listener to shift + R button to minimize/maximize the read mode
    document.onkeypress = function(e) {
        if (e.shiftKey && e.which == 82) {
            document.getElementById('ewcheckbox').click();
        }
    };

};

setTimeout(function() {
    addEWContextMenu();
    // ^ reattempt incase previos attempt failed
    // after 3 seconds
    // adding event listener to shift + R button to minimize/maximize the read mode
    document.onkeypress = function(e) {
        if (e.shiftKey && e.which == 82) {
            document.getElementById('ewcheckbox').click();
        }
    };
    if (!isMenuClickEventAttached) addEventListenertoMenuImg();
}, 1000);


// Adjust menu position on window resize
window.onresize = function() {
    document.getElementById('toc_').style.left = document.getElementById('easywiki').offsetLeft +'px';
};





