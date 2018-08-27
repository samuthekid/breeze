
var defs = {
	"settings_applied": 1,
	"shortcuts": [
		{
			"word": "youtube",
			"value": "https://youtube.com/",
			"visits": 1},
		{
			"word": "reddit",
			"value": "https://reddit.com/",
			"visits": 1},
		{
			"word": "gmail",
			"value": "https://gmail.com/",
			"visits": 1},
	],
	"tags": [
		{
			"tag": "youtube",
			"value": "https://www.youtube.com/results?search_query={{x}}",
			"visits": 1},
		{
			"tag": "reddit",
			"value": "https://www.reddit.com/r/{{x}}",
			"visits": 1},
		{
			"tag": "gmail",
			"value": "https://mail.google.com/mail/u/0/#search/{{x}}",
			"visits": 1},
		{
			"tag": "lh",
			"value": "localhost:{{x}}",
			"visits": 1},
	],
	"urls": [],
	"show_seconds": false,
	"use_am_pm": false,
	"show_colors": false,
	"first_time": true,
}

function init(){
	// CHECK FOR SETTINGS
	setSettings();
}

function setSettings(){
	chrome.storage.sync.get(function(obj){
		if(obj.settings_applied != undefined){
			// SETTINGS FOUND
			// local <= cloud
			defs = obj;
		}else{
			// SETTINGS NOT FOUND
			// local => cloud
			saveSettings(defs);
		}
	});
}

chrome.runtime.onMessage.addListener(function(r, sender, sendResponse){
    if(r.code == "get")
		sendResponse({msg: defs});
    if(r.code == "set"){
    	defs = r.msg;
    	saveSettings(r.msg);
    }
  });

function saveSettings(obj){chrome.storage.sync.set(obj,onSet());}
function onSet() {if(chrome.runtime.lastError) alert(chrome.runtime.lastError);}

init();