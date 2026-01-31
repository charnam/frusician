import { HTML } from "imperative-html";
import Draggable from "./Draggable.js";

function EditorModal() {
	let editorModalEl,
		editorModalContent,
		editorModalWindowDrag,
		
		editorModalDragN,
		editorModalDragE,
		editorModalDragS,
		editorModalDragW,
		editorModalDragNE,
		editorModalDragSE,
		editorModalDragNW,
		editorModalDragSW;
	
	editorModalEl = new HTML.div({class: "editor-modal"},
		new HTML.div({class: "editor-modal-draggable"},
			editorModalDragN = new HTML.div({class: "editor-modal-drag editor-modal-drag-edge editor-modal-drag-n"}),
			editorModalDragE = new HTML.div({class: "editor-modal-drag editor-modal-drag-edge editor-modal-drag-e"}),
			editorModalDragS = new HTML.div({class: "editor-modal-drag editor-modal-drag-edge editor-modal-drag-s"}),
			editorModalDragW = new HTML.div({class: "editor-modal-drag editor-modal-drag-edge editor-modal-drag-w"}),
			editorModalDragNE = new HTML.div({class: "editor-modal-drag editor-modal-drag-corner editor-modal-drag-n editor-modal-drag-e"}),
			editorModalDragSE = new HTML.div({class: "editor-modal-drag editor-modal-drag-corner editor-modal-drag-s editor-modal-drag-e"}),
			editorModalDragNW = new HTML.div({class: "editor-modal-drag editor-modal-drag-corner editor-modal-drag-n editor-modal-drag-w"}),
			editorModalDragSW = new HTML.div({class: "editor-modal-drag editor-modal-drag-corner editor-modal-drag-s editor-modal-drag-w"}),
		),
		editorModalWindowDrag = new HTML.div({class: "editor-modal-drag-window"}),
		editorModalContent = new HTML.div({class: "editor-modal-content"})
	);
	
	let startDragTop,
		startDragLeft,
		startDragBottom,
		startDragRight;
	
	let dragChangeTop = false;
	let dragChangeLeft = false;
	let dragChangeBottom = false;
	let dragChangeRight = false;
	
	const dragWindow = new Draggable(position => {
		editorModalEl.style.top = Math.max(0, startDragTop + position.deltaY * dragChangeTop) + "px";
		editorModalEl.style.left = Math.max(0, startDragLeft + position.deltaX * dragChangeLeft) + "px";
		editorModalEl.style.bottom = Math.max(0, startDragBottom - position.deltaY * dragChangeBottom) + "px";
		editorModalEl.style.right = Math.max(0, startDragRight - position.deltaX * dragChangeRight) + "px";
	});
	
	const startDrag = event => {
		const rect = editorModalEl.getBoundingClientRect();
		startDragTop = rect.top;
		startDragLeft = rect.left;
		startDragBottom = window.innerHeight - rect.bottom;
		startDragRight = window.innerWidth - rect.right;
		dragWindow.startDrag(event);
	}
	
	editorModalWindowDrag.onmousedown = event => {
		dragChangeTop = true;
		dragChangeLeft = true;
		dragChangeBottom = true;
		dragChangeRight = true;
		startDrag(event);
	};
	editorModalDragN.onmousedown = event => {
		dragChangeTop = true;
		dragChangeLeft = false;
		dragChangeBottom = false;
		dragChangeRight = false;
		startDrag(event);
	};
	editorModalDragE.onmousedown = event => {
		dragChangeTop = false;
		dragChangeLeft = false;
		dragChangeBottom = false;
		dragChangeRight = true;
		startDrag(event);
	};
	editorModalDragS.onmousedown = event => {
		dragChangeTop = false;
		dragChangeLeft = false;
		dragChangeBottom = true;
		dragChangeRight = false;
		startDrag(event);
	};
	editorModalDragW.onmousedown = event => {
		dragChangeTop = false;
		dragChangeLeft = true;
		dragChangeBottom = false;
		dragChangeRight = false;
		startDrag(event);
	};
	editorModalDragNE.onmousedown = event => {
		dragChangeTop = true;
		dragChangeLeft = false;
		dragChangeBottom = false;
		dragChangeRight = true;
		startDrag(event);
	};
	editorModalDragSE.onmousedown = event => {
		dragChangeTop = false;
		dragChangeLeft = false;
		dragChangeBottom = true;
		dragChangeRight = true;
		startDrag(event);
	};
	editorModalDragNW.onmousedown = event => {
		dragChangeTop = true;
		dragChangeLeft = true;
		dragChangeBottom = false;
		dragChangeRight = false;
		startDrag(event);
	};
	editorModalDragSW.onmousedown = event => {
		dragChangeTop = false;
		dragChangeLeft = true;
		dragChangeBottom = true;
		dragChangeRight = false;
		startDrag(event);
	};
	
	document.body.appendChild(editorModalEl);
	
	return editorModalContent;
}

export default EditorModal;