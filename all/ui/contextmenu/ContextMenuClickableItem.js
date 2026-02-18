import ContextMenu from "./ContextMenu.js";
import ContextMenuItem from "./ContextMenuItem.js";

class ContextMenuClickableItem extends ContextMenuItem {
	constructor(name, action, autohideOnClick = true) {
		super(name);
		this.action = action;
		this.autohideOnClick = autohideOnClick;
	}
	
	render(parentNode) {
		const item = super.render(parentNode);
		item.classList.add("contextmenu-item-clickable");
		
		const action = event => {
			if(this.autohideOnClick) {
				ContextMenu.hide();
			}
			this.action(event);
		}
		item.addEventListener("mouseup", action);
		item.addEventListener("keydown", event => {
			if(event.key == "Enter" || event.key == " ") {
				const rect = item.getBoundingClientRect();
				action({clientX: rect.x + rect.width / 2, clientY: rect.y + rect.height / 2});
				event.preventDefault();
			}
		})
	}
}

export default ContextMenuClickableItem;