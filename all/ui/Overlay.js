import { HTML } from "imperative-html";

function Overlay() {
	const overlay = new HTML.div({class: "overlay"});
	document.body.appendChild(overlay);
	return overlay;
}

export default Overlay;
