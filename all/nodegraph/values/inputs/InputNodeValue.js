import NodeValue from "../../NodeValue.js";

class InputNodeValue extends NodeValue {
	type = null;
	
	constructor(info) {
		super(info);
	}
	
	render(parentNode) {
		const inputNode = super(parentNode);
		inputNode.classList.add("input-node");
		return inputNode;
	}
}

export default InputNodeValue;
