
async function init() {

	try {
		// get current activ tab
		const tabs = await browser.tabs.query({active: true, currentWindow: true});

		if (            !Array.isArray(tabs) ) { throw 'tabs query return no array'; }
		if (                 tabs.length < 1 ) { throw 'tabs length is less than 1'  }
		if ( typeof tabs[0].url !== 'string' ) { throw 'tab.url is not a string';    }

		const url = new URL(tabs[0].url);

		const host = url.host;

		document.getElementById('main').src = "https://www.alexa.com/minisiteinfo/" + host;

	}catch(e){
		console.error(e);
	}
}


init();

