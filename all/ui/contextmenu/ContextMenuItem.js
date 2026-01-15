import { HTML } from "imperative-html";

class ContextMenuItem {
	name = "";
	constructor(name) {
		this.name = name;
	}
	
	render(parentNode) {
		const item = HTML.div({class: "contextmenu-item"});
		parentNode.appendChild(item);
		
		const itemNameText = HTML.div({class: "contextmenu-item-nametext"});
		itemNameText.innerText = this.name;
		item.appendChild(itemNameText);
		return item;
	}
}

export default ContextMenuItem;
