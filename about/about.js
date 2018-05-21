const users = document.getElementById("infoPanel-users");
const threads = document.getElementById("infoPanel-threads");

window.addEventListener("DOMContentLoaded", () => {
	DBInitializer.waitAppFilled().then(app => {
		app.Firestore.get("users").then(snapshot => users.textContent = snapshot.size - 2);
		app.Firestore.get("threads").then(snapshot => Array.prototype.filter.call(snapshot.docs, item => item.data().bio !== "").length);
	});
});