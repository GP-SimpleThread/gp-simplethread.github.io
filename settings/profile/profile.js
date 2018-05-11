const userName = document.getElementById("profilePanel-userName");
const bio = document.getElementById("profilePanel-bio");
const links = document.getElementById("profilePanel-links");
const saveBtn = document.getElementById("profilePanel-save");
const discardBtn = document.getElementById("profilePanel-discard");

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

	DBInitializer.waitUserFilled().then(app => {
		saveBtn.addEventListener("click", () => {
			const linkDatas = links.M_Chips.chipsData;
			linkDatas.forEach((link, index) => linkDatas[index] = { url: link.tag });

			app.Database.set(`users/${app.Auth.currentUser.uid}`, {
				userName: userName.value,
				detail: bio.value,
				links: linkDatas
			});
		});

		discardBtn.addEventListener("click", () => {
			location.href = Linker.rootDir;
		});
	});
});

window.addEventListener("DOMContentLoaded", () => {
	if (!cookieStore.has("GP-ST-currentUser")) location.href = Linker.rootDir;

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