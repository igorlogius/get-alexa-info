
const infourl = "https://www.alexa.com/minisiteinfo/";
const parser = new DOMParser();

browser.browserAction.setBadgeBackgroundColor({
    color: "blue"
});

// domain => ImageData
let domain_imageData = {}

function shortTextForNumber (number) {
	if (number < 1000) {
		return number.toString()
	} else if (number < 100000) {
		return Math.floor(number / 1000)
			.toString() + "k"
	} else if (number < 1000000) {
		return Math.floor(number / 100000)
			.toString() + "hk"
	} else {
		return Math.floor(number / 1000000)
			.toString() + "m"
	}
}

function strToInt(str) {
	// Numbers are displayed as strings with delimeters (e.g. 123,564).
	return parseInt(str.trim()
		.replace(/,/g, ""))
}

function getIconImageData(rank) {
    const imageWidth = 32;
    const imageHeight = 32;
    const markerSize = 8;
    const font = "bold 15pt 'Arial'";
    rank = strToInt(rank); //stats.rank !== null ? parseInt(stats.rank) : null;
    const color = /* options.addressbar_text_color ? options.addressbar_text_color : */ "#444";
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const addText = function(ctx, text, centerX, centerY) {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        var maxWidth = imageWidth
        ctx.fillText(text, centerX, centerY, maxWidth);
    }
    const textOffset = 2; // trying to align text beautifully here
    const text = rank !== null ? shortTextForNumber(rank) : "n/a";
    addText(ctx, text, imageWidth / 2, imageHeight / 2 + textOffset)
    return ctx.getImageData(0, 0, imageWidth, imageHeight);
}

async function onCompleted(details) {

	try {
		if(details.frameId !== 0) { return; }

		//browser.pageAction.hide(details.tabId);

		browser.browserAction.setBadgeText({tabId: details.tabId, text: ""});

		const url = new URL(details.url);
		const domain = url.hostname;

		if(typeof domain !== 'string' || domain === null || domain === '') {
			return;
		}

		// make sidebar permission optional 
		// check if sidebar permission is given
		const panel_isopen = await browser.sidebarAction.isOpen({});
		if(panel_isopen){
			await browser.sidebarAction.setPanel({tabId: details.tabId, panel: infourl+domain });
		}

		if (typeof domain_imageData[domain] === 'undefined') {
			const popupurl = infourl + domain;
			const res = await fetch(popupurl);
			const res_text = await res.text();
			const doc = parser.parseFromString(res_text,'text/html');
			const rank = doc.documentElement.querySelector('span.hash').nextSibling.textContent.trim();
			domain_imageData[domain] = rank; //getIconImageData(rank);
		}
		/*
		browser.pageAction.setIcon({
			imageData: domain_imageData[domain], 
			tabId: details.tabId
		});
		*/

		browser.browserAction.setBadgeText({
			tabId: details.tabId,
			text: shortTextForNumber(strToInt(domain_imageData[domain]))
		});

		//browser.pageAction.show(details.tabId);

	}catch(e) {
	}

}

var testPermissions = {
	permissions: ["webNavigation"]
};

browser.permissions.contains(testPermissions).then( function(result) {
	if(result) {
		browser.webNavigation.onCompleted.addListener(onCompleted);
	}
});

function handleAdded(permissions) {
	browser.webNavigation.onCompleted.addListener(onCompleted);
}

browser.permissions.onAdded.addListener(handleAdded);

browser.runtime.onMessage.addListener( async function(msg, sender) {
	const tab =  await browser.tabs.query({currentWindow: true, active: true});
	return tab[0].url;
});
