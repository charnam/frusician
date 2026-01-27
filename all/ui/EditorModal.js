import { HTML } from "imperative-html";

function EditorModal() {
	let editorModalEl,
		editorModalWrapperEl;
	
	editorModalWrapperEl = new HTML.div({class: "editor-modal-wrapper"},
		editorModalEl = new HTML.div({class: "editor-modal-content"})
	)
	
	document.body.appendChild(editorModalWrapperEl);
	
	return editorModalEl;
}

export default EditorModal;