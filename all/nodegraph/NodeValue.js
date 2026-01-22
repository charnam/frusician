import { HTML } from "imperative-html";

class NodeValue {
	id = "";
	
	connectable = true;
	disabled = false;
	
	constructor(info) {
		if(!info.id) {
			this.connectable = false;
			this.disabled = true;
		} else {
			this.id = info.id;
		}
	}
	
	render(parentNode) {
		if(!this.node) {
			throw new Error("NodeValue is not assigned to a Node and attempts to render itself, which causes assignment issues");
		}
		
		const connection = new HTML.div({class: "node-value"});
		parentNode.appendChild(connection);
		
		if(this.labelText) {
			const labelText = new HTML.div({class: "node-value-label"});
			labelText.innerText = this.labelText;
		}
		
		return connection;
	}
	
	getValue() {
		throw new Error("getValue on NodeValue was not overridden!");
	}
	
	setValue(value) {
		throw new Error("setValue on NodeValue was not overridden!");
	}
}

export default NodeValue;