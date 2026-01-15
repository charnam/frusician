import { HTML } from "imperative-html";
import ContextMenuItem from "./ContextMenuItem.js";

class ContextMenuSubmenu extends ContextMenuItem {
	constructor(name, items) {
		super(name);
		this.items = items;
	}
	
	render(parentNode) {
		const item = super.render(parentNode);
		const submenu = HTML.div({class: "contextmenu-submenu"});
		
		item.classList.add("contextmenu-item-submenu");
		item.appendChild(submenu);
		item.addEventListener("mousedown", event => item.classList.add("open"));
		
		for(let item of this.items) {
			item.render(submenu);
		}
	}
}

export default ContextMenuSubmenu;