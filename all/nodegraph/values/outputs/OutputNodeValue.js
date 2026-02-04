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
		
		if(this.connectable && !this.disabled) {
			let dragTarget = null;
			const draggable = new Draggable(position => {
				document.querySelectorAll(".node-connection-drag-selected")
					.forEach(el => el.classList.remove("node-connection-drag-selected"));
				let target = null;
				dragTarget = null;
				for(let node of document.querySelectorAll(".graph-node")) {
					for(let input of node.querySelectorAll(".input-node.connectable")) {
						const inputRect = input.getBoundingClientRect();
						if(
							position.x > inputRect.x && position.y > inputRect.y &&
							position.x < inputRect.x + inputRect.width && position.y < inputRect.y + inputRect.height) {
							target = input;
							dragTarget = this.node.graph.nodes[node.getAttribute("nodeid")].getInput(input.getAttribute("inputname"));
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
					console.log(dragTarget);
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
