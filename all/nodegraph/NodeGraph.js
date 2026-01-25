import { HTML } from "imperative-html";

class NodeGraph {
	nodes = {};
	
	viewX = 0;
	viewY = 0;
	viewZoom = 1;
	
	constructor(nodes = []) {
	}
	
	addNode(node) {
		if(!node.id || this.nodes[node.id]) {
			node.id = Identifier.create();
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
			viewX: this.viewX,
			viewY: this.viewY,
			viewZoom: this.viewZoom,
			nodes: Object.fromEntries(
				Object.entries(this.nodes).map(([id, node]) => {
					return [id, node.serialize()];
				})
			)
		}
	}
	
}

export default NodeGraph;
