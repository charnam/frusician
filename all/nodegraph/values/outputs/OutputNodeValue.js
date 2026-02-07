import Draggable from "../../../ui/Draggable.js";
import NodeValue from "../NodeValue.js";

class OutputNodeValue extends NodeValue {
	type = null;
	
	constructor(info, getValue) {
		super(info);
		this.getValue = getValue;
	}
	
	render(parentNode) {
		const outputNode = super.render(parentNode);
		outputNode.classList.add("output-node");
		outputNode.setAttribute("outputName", this.name);
		
		if(this.connectable && !this.disabled) {
			let dragTarget = null;
			const draggable = new Draggable(position => {
				document.querySelectorAll(".node-connection-drag-selected")
					.forEach(el => el.classList.remove("node-connection-drag-selected"));
				let target = null;
				dragTarget = null;
				for(let node of document.querySelectorAll(".graph-node")) {
					for(let input of node.querySelectorAll(".input-node.connectable")) {
						const nodeId = node.getAttribute("nodeid");
						const inputName = input.getAttribute("inputname");
						const inputType = this.node.graph.nodes[nodeId].getInput(inputName).type;
						if(inputType !== this.type) continue;
						
						const inputRect = input.getBoundingClientRect();
						if(
							position.x > inputRect.x && position.y > inputRect.y &&
							position.x < inputRect.x + inputRect.width && position.y < inputRect.y + inputRect.height) {
							target = input;
							dragTarget = {
								nodeId,
								inputName
							};
						}
					}
				}
				
				if(target) {
					target.classList.add("node-connection-drag-selected");
				}
			}, () => {
				document.querySelectorAll(".node-connection-drag-selected")
					.forEach(el => el.classList.remove("node-connection-drag-selected"));
				if(dragTarget) {
					const targetNode = this.node.graph.nodes[dragTarget.nodeId];
					const disallowedNodes = [this.node];
					
					let connections = Object.values(this.node.inputConnections);
					while(connections.length > 0) {
						let newConnections = [];
						for(let connection of connections) {
							const connectedNode = this.node.graph.nodes[connection.nodeId];
							newConnections.push(...Object.values(connectedNode.inputConnections));
							disallowedNodes.push(connectedNode);
						}
						connections = newConnections;
					}
					
					if(disallowedNodes.includes(targetNode)) return;
					
					targetNode.inputConnections[dragTarget.inputName] = {
						nodeId: this.node.id,
						outputName: this.name
					}
					this.node.graph.updateRendered();
					this.node.updateRendered(true);
					targetNode.updateRendered(true);
				}
			});
			
			outputNode.onmousedown = event => {
				if(event.target == outputNode) {
					draggable.startDrag(event);
				}
			}
		}
		
		return outputNode;
	}
}

export default OutputNodeValue;
