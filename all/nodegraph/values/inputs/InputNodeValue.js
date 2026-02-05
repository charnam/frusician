import Draggable from "../../../ui/Draggable.js";
import NodeValue from "../NodeValue.js";

class InputNodeValue extends NodeValue {
	type = null;
	
	constructor(info) {
		super(info);
	}
	
	render(parentNode) {
		const inputNode = super.render(parentNode);
		inputNode.setAttribute("inputName", this.name);
		inputNode.classList.add("input-node");
		return inputNode;
	}
}

export default InputNodeValue;
