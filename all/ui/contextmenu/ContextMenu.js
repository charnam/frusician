import { HTML } from "imperative-html";
import ContextMenuClickableItem from "./ContextMenuClickableItem.js";
import ContextMenuSubmenu from "./ContextMenuSubmenu.js";

const cursorPosition = {x: 0, y: 0};

function updateCursor(event) {
	cursorPosition.x = event.clientX;
	cursorPosition.y = event.clientY;
}

window.addEventListener("mousedown", updateCursor);
window.addEventListener("mouseup", updateCursor);
window.addEventListener("mousemove", updateCursor);
window.addEventListener("contextmenu", updateCursor);

class ContextMenu {
	static ClickableItem = ContextMenuClickableItem;
	static Submenu = ContextMenuSubmenu;
	
	static hide() {
		const menus = document.querySelectorAll(".overlay:has(.contextmenu)");
		
		for(let menu of menus) {
			menu.style.pointerEvents = "none";
			menu.style.opacity = 0;
			setTimeout(() => {
				menu.remove();
			}, 1000);
		}
	}
	
	items = [];
	constructor(items = []) {
		this.items = items;
	}
	
	render(parentNode) {
		const overlay = new HTML.div({class: "overlay"});
		
		overlay.addEventListener("click", (event) => {
			if(event.target == overlay) {
				ContextMenu.hide();
			}
		})
		
		const menu = new HTML.div({class: "contextmenu"});
		menu.style.left = this.x+"px";
		menu.style.top = this.y+"px";
		
		for(let item of this.items) {
			item.render(menu);
		}
		overlay.appendChild(menu);
		parentNode.appendChild(overlay);
		return menu;
	}
	
	openAt(x, y) {
		this.x = x;
		this.y = y;
		this.render(document.body);
	}
	
	open() {
		this.openAt(cursorPosition.x, cursorPosition.y);
	}
};

export default ContextMenu;