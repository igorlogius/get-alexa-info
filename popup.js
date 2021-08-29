(async function init() {
	try {
		let tmp = await browser.runtime.sendMessage("ping");
		const url = new URL(tmp);
		const domain = url.hostname;
		if(typeof domain === 'string' && domain !== null && domain !== '') { 
			document.getElementById('myframe').src = "https://www.alexa.com/minisiteinfo/" + domain;
		}
	}catch(e) {
		console.error(e.toString());
		//myframe.remove();
	}
	document.body.innerHTML = '<p> tab url has no valid domain name <p>';
}());
