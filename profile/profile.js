const username = document.getElementById("profilePanel-username");
const bio = document.getElementById("profilePanel-bio");
const link = document.getElementById("profilePanel-links");
const linkAddBtn = link.querySelector(".collection-header .secondary-content");
const linkTitle = link.querySelector("#profilePanel-links-title");
const linkUrl = link.querySelector("#profilePanel-links-url");
const linkChips = link.querySelector(".collection-item.chips");
const saveBtn = document.getElementById("profilePanel-save");

window.addEventListener("DOMContentLoaded", () => {
	DBInitializer.waitUserFilled().then(app => {
		linkAddBtn.addEventListener("click", event => {
			event.preventDefault();

			if (!linkUrl.checkValidity()) throw new URIError("Provided URL is invalid.");

			linkChips.M_Chips.addChip({
				tag: linkTitle.value,
				image: `${new URL(linkUrl.value).origin}/favicon.ico`
			});

			app.Database.transaction(`users/${app.Auth.currentUser.uid}/links`, val => {
				if (!val) val = [];
				
				val.push({ title: linkTitle.value, url: linkUrl.value });
				return val;
			});
	
			linkTitle.value = linkUrl.value = "";
		});

		saveBtn.addEventListener("click", () => {
			app.Database.update(`users/${app.Auth.currentUser.uid}`, {
				name: username.value,
				bio: bio.value
			});
		});
	});
});

window.addEventListener("DOMContentLoaded", () => {
	if (!cookieStore.has("GP-ST-currentUser")) location.href = Linker.rootDir;

	DBInitializer.waitUserFilled().then(app => {
		app.Database.get(`users/${app.Auth.currentUser.uid}`).then(info => {
			username.value = info.name;
			bio.value = info.bio;

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
			M.textareaAutoResize(bio);
		});
	});
});