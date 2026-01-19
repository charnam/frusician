import { HTML } from "imperative-html";
import UI from "../UI.js";

class Header {
	constructor(contextMenu) {
		this.contextMenu = contextMenu;
	}
	render(parentNode) {
		parentNode.textContent = "";
		const contextMenuButton = new HTML.div({class: "header-logo-square-wrapper"});
		contextMenuButton.addEventListener("mousedown", () => {
			this.contextMenu.open();
		});
		
		const wordmark = new HTML.div({class: "wordmark"});
		wordmark.innerText = "Frusician 0.0.1";
		
		parentNode.appendChild(contextMenuButton);
		parentNode.appendChild(wordmark);
	}
}

export default Header;