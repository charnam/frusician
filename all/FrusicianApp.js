
import { HTML } from "imperative-html";
import Header from "./ui/Header.js";
import ContextMenu from "./ui/contextmenu/ContextMenu.js";

class FrusicianApp {
	song = null;
	constructor(parentNode) {
		this.parentNode = parentNode;
		parentNode.textContent = "";
		
		const headerContainer = HTML.div({id: "header"});
		const header = new Header(new ContextMenu([
			new ContextMenu.Submenu("File", [
				new ContextMenu.ClickableItem("New"),
				new ContextMenu.ClickableItem("Save"),
				new ContextMenu.ClickableItem("Open"),
			]),
			new ContextMenu.Submenu("Edit", [
				new ContextMenu.ClickableItem("Hello World")
			]),
			new ContextMenu.Submenu("Preferences", [
				new ContextMenu.ClickableItem("YAY")
			])
		]))
		
		
		header.render(headerContainer)
		
		const songContainer = HTML.div({id: "song"});
		
		
		parentNode.appendChild(headerContainer);
		parentNode.appendChild(headerContainer);
		
		
	}
}

export default FrusicianApp;
