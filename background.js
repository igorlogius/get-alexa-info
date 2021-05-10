
const infourl = "https://www.alexa.com/minisiteinfo/";

function onClicked(tab,onClickData) {

	let popupurl = "error.html";
	try {
		const url = new URL(tab.url);
		const host = url.host.trim();

		if(host !== null && host !== '') {
			popupurl = infourl + host;
		}
	}catch(e) {
	}

	console.log(popupurl);

	browser.browserAction.setPopup({
		tabId: tab.id,
		popup: popupurl
	});

	browser.browserAction.openPopup();
}

browser.browserAction.onClicked.addListener(onClicked); 

