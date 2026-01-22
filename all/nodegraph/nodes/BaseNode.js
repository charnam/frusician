import { HTML } from "imperative-html";

class BaseNode {
	static name = "Node";
	static typeID = "node";
	
	static NODE_INPUTS = [
	];
	
	static NODE_OUTPUTS = [
	];
	
	inputs = null;
	outputs = null;
	
	id = null;
	
	x = 0;
	y = 0;
	
	inputConnections = {};
	
	constructor(info) {
		if(info.id) {
			this.id = info.id;
		} else {
			console.warn("Node created without an ID");
		}
		
		this.inputs = [];
		for(let input of this.constructor.NODE_INPUTS) {
			input.node = this;
			this.inputs.push(input);
		}
		
		this.outputs = [];
		for(let output of this.constructor.NODE_OUTPUTS) {
			output.node = this;
			this.outputs.push(output);
		}
	}
	
	render(parentNode, nodeGraph) {
		const node = new HTML.div({class: "graph-node"});
		
		const nodeName = new HTML.div({class: "graph-node-name"});
		node.appendChild(nodeName);
		
		nodeName.innerText = this.constructor.name;
		
		parentNode.appendChild(node);
		return node;
	}
	
	serialize() {
		return {
			typeID: this.constructor.typeID,
			inputs: this.constructor.inputs,
			outputs: this.constructor.outputs,
			x: this.x,
			y: this.y,
			inputConnections: this.inputConnections,
		}
	}
	
	execute(inputs) {
		return {};
	}
}

export default BaseNode;