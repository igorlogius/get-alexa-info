(async function init() {
	try {
		const tmp = await browser.runtime.sendMessage("ping");
		if(/^https?:/.test(tmp)){
			const url = new URL(tmp);
			const domain = url.hostname;
			if(typeof domain === 'string' && domain !== null && domain !== '') { 
				document.getElementById('myframe').src = "https://www.alexa.com/minisiteinfo/" + domain;
				return;
			}
		}
	}catch(e) {
		console.error(e.toString());
		//myframe.remove();
	}
	document.body.innerHTML = '<p> tab url has no valid domain or protocol<p>';
}());
