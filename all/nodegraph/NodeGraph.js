import { HTML } from "imperative-html";
import Draggable from "../ui/Draggable.js";
import ContextMenu from "../ui/contextmenu/ContextMenu.js";
import nodeCatalog from "./nodes/nodeCatalog.js";

class NodeGraph {
	nodes = {};
	
	viewX = 100;
	viewY = 100;
	viewZoom = 1;
	
	boundTo = [];
	
	addMenu = null;
	
	constructor(track, nodes = []) {
		this.track = track;
		
		let iter = 0;
		for(let node of nodes) {
			this.addNode(node);
			node.x += 600 * iter++;
		}
		
		this.addMenu = new ContextMenu(nodeCatalog.all.map(item => {
			if(item.exclusiveTo && !item.exclusiveTo.includes(track.constructor.typeID)) {
				return null;
			}
			
			return new ContextMenu.ClickableItem(item.name, event => {
				const node = new item();
				
				node.x = (event.clientX) * this.viewZoom - this.viewX - item.width / 2;
				node.y = (event.clientY) * this.viewZoom - this.viewY - 30;
				
				this.addNode(node);
			});
		}).filter(item => item !== null));
	}
	
	addNode(node) {
		if(!node.id || this.nodes[node.id]) {
			node.id = Identifier.create();
		}
		this.nodes[node.id] = node;
		node.graph = this;
		node.initialize();
		this.updateRendered();
		return node;
	}
	
	openGraphEditor() {
		const editorWrapper = new HTML.div({class: "node-graph"});
		
		const closeButton = new HTML.div({class: "node-graph-close-button"});
		closeButton.onclick = () => {
			editorWrapper.remove();
		}
		editorWrapper.appendChild(closeButton);
		
		document.body.appendChild(editorWrapper);
		return this.renderNodes(editorWrapper);
	}
	
	renderNodes(parentNode) {
		const nodeGraph = new HTML.div({class: "node-graph-nodes"});
		this.boundTo.push(nodeGraph);
		
		const draggable = new Draggable(position => {
			this.viewX += position.movementX * this.viewZoom;
			this.viewY += position.movementY * this.viewZoom;
			
			this.updateRendered();
		});
		
		nodeGraph.onmousedown = event => {
			if(event.target == nodeGraph && event.button == 1) {
				draggable.startDrag(event);
			}
		};
		
		nodeGraph.ondblclick = ContextMenu.eventOpener(this.addMenu);
		
		nodeGraph.addEventListener("wheel", event => {
			event.preventDefault();
			this.viewX -= event.clientX * this.viewZoom;
			this.viewY -= event.clientY * this.viewZoom;
			this.viewZoom = Math.max(
				0.5,
				Math.min(
					this.viewZoom / (1 + Math.min(40, Math.max(-event.deltaY, -40)) / 200),
					2,
				),
			);
			this.viewX += event.clientX * this.viewZoom;
			this.viewY += event.clientY * this.viewZoom;
			this.updateRendered();
		}, {passive: false})
		
		parentNode.appendChild(nodeGraph);
		this.updateRendered();
		return nodeGraph;
	}
	
	updateRendered() {
		for(let graph of this.boundTo) {
			for(let node of graph.querySelectorAll(".graph-node")) {
				if(!this.nodes[node.getAttribute("nodeid")]) {
					node.remove();
				}
			}
			
			for(let node of Object.values(this.nodes)) {
				if(![...graph.querySelectorAll(".graph-node")].some(nodeEl => nodeEl.getAttribute("nodeid") == node.id)) {
					node.render(graph);
				}
			}
			
			graph.setAttribute("style", `
				--view-x: ${this.viewX};
				--view-y: ${this.viewY};
				--unit: ${1 / this.viewZoom}px;
			`);
		}
		
		for(let node of Object.values(this.nodes)) {
			node.updateRendered();
		}
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
