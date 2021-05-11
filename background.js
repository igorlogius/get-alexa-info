
const infourl = "https://www.alexa.com/minisiteinfo/";
const parser = new DOMParser();

browser.browserAction.setBadgeBackgroundColor({
	color: "blue"
});

function onClicked(tab,onClickData) {
	//console.log('onClicked');

	let popupurl = "error.html";
	try {
		const url = new URL(tab.url);
		const host = url.host.trim();

		if(host !== null && host !== '') {
			popupurl = infourl + host;
		}
	}catch(e) {
	}

	//console.log(popupurl);

	browser.browserAction.setPopup({
		tabId: tab.id,
		popup: popupurl
	});

	browser.browserAction.openPopup();
}

browser.browserAction.onClicked.addListener(onClicked); 

async function onBeforeNavigate(details) {
	//console.log('onBeforeNavigate');

	try {

		if(details.frameId !== 0) { return; }

		browser.browserAction.setBadgeText({tabId: details.tabId, text: ""});

		//if( details.url.startsWith(infourl) ) { return; }

		const url = new URL(details.url);
		const host = url.host.trim();

		if(typeof host !== 'string' || host === null || host === '') {
			return;
		}
		const popupurl = infourl + host;

		const res = await fetch(popupurl);
		const res_text = await res.text();
		const doc = parser.parseFromString(res_text,'text/html');
		const el = doc.documentElement.querySelector('span.hash').nextSibling.textContent.trim();

		if(el.length < 4) {
			browser.browserAction.setBadgeText({tabId: details.tabId, text: el});
			return;
		}

	}catch(e) {
	}

	browser.browserAction.setBadgeText({tabId: details.tabId, text: '>99'});

}

var testPermissions = {
	permissions: ["webNavigation"]
};

browser.permissions.contains(testPermissions).then((result) => {
	//console.log('result', result);
	if(result) {
		browser.webNavigation.onBeforeNavigate.addListener(onBeforeNavigate);
	}
});

function handleAdded(permissions) {
	//console.log('handleAdded');
    browser.webNavigation.onBeforeNavigate.addListener(onBeforeNavigate);
}

browser.permissions.onAdded.addListener(handleAdded);

