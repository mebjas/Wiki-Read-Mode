//add a function to reset the modifications
function reset() {
	try { 
	  document.getElementsByClassName('infobox')[0].style.display = '';
	} catch (err) {
	  console.error("ERROR: " +err);
	}
	document.getElementById('mw-panel').style.display = '';
	document.getElementById('content').style.marginLeft = '12em';
	document.getElementById('content').style.fontSize = '';
	document.getElementById('content').style.fontFamily = '';
}