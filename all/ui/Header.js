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
		wordmark.innerText = "Frusician";
		
		const volumeSliderContainer = new HTML.label({class: "slider-wrapper volume-slider-wrapper"});
		const volumeSliderText = new HTML.div({class: "slider-text"});
		const volumeSlider = new HTML.input({type: "range", class: "volume slider"});
		volumeSliderContainer.appendChild(volumeSliderText);
		volumeSliderContainer.appendChild(volumeSlider);
		
		parentNode.appendChild(contextMenuButton);
		parentNode.appendChild(wordmark);
		parentNode.appendChild(volumeSliderContainer);
	}
}

export default Header;