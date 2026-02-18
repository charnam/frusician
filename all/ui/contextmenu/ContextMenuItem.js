import { HTML } from "imperative-html";

class ContextMenuItem {
	name = "";
	constructor(name) {
		this.name = name;
	}
	
	render(parentNode) {
		const item = HTML.div({class: "contextmenu-item", tabindex: '0'});
		parentNode.appendChild(item);
		
		item.addEventListener("keydown", (event) => {
			if(event.target != item) return;
			
			if(event.key == "ArrowUp") {
				if(item.previousElementSibling) {
					item.previousElementSibling.focus();
				} else {
					parentNode.lastElementChild.focus();
				}
			} else if(event.key == "ArrowDown") {
				if(item.nextElementSibling) {
					item.nextElementSibling.focus();
				} else {
					parentNode.firstElementChild.focus();
				}
			}
		})
		
		const itemNameText = HTML.div({class: "contextmenu-item-nametext"});
		itemNameText.innerText = this.name;
		item.appendChild(itemNameText);
		return item;
	}
}

export default ContextMenuItem;
