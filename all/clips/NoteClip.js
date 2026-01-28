import { HTML, SVG } from "imperative-html";
import Clip from "./Clip.js";
import BoxAnimation from "../ui/BoxAnimation.js";
import Note from "./NoteTrack/Note.js";

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
	
	notes = [
		new Note(this, 60, 0, 0.125),
		new Note(this, 61, 0.25, 0.125),
		new Note(this, 63, 0.5, 0.125),
		new Note(this, 60, 0.75, 0.125),
		new Note(this, 64, 0.75, 0.125),
		new Note(this, 67, 0.75, 0.125)
	];
	
	renderClipEditor(parentNode) {
		const editor = super.renderClipEditor(parentNode);
		
		editor.appendChild(
			new HTML.div({class: "note-editor"})
		)
		
		return editor;
	}
}

export default NoteClip;