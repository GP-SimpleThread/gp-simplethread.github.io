class Anchor {
	static get currentRoot () { return; }
	
	static apply () {
		/** @type {NodeListOf<HTMLAnchorElement>} */
		let relativelyAnchors = document.querySelectorAll('A:Not(.absolutely)');
			relativelyAnchors.forEach(anchor => {
				let relativePath = anchor.href;
			});
	}
}