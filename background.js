
const infourl = "https://www.alexa.com/minisiteinfo/";

function onClicked(tab,onClickData) {
	const url = new URL(tab.url);
	const host = url.host;

	browser.browserAction.setPopup({
		tabId: tab.id,
		popup: infourl + host 
	});
	browser.browserAction.openPopup();
}

browser.browserAction.onClicked.addListener(onClicked); 

