import NodeValue from "../../NodeValue.js";

class OutputNodeValue extends NodeValue {
	type = null;
	
	constructor(info) {
		super(info);
	}
	
	render(parentNode) {
		const inputNode = super(parentNode);
		inputNode.classList.add("output-node");
		return inputNode;
	}
}

export default OutputNodeValue;
