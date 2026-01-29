import { HTML, SVG } from "imperative-html";
import Clip from "./Clip.js";
import BoxAnimation from "../ui/BoxAnimation.js";
import Note from "./NoteTrack/Note.js";
import Math2 from "../lib/Math2.js";
import Draggable from "../ui/Draggable.js";

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
		new Note(this, 60, 0, 0.25),
		new Note(this, 62, 0.25, 0.25),
		new Note(this, 64, 0.5, 0.25),
		new Note(this, 60, 0.75, 0.5),
		new Note(this, 64, 0.75, 0.5),
		new Note(this, 67, 0.75, 0.5),
		new Note(this, 0, 0.75, 0.125),
		new Note(this, 88, 0.75, 0.125)
	];
	
	renderClipEditor(parentNode) {
		const editor = super.renderClipEditor(parentNode);
		
		let noteEditorContainer,
			pianoKeys,
			noteEditor;
		
		const offsetFromMiddleC = 0;
		const noteRangeStart = 0;
		const noteRangeEnd = 88;
		const noteCount = (noteRangeEnd - noteRangeStart);
		const SVGHeight = noteCount + 1;
		
		const pianoKeyWidth = 40;
		const pianoKeyHeight = 10;
		const pianoKeyNames = ["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
		
		const measuresAvailable = 1;
		
		editor.appendChild(
			noteEditorContainer = new HTML.div({class: "note-editor-scroll-box"},
				pianoKeys = new SVG.svg({class: "note-editor-piano", viewBox: `0 0 ${pianoKeyWidth} ${SVGHeight * pianoKeyHeight}`}),
				noteEditor = new SVG.svg({class: "note-editor", viewBox: `0 0 ${measuresAvailable} ${SVGHeight}`, preserveAspectRatio: "none"})
			)
		);
		
		for(let pitch = 0; pitch <= noteCount; pitch++) {
			let realPitch = Math2.mod(pitch + offsetFromMiddleC, 12);
			const y = noteCount - pitch;
			
			const guideEl = new SVG.rect({class: "note-editor-note-guide note-"+realPitch, x: 0, y, width: measuresAvailable, height: 1});
			noteEditor.appendChild(guideEl);
			
			const pianoKeyEl = new SVG.rect({class: "note-editor-piano-key note-"+realPitch, x: 0, y: y * pianoKeyHeight, width: pianoKeyWidth, height: pianoKeyHeight});
			const pianoLetterEl = new SVG.text({class: "note-editor-piano-text note-"+realPitch, x: 5, y: y * pianoKeyHeight});
			pianoKeys.appendChild(pianoKeyEl)
			pianoKeys.appendChild(pianoLetterEl)
			pianoLetterEl.textContent = pianoKeyNames[realPitch];
		}
		
		for(let beat = 0; beat < this.track.song.beatsPerMeasure * measuresAvailable; beat+=1) {
			const x = beat / this.track.song.beatsPerMeasure;
			const lineEl = new SVG.line({class: "note-editor-beat-guide", x1: x, y1: 0, x2: x, y2: noteCount + 1});
			noteEditor.appendChild(lineEl);
		}
		
		const update = () => {
			noteEditor.querySelectorAll(".note-editor-user-note").forEach(note => note.remove());
			
			for(let note of this.notes) {
				const noteEl = new SVG.rect({class: "note-editor-user-note", fill: "white", x: note.time, y: noteCount - note.pitch, width: note.duration, height: 1});
				noteEditor.appendChild(noteEl)
				
				const noteDragHandler = position => {
					const editorBounds = noteEditor.getBoundingClientRect();
					const timeRel = Math.round(position.deltaX / editorBounds.width * measuresAvailable * this.track.song.beatsPerMeasure) / this.track.song.beatsPerMeasure;
					const pitchRel = Math.round(-position.deltaY / editorBounds.height * noteCount);
					
					noteEl.style.transform = `translate(${timeRel}px, ${-pitchRel}px)`;
					
					return {timeRel, pitchRel};
				}
				
				const noteDrag = new Draggable(noteDragHandler, position => {
					const output = noteDragHandler(position);
					note.time += output.timeRel;
					note.pitch += output.pitchRel;
					update();
				});
				
				noteEl.onmousedown = noteDrag.createDragEventHandler();
				noteEl.oncontextmenu = () => {
					this.notes = this.notes.filter(noteChk => noteChk !== note);
					update();
				}
			}
		}
		
		update();
		
		return editor;
	}
}

export default NoteClip;