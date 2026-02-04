import NoteClip from "../clips/NoteClip.js";
import Math2 from "../lib/Math2.js";
import NodeGraph from "../nodegraph/NodeGraph.js";
import MainoutputNode from "../nodegraph/nodes/MainoutputNode.js";
import TrackinputNode from "../nodegraph/nodes/TrackinputNode.js";
import ClipTrack from "./ClipTrack.js";

class NoteTrack extends ClipTrack {
	static typeID = "noteTrack";
	static typeName = "Note Track";
	static acceptsClipTypes = [NoteClip];
	
	shouldRegenerateNotes = true; // caching
	
	_notesCache = [];
	
	constructor(...args) {
		super(...args);
		this.nodeGraph = new NodeGraph(this, [
			new TrackinputNode(),
			new MainoutputNode()
		])
	}
	
	get notes() {
		if(this._notesCache && !this.shouldRegenerateNotes) return this._notesCache;
		const output = [];
		for(let placement of this.clipPlacement) {
			if(placement instanceof NoteClip.Placement) {
				for(let loop = 0; loop <= placement.loopCount; loop++) {
					output.push(...placement.clip.notes.map(note => note.getWithTimeOffset(placement.time + placement.duration * loop)));
				}
			}
		}
		this._notesCache = output;
		return output;
	}
	
	render(parentNode) {
		const track = super.render(parentNode);
		track.classList.add("note-track");
		
		track.querySelector(".track-info").ondblclick = () => {
			this.nodeGraph.openGraphEditor();
		}
		
		const clipPlacements = track.querySelector(".clip-placements");
		
		clipPlacements.addEventListener("dblclick", event => {
			if(event.target == clipPlacements) {
				const clip = new NoteClip(this);
				const clipPlacement = new NoteClip.Placement(clip);
				clipPlacement.duration = 1;
				
				const clipPlacementsRect = clipPlacements.getBoundingClientRect();
				clipPlacement.time = Math.floor(((event.clientX - clipPlacementsRect.left) / clipPlacementsRect.width) * this.song.durationMeasures);
				
				this.addClip(clip);
				this.addClipPlacement(clipPlacement);
			}
		});
		
		return track;
	}
	updateRendered() {
		super.updateRendered();
	}
	
	getSampleAt(time, channel) {
		const timeBeats = time / 60 * this.song.tempo;
		const timeMeasures = timeBeats / this.song.beatsPerMeasure;
		const playingNotes = this.notes.filter(note => {
			return note.time <= timeMeasures && note.time + note.duration >= timeMeasures;
		});
		let output = 0;
		for(let note of playingNotes) {
			output += Math.sin(time * Math2.midiToFreq(note.pitch) * Math.PI);
		}
		if(playingNotes.length > 0) {
			output /= playingNotes.length;
		}
		return output;
	}
}

export default NoteTrack;