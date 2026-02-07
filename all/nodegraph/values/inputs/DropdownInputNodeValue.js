import { HTML } from "imperative-html";
import InputNodeValue from "./InputNodeValue.js";

class DropdownInputNodeValue extends InputNodeValue {
	type = "dropdown";
	connectable = false;
	
	constructor(info) {
		super(info);
		
		this.items = info.items;
		this.default = info.default ?? info.items[0];
	}
	
	render(parentNode) {
		const container = super.render(parentNode);
		
		let dropdownInput;
		
		const values = {};
		
		const dropdownWrapper = new HTML.label({class: "dropdown-wrapper"},
			dropdownInput = new HTML.select(
				...this.items.map(item => {
					const option = new HTML.option({value: item});
					option.innerText = item;
					values[item] = option;
					return option;
				})
			),
		);
		
		let value = this.node.inputValues[this.name];
		if(value === undefined) {
			value = this.default;
		}
		
		dropdownInput.value = value;
		if(values[value]) {
			values[value].selected = true;
		}
		
		dropdownInput.oninput = () => {
			this.node.inputValues[this.name] = dropdownInput.value;
		}
		
		container.appendChild(dropdownWrapper);
		return container;
	}
}

export default DropdownInputNodeValue;