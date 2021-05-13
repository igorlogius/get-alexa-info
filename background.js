
const infourl = "https://www.alexa.com/minisiteinfo/";
const parser = new DOMParser();

// host => ImageData
let host_imageData = {}


    const shortTextForNumber = (number) => {
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

const strToInt = (str) => {
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
    const addText = (ctx, text, centerX, centerY) => {
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

function onClicked(tab,onClickData) {

	let popupurl = "error.html";
	try {
		const url = new URL(tab.url);
		const host = url.host.trim();

		if(typeof host === 'string' && host !== '') {
			popupurl = infourl + host;
		}
	}catch(e) {
	}

	browser.browserAction.setPopup({
		tabId: tab.id,
		popup: popupurl
	});

	browser.browserAction.openPopup();
}

browser.browserAction.onClicked.addListener(onClicked); 

async function onCompleted(details) {
	try {
		if(details.frameId !== 0) { return; }

		browser.pageAction.hide(details.tabId);

		const url = new URL(details.url);
		const host = url.host.trim();

		if(typeof host !== 'string' || host === '') {
			return;
		}

		if (typeof host_imageData[host] === 'undefined') {
			const popupurl = infourl + host;
			const res = await fetch(popupurl);
			const res_text = await res.text();
			const doc = parser.parseFromString(res_text,'text/html');
			const rank = doc.documentElement.querySelector('span.hash').nextSibling.textContent.trim();
			host_imageData[host] = getIconImageData(rank);
		}
		browser.pageAction.setIcon({
			imageData: host_imageData[host], 
			tabId: details.tabId
		});
		browser.pageAction.show(details.tabId);

	}catch(e) {
	}

}

var testPermissions = {
	permissions: ["webNavigation"]
};

browser.permissions.contains(testPermissions).then((result) => {
	if(result) {
		browser.webNavigation.onCompleted.addListener(onCompleted);
	}
});

function handleAdded(permissions) {
	browser.webNavigation.onCompleted.addListener(onCompleted);
}

browser.permissions.onAdded.addListener(handleAdded);

