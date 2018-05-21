const profilePhotoOnHeader = document.getElementById("header-profilePhoto");
const languagesBtnOnHeader = document.getElementById("header-languages");
const languagesBtnOnSidebar = document.getElementById("sidebar-languages");
const signOutBtnOnHeader = document.getElementById("header-signOut");
const signOutBtnOnSidebar = document.getElementById("sidebar-signOut");
const profilePanel = document.getElementById("sidebar-profilePanel");
const signInPanel = document.getElementById("signInPanel");

window.addEventListener("DOMContentLoaded", () => {
	[languagesBtnOnHeader, languagesBtnOnSidebar].forEach(languagesBtn => {
		languagesBtn.querySelectorAll("Li > A").forEach(lang => {
			lang.addEventListener("click", () => {
				cookieStore.set("GP-ST-lang", lang.getAttribute("Lang"), { path: Linker.rootDir });
				location.reload();
			});
		});
	});

	[signOutBtnOnHeader, signOutBtnOnSidebar].forEach(btn => {
		btn.addEventListener("click", () => {
			app.signOut();
			cookieStore.delete("GP-ST-currentUser", { path: "/" });

			location.href = Linker.rootDir;
		});
	});
});



class DBInitializer {
	static waitAppFilled () {
		return new Promise(resolve => {
			let detector = setInterval(() => {
				if (app) {
					resolve(app);
					clearInterval(detector);
				}
			});
		});
	}

	static waitUserFilled () {
		return new Promise(resolve => {
			let detector = setInterval(() => {
				if (app && app.Auth.currentUser) {
					resolve(app);
					clearInterval(detector);
				}
			});
		});
	}
}



/** @type {SimpleFirebase} */
let app = null;
/** @type {SimpleFirebaseUI} */
let authUi = null;

fetch(`${Linker.rootDir}/dbconfig.json`).then(res => res.json()).then(dbConfig => {
	function onAuthorized () {
		profilePhotoOnHeader.classList.remove("disabled");
		signOutBtnOnHeader.classList.remove("disabled");
		signOutBtnOnSidebar.classList.remove("disabled");
		profilePanel.classList.remove("disabled");
		signInPanel.classList.add("disabled");

		DBInitializer.waitUserFilled().then(() => {
			const user = app.Auth.currentUser;

			profilePanel.querySelector(".email").textContent = user.email;
			document.querySelectorAll(".profilePhoto").forEach(photo => photo.src = user.photoURL);
			app.Firestore.getValue(`users/${user.uid}`).then(info => profilePanel.querySelector(".name").textContent = info.name);

			profilePhotoOnHeader.classList.remove("disabled");
		});
	}



	app = new SimpleFirebase(dbConfig);
	authUi = new SimpleFirebaseUI(app.Auth, "#signInPanel");
	
	if (!cookieStore.has("GP-ST-currentUser")) {
		profilePhotoOnHeader.classList.add("disabled");

		authUi.signInType = SimpleFirebaseUI.SIGNINTYPE.GOOGLE_YOLO;
		authUi.signInWithGoogle({
			authMethod: "https://accounts.google.com",
			clientId: app.config.clientId
		}).on("signInSuccessWithAuthResult", res => {
			const { user, additionalUserInfo } = res;

			cookieStore.set("GP-ST-currentUser", JSON.stringify(res.user), { path: "/" });

			app.Firestore.exist(`users/${user.uid}`).then(res => {
				if (!res || additionalUserInfo.isNewUser) {
					return app.Firestore.set(`users/${user.uid}`, {
						name: user.displayName,
						bio: "",
						photo: user.photoURL
					}).then(() => ({ isNewUser: true }));
				} else {
					return app.Firestore.update(`users/${user.uid}`, { photo: user.photoURL }).then(() => ({ isNewUser: false }));
				}
			}).then(info => {
				if (info.isNewUser) Logger.log(definedMessages["common.newUserNotify"]);
				onAuthorized();
			});
		}).start();

		authUi.fbUiHandler.disableAutoSignIn();
	} else {
		onAuthorized();
	}
});