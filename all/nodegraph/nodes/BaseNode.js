import { HTML, SVG } from "imperative-html";
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
	
	optimization_lastUpdatedX = null;
	optimization_lastUpdatedY = null;
	
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
		const node = new HTML.div({class: "graph-node", nodeid: this.id},
			new HTML.div({class: "graph-node-input-connections"})
		);
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
			
			const inp = node.querySelector(".graph-node-inputs");
			if(inp) {
				inp.remove();
			}
			
			const outp = node.querySelector(".graph-node-outputs");
			if(outp) {
				outp.remove();
			}
			
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
			
			node.querySelectorAll(".input-connection").forEach(element => {
				element.remove();
			});
			
			if(this.optimization_lastUpdatedX !== this.x || this.optimization_lastUpdatedY !== this.y) {
				this.optimization_lastUpdatedX = this.x;
				this.optimization_lastUpdatedY = this.y;
				
				for(let node of Object.values(this.graph.nodes)) {
					if(Object.values(node.inputConnections).some(connection => connection.nodeId == this.id)) {
						node.updateRendered();
					}
				}
			}
			
			// Connection lines
			for(let [name, connection] of Object.entries(this.inputConnections)) {
				const padding = 32;
				const connectionSpacing = 10;
				
				const connectedNode = this.graph.nodes[connection.nodeId];
				if(this.x !== (this.x = Math.max(this.x, connectedNode.x + connectedNode.constructor.width + connectionSpacing * 6))) {
					return this.updateRendered();
				}
				
				const connectedNodeEl = [...node.parentNode.querySelectorAll(".graph-node")]
					.find(otherNode => otherNode.getAttribute("nodeid") == connection.nodeId);
				if(!connectedNodeEl) continue;
				
				const outputConnectionEl = [...connectedNodeEl.querySelectorAll(".output-node")]
					.find(outputConnection => outputConnection.getAttribute("outputname") == connection.outputName);
				if(!outputConnectionEl) continue;
				
				const inputConnectionEl = [...node.querySelectorAll(".input-node")]
					.find(inputConnection => inputConnection.getAttribute("inputname") == name);
				if(!inputConnectionEl) continue;
				
				const nodeBox = node.getBoundingClientRect();
				const outputConnectionBox = outputConnectionEl.getBoundingClientRect();
				const inputConnectionBox = inputConnectionEl.getBoundingClientRect();
				
				let connectionOffsetX = outputConnectionBox.right - inputConnectionBox.x;
				let connectionOffsetY = outputConnectionBox.y + outputConnectionBox.height / 2 - (inputConnectionBox.y + inputConnectionBox.height / 2);
				let realConnectionOffsetX = connectionOffsetX * this.graph.viewZoom;
				let realConnectionOffsetY = connectionOffsetY * this.graph.viewZoom;
				
				const zoom = this.graph.viewZoom;
				
				let SVGWidth = Math.abs(realConnectionOffsetX);
				let SVGHeight = Math.abs(realConnectionOffsetY);
				let SVGOffsetX = Math.min(realConnectionOffsetX, 0);
				let SVGOffsetY = Math.min(realConnectionOffsetY, 0) + (inputConnectionBox.y - nodeBox.y + inputConnectionBox.height / 2) * this.graph.viewZoom;
				
				let pathStartX = -Math.min(connectionOffsetX, 0);
				let pathStartY = -Math.min(connectionOffsetY, 0);
				let pathEndX = -Math.min(-connectionOffsetX, 0);
				let pathEndY = -Math.min(-connectionOffsetY, 0);
				
				node.querySelector(".graph-node-input-connections").appendChild(
					new SVG.svg({
						class: "input-connection",
						viewBox: `${-padding} ${-padding} ${SVGWidth / zoom + padding * 2} ${SVGHeight / zoom + padding * 2}`,
						style: `
							transform: translate(calc(${SVGOffsetX} * var(--unit)), calc(${SVGOffsetY} * var(--unit)))
									translate(-${padding}px, -${padding}px);
							width: calc(${SVGWidth + padding * 2 * zoom} * var(--unit));
							height: calc(${SVGHeight + padding * 2 * zoom} * var(--unit));
						`},
						new SVG.path({
							stroke: `hsla(${this.getInput(name).color}, 100%, 40%, 0.3)`,
							style: "stroke-width: calc(4 * var(--unit))",
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							fill: "transparent",
							d: `
								M ${pathStartX} ${pathStartY}
								L ${pathStartX - connectionSpacing / zoom} ${pathStartY}
								C ${Math.abs(pathStartX - pathEndX) / 2} ${pathStartY},
								${Math.abs(pathStartX - pathEndX) / 2} ${pathEndY},
								${pathEndX + connectionSpacing / zoom} ${pathEndY}
								L ${pathEndX} ${pathEndY}
								`
						})
					)
				);
			}
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
		const output = this.getInputConnection(name);
		if(output) {
			return output.getValue();
		} else {
			if(typeof this.inputValues[name] !== "undefined") {
				return this.inputValues[name];
			} else {
				return this.getInput(name).default;
			}
		}
	}
	
	getOutput(name) {
		return this.outputs.find(output => output.name == name);
	}
	
	/*
	Multiple output connections can coexist -- this method shouldn't be used
	
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
	*/
	
	getOutputValue(name) {
		return this.getOutput(name).getValue();
	}
}

export default BaseNode;