import { HTML } from "imperative-html";

class NodeGraph {
	nodes = {};
	
	constructor() {}
	
	edit() {
		const nodeGraph = new HTML.div({class: "node-graph-container"});
		
		for(let [node_id, node] of Object.entries(this.nodes)) {
			node.render(nodeGraph);
		}
		
		document.body.appendChild(nodeGraph);
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
