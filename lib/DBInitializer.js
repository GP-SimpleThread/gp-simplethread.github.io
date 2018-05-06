let headerSignOutBtn = null;
let sidebarSignOutBtn = null;
let profile = null;
let signInPanel = null;

window.addEventListener("DOMContentLoaded", () => {
	headerSignOutBtn = document.getElementById("header-signOut");
	sidebarSignOutBtn = document.getElementById("sidebar-signOut");
	profile = document.getElementById("sidebar-profile");
	signInPanel = document.getElementById("signInPanel");



	[headerSignOutBtn, sidebarSignOutBtn].forEach(btn => {
		btn.addEventListener("click", () => {
			app.signOut();
			cookieStore.delete("GP-ST-currentUser");

			location.href = Linker.rootDir;
		});
	});
});



let app = null;
let authUi = null;

window.addEventListener("DOMContentLoaded", () => {
	function onAuthorized (user) {
		headerSignOutBtn.classList.remove("disabled");
		sidebarSignOutBtn.classList.remove("disabled");
		profile.classList.remove("disabled");
		signInPanel.classList.add("disabled");

		if (!user) user = JSON.parse(cookieStore.get("GP-ST-currentUser"));
		
		document.querySelectorAll(".profilePhoto").forEach(photo => photo.src = user.photoURL);
		profile.querySelector(".name").textContent = user.displayName;
		profile.querySelector(".email").textContent = user.email;
	}

	fetch(`${Linker.rootDir}/dbconfig.json`).then(res => res.json()).then(dbConfig => {
		app = new SimpleFirebase(dbConfig);
		authUi = new SimpleFirebaseUI(app.Auth, "#signInPanel");
		
		if (!cookieStore.has("GP-ST-currentUser")) {
			authUi.signInType = SimpleFirebaseUI.SIGNINTYPE.GOOGLE_YOLO;
	
			authUi.signInWithGoogle({
				authMethod: "https://accounts.google.com",
				clientId: app.config.clientId
			}).on("signInSuccessWithAuthResult", res => {
				cookieStore.set("GP-ST-currentUser", JSON.stringify(res.user), { path: "/" });
				
				onAuthorized(res.user);
			}).start();
		} else {
			onAuthorized(app.Auth.currentUser);
		}
	});
});