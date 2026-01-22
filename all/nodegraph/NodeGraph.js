import { HTML } from "imperative-html";

class NodeGraph {
	nodes = {};
	
	viewX = 0;
	viewY = 0;
	viewZoom = 1;
	
	constructor(nodes = []) {
	}
	
	createNodeID() {
		let chosenID = 1;
		while(this.nodes[chosenID]) {
			chosenID = Math.round(Math.random() * 10000000);
		}
		return chosenID;
	}
	
	addNode(node) {
		if(!node.id || this.nodes[node.id]) {
			node.id = this.createNodeID();
		}
		this.nodes[node.id] = node;
		return node;
	}
	
	edit() {
		const nodeGraph = new HTML.div({class: "node-graph-container"});
		
		for(let [node_id, node] of Object.entries(this.nodes)) {
			node.render(nodeGraph, this);
		}
		
		document.body.appendChild(nodeGraph);
		return nodeGraph;
	}
	
	serialize() {
		return {
			nodes: Object.fromEntries(
				Object.entries(this.nodes).map(([id, node]) => {
					return [id, node.serialize()];
				})
			)
		}
	}
	
}

export default NodeGraph;
