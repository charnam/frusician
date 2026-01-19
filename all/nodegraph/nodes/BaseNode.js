import { HTML } from "imperative-html";

class BaseNode {
	static inputs = [
	];
	
	static outputs = [
	];
	
	x = 0;
	y = 0;
	
	inputConnections = {};
	outputConnections = {};
	
	render(parentNode) {
		const node = new HTML.div({class: "graph-node"});
		
		parentNode.appendChild(node);
		return node;
	}
}

export default BaseNode;