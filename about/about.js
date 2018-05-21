const users = document.getElementById("infoPanel-users");
const threads = document.getElementById("infoPanel-threads");

window.addEventListener("DOMContentLoaded", () => {
	DBInitializer.waitAppFilled().then(app => {
		app.Firestore.get("users").then(snapshot => users.textContent = SimpleFirebase.SimpleFirestore.filter(snapshot, user => !user.data().forSystem).length);
		app.Firestore.get("threads").then(snapshot => SimpleFirebase.SimpleFirestore.filter(snapshot, thread => thread.data().bio !== "").length);
	});
});