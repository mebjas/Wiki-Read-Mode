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
	document.getElementById('mw-panel').style.display = 'none';
	document.getElementById('content').style.marginLeft = '10px';
	document.getElementById('content').style.fontSize = '30px';
	document.getElementById('content').style.fontFamily = 'Calibri';
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



var newDiv = "<div id='easywiki'><input type='checkbox' id='ewcheckbox' onchange='checkChange()'> Read Mode | <button id='ewbutton'>Blacklist from Read Mode</button></div>";
document.body.innerHTML += newDiv;


var code = "//add a function to reset the modifications\n"
			+"function setModification() {\n"
			+"try { \n"
			+"  document.getElementsByClassName('infobox')[0].style.display = 'none';\n"
			+"} catch (err) { /** do we need to do something about this error? **/ }"
			+"document.getElementById('mw-panel').style.display = 'none';\n"
			+"document.getElementById('content').style.marginLeft = '10px';\n"
			+"document.getElementById('content').style.fontSize = '30px';\n"
			+"document.getElementById('content').style.fontFamily = 'Calibri';\n"
			+"}\n"
			+"function resetModification() {\n"
			+"	try { \n"
			+"	  document.getElementsByClassName('infobox')[0].style.display = '';\n"
			+"} catch (err) {\n"
	  		+"console.error('ERROR: ' +err);\n"
			+"}\n"
			+"document.getElementById('mw-panel').style.display = '';\n"
			+"document.getElementById('content').style.marginLeft = '12em';\n"
			+"document.getElementById('content').style.fontSize = '';\n"
			+"document.getElementById('content').style.fontFamily = '';\n"
			+"}\n"
			+"function checkChange() {\n"
			+"	if (document.getElementById('ewcheckbox').checked) setModification();\n"
			+"	else resetModification();\n"
			+"}\n"
			+"var y1 = -50;var y2 = 2;\n"
			+"var currentPos = document.body.scrollTop;\n"
			+"function monitor(){\n"
			+"	var dy = (currentPos - document.body.scrollTop) / 10;\n"
			+"	if (document.getElementById('easywiki').style.top == '')\n"
			+"		document.getElementById('easywiki').style.top = '2px';\n"
			+"	var y = parseInt(document.getElementById('easywiki').style.top) + dy;\n"
			+"	if (y > y2) y = y2;\n"
			+"	if (y < y1) y = y1;\n"
			+"	currentPos = document.body.scrollTop;\n"
			+"	document.getElementById('easywiki').style.top = y + 'px';\n"
			+"}\n"
			+"document.body.onscroll = monitor;\n";

var script = document.createElement('script');
script.textContent = code;
(document.head||document.documentElement).appendChild(script);

//trigger the modifying function
modify();