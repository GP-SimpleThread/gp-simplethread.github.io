const cookieStore = new CookieStore();
cookieStore.set("GP-ST-rootUrl", location.href.replace(location.search, "").replace(/\/#?$/, ""));

const ROOTURL = cookieStore.get("GP-ST-rootUrl");

window.addEventListener("DOMContentLoaded", () => {
	RootLinker.apply(ROOTURL);
});