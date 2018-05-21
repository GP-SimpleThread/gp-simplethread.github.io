const nameInputter = document.getElementById("profilePanel-name");
const bioInputter = document.getElementById("profilePanel-bio");
const linkManager = document.getElementById("profilePanel-links");
const linkAddBtn = linkManager.querySelector(".collection-header .secondary-content");
const linkTitleInputter = linkManager.querySelector("#profilePanel-links-title");
const linkUrlInputter = linkManager.querySelector("#profilePanel-links-url");
const linkChips = linkManager.querySelector(".collection-item.chips");
const saveBtn = document.getElementById("profilePanel-save");

DBInitializer.waitUserFilled().then(app => {
	linkAddBtn.addEventListener("click", event => {
		event.preventDefault();

		if (!linkUrlInputter.checkValidity()) throw new URIError("Provided URL is invalid.");

		linkChips.M_Chips.addChip({
			tag: linkTitleInputter.value,
			image: `${new URL(linkUrlInputter.value).origin}/favicon.ico`
		});

		/*app.Database.transaction(`users/${app.Auth.currentUser.uid}/links`, val => {
			if (!val) val = [];
			
			val.push({ title: linkTitleInputter.value, url: linkUrlInputter.value });
			return val;
		});*/

		linkTitleInputter.value = linkUrlInputter.value = "";
	});

	saveBtn.addEventListener("click", () => {
		app.Firestore.update(`users/${app.Auth.currentUser.uid}`, {
			name: nameInputter.value,
			bio: bioInputter.value
		});
	});
});

window.addEventListener("DOMContentLoaded", () => {
	if (!cookieStore.has("GP-ST-currentUser")) location.href = Linker.rootDir;

	DBInitializer.waitUserFilled().then(app => {
		app.Firestore.getValue(`users/${app.Auth.currentUser.uid}`).then(info => {
			nameInputter.value = info.name;
			bioInputter.value = info.bio;

			let chips = [];
			if (info.links) info.links.forEach(link => chips.push({ tag: link.title, image: `${new URL(link.url).origin}/favicon.ico` }));

			M.Chips.init(linkChips, {
				data: chips,

				onChipDelete (parent, chip) {
					console.log(parent);
					console.log(chip);
				}
			});

			M.updateTextFields();
			M.textareaAutoResize(bioInputter);
		});
	});
});