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
		
		item.addEventListener("mouseup", event => {
			if(this.autohideOnClick) {
				ContextMenu.hide();
			}
			this.action(event);
		});
	}
}

export default ContextMenuClickableItem;