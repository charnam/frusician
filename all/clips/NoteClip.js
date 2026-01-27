import { HTML, SVG } from "imperative-html";
import Clip from "./Clip.js";
import BoxAnimation from "../ui/BoxAnimation.js";

class NoteClip extends Clip {
	static typeID = "noteClip"
	static Placement = class NoteClipPlacement extends Clip.Placement {
		render(parentNode) {
			const clipPlacement = super.render(parentNode);
			
			clipPlacement.appendChild(new SVG.svg({width: 1, height: 1}));
			
			clipPlacement.ondblclick = event => {
				if(event.target == clipPlacement) {
					const clipEditor = this.clip.openClipEditor();
					BoxAnimation.fromElements(clipPlacement, clipEditor.parentElement);
				}
			}
			
			return clipPlacement;
		}
		
		updateRendered() {
			super.updateRendered();
			for(let target of this.boundTo) {
				const notePreview = target.querySelector("svg");
				if(notePreview) {
					
				}
			}
		}
	}
	
	notes = [];
	
	renderClipEditor(parentNode) {
		const editor = super.renderClipEditor(parentNode);
		
		editor.appendChild(
			new HTML.div({class: "note-editor"})
		)
		
		return editor;
	}
}

class Note {
	pitch = 60;
	time = 0;
	
	serialize() {
		return {
			pitch: this.pitch,
			time: this.time
		}
	}
	
	static fromSerialized(serialized) {
		const note = new this();
		note.pitch = serialized.pitch;
		note.time = serialized.time;
	}
}

export default NoteClip;