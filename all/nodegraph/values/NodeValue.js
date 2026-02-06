import { HTML } from "imperative-html";

class NodeValue {
	name = "";
	
	_connectable = true;
	_disabled = false;
	
	get connectable() {
		if(!this.name) return false;
		return this._connectable;
	}
	get disabled() {
		if(!this.name) return true;
		return this._disabled;
	}
	
	set connectable(value) {
		this._connectable = value;
	}
	set disabled(value) {
		this._disabled = value;
	}
	
	constructor(info) {
		this.name = info.name;
		
		if(info.label) {
			this.label = info.label;
		}
		if(info.node) {
			this.node = info.node;
		}
	}
	
	render(parentNode) {
		if(!this.node) {
			throw new Error("NodeValue is not assigned to a Node and attempts to render, which causes issues. You may need to specify 'node: this' in your 'new "+this.constructor.name+"()' constructor.");
		}
		
		const connection = new HTML.div({class: "node-value", style: `--color: ${this.color}`});
		parentNode.appendChild(connection);
		
		if(this.label) {
			const labelText = new HTML.div({class: "node-value-label"});
			labelText.innerText = this.label;
			connection.appendChild(labelText);
		}
		
		if(this.connectable) {
			connection.classList.add("connectable");
		}
		
		return connection;
	}
}

export default NodeValue;