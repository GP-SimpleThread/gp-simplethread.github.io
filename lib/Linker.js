class Linker {
	static get FILENAME () { return "lib/Linker.js"; }
	static get self () { return document.querySelector(`Script[Src$="${Linker.FILENAME}"]`); }

	static get linkerPath () {
		let mixedDirs = (location.pathname + Linker.self.getAttribute("Src").replace(/^\.\//, "")).split("/");

		let i = 0;
		while (i < mixedDirs.length) {
			if (mixedDirs[i] == "..") {
				mixedDirs.splice(i - 1, 2);
				i = 0;

				continue;
			}

			i++;
		}

		return location.origin + mixedDirs.filter((dir, index) => index == 0 || dir).join("/");
	}

	static get rootDir () { return Linker.linkerPath.split("/" + Linker.FILENAME)[0]; }

	static apply () {
		const rootDir = Linker.rootDir;

		/** @type {NodeListOf<HTMLAnchorElement>} */
		let rootAnchors = document.querySelectorAll('A[RootHref]');
			rootAnchors.forEach(anchor => anchor.href = rootDir + anchor.getAttribute("RootHref"));

		/** @type {NodeListOf<HTMLLinkElement>} */
		let rootStyles = document.querySelectorAll('Link[Rel="StyleSheet"][RootHref]');
			rootStyles.forEach(style => style.href = rootDir + style.getAttribute("RootHref"));

		/** @type {NodeListOf<HTMLScriptElement>} */
		let rootScripts = document.querySelectorAll('Script[RootSrc]');
			rootScripts.forEach(script => script.src = rootDir + script.getAttribute("RootSrc"));
	}
}



window.addEventListener("DOMContentLoaded", () => Linker.apply());