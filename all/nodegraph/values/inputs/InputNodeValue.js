import ContextMenu from "../../../ui/contextmenu/ContextMenu.js";
import Draggable from "../../../ui/Draggable.js";
import NodeValue from "../NodeValue.js";

class InputNodeValue extends NodeValue {
	type = null;
	default = null;
	
	constructor(info) {
		super(info);
	}
	
	render(parentNode) {
		const inputNode = super.render(parentNode);
		inputNode.setAttribute("inputName", this.name);
		inputNode.classList.add("input-node");
		
		inputNode.addEventListener("contextmenu", (event) => {
			if(this.node.inputConnections[this.name] && this.connectable && !this.disabled) {
				new ContextMenu([
					new ContextMenu.ClickableItem("Disconnect", () => {
						delete this.node.inputConnections[this.name];
						this.node.updateRendered(true);
					})
				]).open();
			}
			event.preventDefault();
		})
		
		return inputNode;
	}
}

export default InputNodeValue;
