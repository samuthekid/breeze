
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
	chrome.tabs.create({url: "page.html", active: true});
	chrome.tabs.remove(tabs[0].id);
});
