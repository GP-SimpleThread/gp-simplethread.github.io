const users = document.getElementById("infoPanel-users");
const threads = document.getElementById("infoPanel-threads");

window.addEventListener("DOMContentLoaded", () => {
	DBInitializer.getApp().then(app => {
		app.Database.get("users").then(collection => users.textContent = Object.keys(collection).length - 2);
		app.Database.get("threads").then(collection => threads.textContent = collection.filter(thread => thread).length - 1);
	});
});