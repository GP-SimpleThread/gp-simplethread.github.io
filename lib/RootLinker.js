class RootLinker {
	static get rootUrl () { return cookieStore.get("GP-ST-rootUrl"); }

	static apply (rootUrl = "") {
		/** @type {NodeListOf<HTMLAnchorElement>} */
		let rootAnchors = document.querySelectorAll('A[RootHref]');
			rootAnchors.forEach(anchor => anchor.href = rootUrl + anchor.getAttribute("RootHref"));

		/** @type {NodeListOf<HTMLLinkElement>} */
		let rootStyles = document.querySelectorAll('Link[Rel="StyleSheet"][RootHref]');
			rootStyles.forEach(style => style.href = rootUrl + style.getAttribute("RootHref"));

		/** @type {NodeListOf<HTMLScriptElement>} */
		let rootScripts = document.querySelectorAll('Script[RootSrc]');
			rootScripts.forEach(script => script.src = rootUrl + script.getAttribute("RootSrc"));
	}
}



window.addEventListener("DOMContentLoaded", () => {
	RootLinker.apply(RootLinker.rootUrl);
});