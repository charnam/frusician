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
		
		const select = () => {
			for(let openSubmenu of parentNode.querySelectorAll(".contextmenu-item-submenu.open")) {
				if(openSubmenu == item) continue;
				openSubmenu.classList.remove("open");
			}
			item.classList.toggle("open");
		}
		
		item.classList.add("contextmenu-item-submenu");
		item.appendChild(submenu);
		item.addEventListener("mousedown", event => select());
		item.addEventListener("keydown", event => {
			if(event.target.parentNode == submenu && event.key == "ArrowLeft") {
				item.focus();
				item.classList.remove("open");
			}
			
			if(event.target != item) return;
			
			if(event.key == "Enter" || event.key == "ArrowRight") {
				select();
				submenu.scrollWidth;
				submenu.firstElementChild.focus();
				event.preventDefault();
			}
		});
		
		for(let item of this.items) {
			item.render(submenu);
		}
	}
}

export default ContextMenuSubmenu;