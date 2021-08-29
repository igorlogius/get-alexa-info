(async function init() {
	try {
		let tmp = await browser.runtime.sendMessage("ping");
		const url = new URL(tmp);
		if(typeof url.hostname !== 'string' || url.hostname === '') { throw "tab url has no valid domain name"; }
		document.getElementById('myframe').src = "https://www.alexa.com/minisiteinfo/" + encodeURIComponent(url.hostname);
	}catch(e) {
		console.error(e.toString());
		document.body.innerHTML = `<p> ${e.toString()} <p>`;
		//myframe.remove();
	}
}());
