import { applyToElement, HTML, SVG } from "imperative-html";
import Clip from "./Clip.js";
import BoxAnimation from "../ui/BoxAnimation.js";
import Note from "./NoteTrack/Note.js";
import Math2 from "../lib/Math2.js";
import Draggable from "../ui/Draggable.js";
import NoteTrack from "../tracks/NoteTrack.js";

class NoteClip extends Clip {
	static typeID = "noteClip"
	static Placement = class NoteClipPlacement extends Clip.Placement {
		render(parentNode) {
			const clipPlacement = super.render(parentNode);
			clipPlacement.classList.add("note-clip-placement");
			
			clipPlacement.appendChild(new SVG.svg({width: 1, height: 1, preserveAspectRatio: "none"}));
			
			clipPlacement.ondblclick = event => {
				if(event.target == clipPlacement) {
					const clipEditor = this.clip.openClipEditor(this);
					BoxAnimation.fromElements(clipPlacement, clipEditor.parentElement);
				}
			}
			
			return clipPlacement;
		}
		
		get allNotes() {
			const output = [];
			for(let loop = 0; loop <= this.loopCount; loop++) {
				output.push(...this.clip.notes.map(note => note.getWithTimeOffset(this.duration * loop)));
			}
			return output;
		}
		
		updateRendered() {
			super.updateRendered();
			for(let target of this.boundTo) {
				const notePreview = target.querySelector("svg");
				if(notePreview) {
					applyToElement(notePreview, {
						viewBox: `0 0 ${this.duration * (this.loopCount + 1)} 132`
					})
					
					for(let note of notePreview.querySelectorAll(".note")) {
						note.remove();
					}
					
					for(let note of this.allNotes) {
						const noteEl = new SVG.rect({class: "note", x: note.time, y: 132 - note.pitch, width: note.duration, height: 1});
						notePreview.appendChild(noteEl);
					}
				}
			}
		}
		
		applyLoop() {
			if(this.hasDuplicates()) {
				this.clip = this.clip.constructor.fromSerialized(this.clip.serialize(), this.clip.track);
				this.clip.name += " copy";
			}
			this.clip.notes = this.allNotes;
			this.duration += this.loopCount * this.duration;
			this.loopCount = 0;
		}
	}
	
	notes = [];
	
	renderClipEditor(parentNode, fromPlacement) {
		const editor = super.renderClipEditor(parentNode);
		
		let noteEditorContainer,
			pianoKeys,
			noteEditor;
		
		let zoomLevel = 3;
		
		const offsetFromMiddleC = 0;
		const noteRangeStart = 0;
		const noteRangeEnd = 132;
		const noteCount = (noteRangeEnd - noteRangeStart);
		const SVGHeight = noteCount + 1;
		
		const pianoKeyWidth = 40;
		const pianoKeyHeight = 10;
		const pianoKeyNames = ["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
		
		const measuresAvailable = this.track.song.durationMeasures;
		
		editor.appendChild(
			noteEditorContainer = new HTML.div({class: "note-editor-scroll-box"},
				pianoKeys = new SVG.svg({class: "note-editor-piano", viewBox: `0 0 ${pianoKeyWidth} ${SVGHeight * pianoKeyHeight}`}),
				noteEditor = new SVG.svg({class: "note-editor", viewBox: `0 0 ${measuresAvailable} ${SVGHeight}`, preserveAspectRatio: "none"})
			)
		);
		
		for(let pitch = 0; pitch <= noteCount; pitch++) {
			let realPitch = Math2.mod(pitch + offsetFromMiddleC, 12);
			const octave = Math.floor((pitch + offsetFromMiddleC) / 12) - 1;
			const y = noteCount - pitch;
			
			const guideEl = new SVG.rect({class: `note-editor-note-guide note-${realPitch} octave-${octave}`, x: 0, y, width: measuresAvailable, height: 1});
			noteEditor.appendChild(guideEl);
			
			const pianoKeyEl = new SVG.rect({class: "note-editor-piano-key note-"+realPitch, x: 0, y: y * pianoKeyHeight, width: pianoKeyWidth, height: pianoKeyHeight});
			const pianoLetterEl = new SVG.text({class: "note-editor-piano-text note-"+realPitch, x: 5, y: y * pianoKeyHeight});
			pianoKeys.appendChild(pianoKeyEl)
			pianoKeys.appendChild(pianoLetterEl)
			pianoLetterEl.textContent = pianoKeyNames[realPitch];
			if(realPitch == 0) {
				pianoLetterEl.textContent += octave
			}
		}
		
		for(let beat = 0; beat < this.track.song.beatsPerMeasure * measuresAvailable; beat+=1) {
			const x = beat / this.track.song.beatsPerMeasure;
			const lineEl = new SVG.line({class: "note-editor-beat-guide", x1: x, y1: 0, x2: x, y2: noteCount + 1});
			noteEditor.appendChild(lineEl);
		}
		
		noteEditor.appendChild(
			new SVG.rect({class: "note-editor-duration-guide note-editor-duration-guide-start", x: 0, y: 0, width: fromPlacement.time, height: SVGHeight})
		);
		noteEditor.appendChild(
			new SVG.rect({class: "note-editor-duration-guide note-editor-duration-guide-end", x: fromPlacement.time + fromPlacement.duration, y: 0, width: measuresAvailable - fromPlacement.duration, height: SVGHeight})
		);
		
		const getNotePosition = (x, y) => {
			const rect = noteEditor.getBoundingClientRect();
			return {
				x: ((x - rect.left) / rect.width * measuresAvailable - fromPlacement.time),
				y: noteRangeEnd - Math.floor((y - rect.top) / rect.height * (noteCount + 1) + noteRangeStart)
			};
		}
		
		const roundNotePosition = (pos, minimum = 0) => {
			return Math.max(minimum, Math.floor(pos * this.track.song.beatsPerMeasure * this.track.song.beatsPerMeasure) + minimum) / this.track.song.beatsPerMeasure / this.track.song.beatsPerMeasure;
		}
		
		noteEditor.addEventListener("mousedown", (event) => {
			const startPosition = getNotePosition(event.clientX, event.clientY);
			if(event.button == 0 && !event.target.classList.contains("note-editor-user-note")) {
				const addingNote = new Note(this, startPosition.y, roundNotePosition(startPosition.x), roundNotePosition(0, 1));
				
				this.track.playNoteSample(startPosition.y);
				
				const draggable = new Draggable(realPosition => {
					const position = getNotePosition(realPosition.x, realPosition.y);
					addingNote.duration = roundNotePosition(position.x - startPosition.x, 1);
					update();
				});
				draggable.startDrag(event);
				
				this.notes.push(addingNote);
				update();
			}
		})
		
		noteEditor.addEventListener("wheel", event => {
			if(event.ctrlKey) {
				zoomLevel =
					Math.max(
						Math.min(
							10,
							zoomLevel / (1 + Math.min(40, Math.max(event.deltaY, -40)) / 200)
						),
						1
					);
				
				update();
				
				event.preventDefault();
			}
		}, {passive: false})
		
		const update = () => {
			noteEditor.querySelectorAll(".note-editor-user-note, .note-editor-other-note").forEach(note => note.remove());
			noteEditor.setAttribute("style", `
				--zoom: ${zoomLevel};
				--measuresAvailable: ${measuresAvailable};
			`);
			
			for(let track of Object.values(this.track.song.tracks)) {
				if(!(track instanceof NoteTrack)) continue;
				
				for(let note of track.notes) {
					const isSameTrack = track == this.track;
					const noteEl = new SVG.rect({class: "note-editor-other-note", fill: "#f882", x: note.time, y: noteCount - note.pitch, width: note.duration, height: 1});
					if(isSameTrack) {
						noteEl.classList.add("same-track");
						noteEl.setAttribute("fill", "#fff4");
					}
					noteEditor.appendChild(noteEl)
				}
			}
			
			for(let note of this.notes) {
				const noteEl = new SVG.rect({class: "note-editor-user-note", fill: "white", x: fromPlacement.time + note.time, y: noteCount - note.pitch, width: note.duration, height: 1});
				noteEditor.appendChild(noteEl)
				
				let lastDraggedPitch = null;
				const noteDrag = new Draggable(position => {
					const newPos = getNotePosition(position.x, position.y);
					note.time = roundNotePosition(newPos.x);
					note.pitch = newPos.y;
					if(lastDraggedPitch !== note.pitch) {
						lastDraggedPitch = note.pitch;
						this.track.playNoteSample(note.pitch);
					}
					update();
				});
				
				noteEl.onmousedown = event => {
					if(event.button == 0) {
						noteDrag.drag(event);
						noteDrag.startDrag(event);
					}
				}
				noteEl.oncontextmenu = event => {
					event.preventDefault();
					this.notes = this.notes.filter(noteChk => noteChk !== note);
					update();
				}
			}
		}
		
		update();
		
		const editorWrapperSize = noteEditorContainer.getBoundingClientRect();
		const editorSize = noteEditor.getBoundingClientRect();
		
		noteEditorContainer.scrollLeft = ((fromPlacement.time + fromPlacement.duration / 2) / this.track.song.durationMeasures * editorSize.width) - editorWrapperSize.width / 2;
		noteEditorContainer.scrollTop = (editorSize.height / noteCount * Math2.average([...this.notes.map(note => noteCount - note.pitch)], 65)) - editorWrapperSize.height / 2
		
		return editor;
	}
	
	serialize() {
		const serialized = super.serialize();
		
		serialized.notes = this.notes.map(note => note.serialize());
		
		return serialized;
	}
	
	static fromSerialized(serialized, track) {
		const clip = super.fromSerialized(serialized, track);
		
		clip.notes = serialized.notes.map(note => Note.fromSerialized(note, clip));
		
		return clip;
	}
}

export default NoteClip;