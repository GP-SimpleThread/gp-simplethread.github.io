class Locale {
	static get currentLang () { return cookieStore.get("GP-ST-lang"); }

	/**
	 * @param {String} eventname
	 * @returns {Promise}
	 */
	static on (eventname) {
		if (!eventname) throw new TypeError("An argument, 'eventname' is required.");

		return new Promise(resolve => {
			switch (eventname) {
				case "load":
					let detector = setInterval(() => {
						if (Locale.loaded) {
							clearInterval(detector);
							resolve(definedMessages);
						}
					});

					break;
			}
		});
	}

	static load (languageCode = "en") {
		return fetch(`${Linker.rootDir}/locale/${languageCode}.json`).catch(error => fetch("${Linker.rootDir}/locale/en.json")).then(response => response.json()).then(messages => messages);
	}

	static apply (messages = {}) {
		let localeElements = document.querySelectorAll('Locale[Message]');
			localeElements.forEach(elem => {
				let localeId = elem.getAttribute("Message");

				try {
					elem.textContent = messages[localeId];
				} catch (error) {
					throw new TypeError(`The provided locale-id<${localeId}> is not defined`);
				}
			});

		let localeAttrs = document.querySelectorAll('*[Locale-Message]');
			localeAttrs.forEach(attrElem => {
				let localeId = attrElem.getAttribute("Locale-Message");

				try {
					if (Array.isArray(messages[localeId])) {
						attrElem.innerHTML = messages[localeId].join("<Br />");
					} else {
						attrElem.textContent = messages[localeId];
					}
				} catch (error) {
					throw new TypeError(`The provided locale-id<${localeId}> is not defined`);
				}
			});

		document.querySelectorAll('Input[Data-Length]').forEach(text => M.CharacterCounter.init(text));
		document.querySelectorAll('Textarea[Data-Length]').forEach(textarea => M.CharacterCounter.init(textarea));
		document.querySelectorAll('Select').forEach(select => M.FormSelect.init(select));
		document.querySelectorAll('.dropdown-target').forEach(dropdownTarget => M.Dropdown.init(dropdownTarget));
		document.querySelectorAll('.modal').forEach(modal => M.Modal.init(modal));
		document.querySelectorAll('.sidenav').forEach(sidenav => M.Sidenav.init(sidenav));
	}
}

class Logger {
	static log (message, options = {}) {
		if (Array.isArray(message)) message = message.join("<Br />");
		M.toast(Object.assign({ html: message }, options));
	}

	static error (message) {
		Logger.log(message, { classes: "red darken-2", displayLength: 10000 });
	}
}



let cookieStore = new CookieStore();
let definedMessages = {};

if (!cookieStore.has("GP-ST-lang")) cookieStore.set("GP-ST-lang", "en", { path: Linker.rootDir });

window.addEventListener("DOMContentLoaded", () => {
	Locale.load(Locale.currentLang).then(messages => {
		definedMessages = messages;
		return Locale.load();
	}).then(messages => {
		for (let localeId in messages) {
			if (!definedMessages[localeId]) definedMessages[localeId] = messages[localeId];
		}

		Locale.loaded = true;
		Locale.apply(definedMessages);
	});
});