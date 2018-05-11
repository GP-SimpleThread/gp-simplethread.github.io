const userName = document.getElementById("profilePanel-userName");
const bio = document.getElementById("profilePanel-bio");
const links = document.getElementById("profilePanel-links");

window.addEventListener("DOMContentLoaded", () => {
	M.Chips.init(links, {
		onChipAdd (root, link) {
			const chipsObj = root[0].M_Chips;
			const currentChip = chipsObj.chipsData[chipsObj.chipsData.length - 1];

			if (currentChip.image) return;

			chipsObj.deleteChip(chipsObj.chipsData.length - 1);
			chipsObj.addChip({
				tag: currentChip.tag,
				image: `${new URL(currentChip.tag).origin}/favicon.ico`
			});
		}
	});
});

window.addEventListener("DOMContentLoaded", () => {
	DBInitializer.waitUserFilled().then(app => {
		app.Database.get(`users/${app.Auth.currentUser.uid}`).then(info => {
			userName.value = info.userName;
			bio.value = info.detail;

			info.links.forEach(link => {
				links.M_Chips.addChip({
					tag: link.url,
					image: `${new URL(link.url).origin}/favicon.ico`
				});
			});

			M.updateTextFields();
			M.textareaAutoResize(bio);
		});
	});
});