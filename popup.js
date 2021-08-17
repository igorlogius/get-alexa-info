(async function init() {
	const myframe = document.getElementById('myframe');
	try {
		let tmp = await browser.tabs.executeScript({ code: 'window.location.href' });
		tmp = tmp[0];
		const url = new URL(tmp);
		const host = url.host;
		const infourl = "https://www.alexa.com/minisiteinfo/"
		const iframe_src = infourl + host;
		myframe.src = iframe_src;
	}catch(e){
		myframe.remove();
		document.body.innerHTML = '<p> no valid host/domain part for tab found <p>';
		console.error(e);
	}
}());
