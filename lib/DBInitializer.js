let app = null;
let authUi = null;

fetch(`${Linker.rootDir}/dbconfig.json`).then(res => res.json()).then(dbConfig => {
	app = new SimpleFirebase(dbConfig);

	authUi = new SimpleFirebaseUI(app.Auth, "#TEST").signInWithGoogle({
		authMethod: "https://accounts.google.com",
		clientId: app.config.clientId
	}).on("signInSuccessWithAuthResult", res => {
		console.log(res);
	});
	
	authUi.signInType = SimpleFirebaseUI.SIGNINTYPE.GOOGLE_YOLO;
	authUi.start();
});



window.addEventListener("DOMContentLoaded", () => {
	//M.Modal.init(document.querySelector("#TEST")).open();
});