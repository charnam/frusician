import { HTML } from "imperative-html";
import Identifier from "../../lib/Identifier.js";
import Draggable from "../../ui/Draggable.js";

class BaseNode {
	static name = "Node";
	static typeID = "node";
	static exclusiveTo = null;
	
	id = null;
	graph = null;
	
	// Inputs and outputs are NOT SAVED between sessions
	inputs = [];
	outputs = [];
	
	inputValues = {};
	inputConnections = {};
	
	boundTo = [];
	static width = 300; // width should not be modifiable
	x = 0;
	y = 0;
	
	constructor(graph) {
		this.id = Identifier.create();
		this.graph = graph;
	}
	
	initialize() {
		for(let input of this.inputs) {
			input.node = this;
		}
		for(let output of this.outputs) {
			output.node = this;
		}
	}
	
	render(parentNode) {
		const node = new HTML.div({class: "graph-node", nodeid: this.id});
		this.boundTo.push(node);
		
		const nodeName = new HTML.div({class: "graph-node-name"});
		const nodeDrag = new Draggable(position => {
			this.x += position.movementX * this.graph.viewZoom;
			this.y += position.movementY * this.graph.viewZoom;
			this.updateRendered();
		});
		nodeName.onmousedown = nodeDrag.createDragEventHandler();
		node.appendChild(nodeName);
		
		nodeName.innerText = this.constructor.name;
		
		if(this.inputs.length > 0) {
			let inputsBox,
				inputsBoxHeader;
			inputsBox = new HTML.div({class: "graph-node-inputs"},
				inputsBoxHeader = new HTML.div({class: "graph-node-inputs-header"}, "INPUTS")
			);
			
			for(let input of this.inputs) {
				input.render(inputsBox);
			}
			
			node.appendChild(inputsBox);
		}
		
		if(this.outputs.length > 0) {
			let outputsBox,
				outputsBoxHeader;
			outputsBox = new HTML.div({class: "graph-node-outputs"},
				outputsBoxHeader = new HTML.div({class: "graph-node-outputs-header"}, "OUTPUTS")
			);
			
			for(let output of this.outputs) {
				output.render(outputsBox);
			}
			
			node.appendChild(outputsBox);
		}
		
		parentNode.appendChild(node);
		this.updateRendered();
		return node;
	}
	
	updateRendered() {
		for(let node of this.boundTo) {
			node.setAttribute("style", `
				--x: ${this.x};
				--y: ${this.y};
				--width: ${this.constructor.width};
			`);
		}
	}
	
	remove() {
		// Remove connections
		for(let output of this.outputs) {
			const connection = this.getOutputConnection(output.name);
			if(connection) {
				delete this.graph.nodes[connection.nodeId].inputConnections[connection.inputName];
			}
		}
		
		// Remove node
		delete this.graph.nodes[this.id];
		this.graph.updateRendered();
	}
	
	serialize() {
		return {
			typeID: this.constructor.typeID,
			x: this.x,
			y: this.y,
			inputConnections: this.inputConnections,
		}
	}
	
	getInput(name) {
		return this.inputs.find(input => input.name == name);
	}
	
	getInputConnection(name) {
		if(this.inputConnections[name]) {
			return this.graph.nodes[this.inputConnections[name].nodeId].getOutput(this.inputConnections[name].outputName);
		} else {
			return null;
		}
	}
	
	getInputValue(name) {
		const input = this.getInput(name);
		if(input) {
			return input.getValue()
		} else {
			return this.inputValues[name];
		}
	}
	
	getOutput(name) {
		return this.outputs.find(output => output.name == name);
	}
	
	getOutputConnection(outputName) {
		for(let node of this.graph.nodes) {
			for(let [inputName, connection] of Object.entries(node.inputConnections)) {
				if(connection.nodeId == this.id && connection.outputName == outputName) {
					return {
						nodeId: node.id,
						inputName
					};
				}
			}
		}
		return null;
	}
	
	getOutputValue(name) {
		return this.getOutput(name).getValue();
	}
}

export default BaseNode;