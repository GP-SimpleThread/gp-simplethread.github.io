const headerProfilePhoto = document.getElementById("header-profilePhoto");
const headerSignOutBtn = document.getElementById("header-signOut");
const sidebarSignOutBtn = document.getElementById("sidebar-signOut");
const profilePanel = document.getElementById("sidebar-profilePanel");
const signInPanel = document.getElementById("signInPanel");

window.addEventListener("DOMContentLoaded", () => {
	[headerSignOutBtn, sidebarSignOutBtn].forEach(btn => {
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



let app = null;
let authUi = null;

fetch(`${Linker.rootDir}/dbconfig.json`).then(res => res.json()).then(dbConfig => {
	function onAuthorized () {
		headerProfilePhoto.classList.remove("disabled");
		headerSignOutBtn.classList.remove("disabled");
		sidebarSignOutBtn.classList.remove("disabled");
		profilePanel.classList.remove("disabled");
		signInPanel.classList.add("disabled");

		new Promise(resolve => {
			let detector = setInterval(() => {
				if (app.Auth.currentUser) {
					resolve(app.Auth.currentUser);
					clearInterval(detector);
				}
			});
		}).then(user => {
			document.querySelectorAll(".profilePhoto").forEach(photo => photo.src = user.photoURL);
			profilePanel.querySelector(".name").textContent = user.displayName;
			profilePanel.querySelector(".email").textContent = user.email;
			
			app.Database.get(`users/${user.uid}`).then(info => profilePanel.querySelector(".name").textContent = info.userName);

			headerProfilePhoto.classList.remove("disabled");
		});
	}



	app = new SimpleFirebase(dbConfig);
	authUi = new SimpleFirebaseUI(app.Auth, "#signInPanel");
	
	if (!cookieStore.has("GP-ST-currentUser")) {
		headerProfilePhoto.classList.add("disabled");

		authUi.signInType = SimpleFirebaseUI.SIGNINTYPE.GOOGLE_YOLO;

		authUi.signInWithGoogle({
			authMethod: "https://accounts.google.com",
			clientId: app.config.clientId
		}).on("signInSuccessWithAuthResult", res => {
			cookieStore.set("GP-ST-currentUser", JSON.stringify(res.user), { path: "/" });
			onAuthorized();
		}).start();

		authUi.fbUiHandler.disableAutoSignIn();
	} else {
		onAuthorized();
	}
});