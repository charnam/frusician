import NoteClip from "../clips/NoteClip.js";
import Note from "../clips/NoteTrack/Note.js";
import Math2 from "../lib/Math2.js";
import NodeGraph from "../nodegraph/NodeGraph.js";
import BasicInstrumentNode from "../nodegraph/nodes/BasicInstrumentNode.js";
import MainoutputNode from "../nodegraph/nodes/MainoutputNode.js";
import TrackinputNode from "../nodegraph/nodes/TrackinputNode.js";
import ClipTrack from "./ClipTrack.js";

class NoteTrack extends ClipTrack {
	static typeID = "noteTrack";
	static typeName = "Note Track";
	static acceptsClipTypes = [NoteClip];
	
	noteSamplePlayback = null;
	
	constructor(...args) {
		super(...args);
		const inputNode = new TrackinputNode();
		const instrumentNode = new BasicInstrumentNode();
		instrumentNode.y = -30;
		const outputNode = new MainoutputNode();
		
		this.nodeGraph = new NodeGraph(this, [
			inputNode,
			instrumentNode,
			outputNode
		])
		
		instrumentNode.inputConnections.noteTrack = {nodeId: inputNode.id, outputName: "track"};
		outputNode.inputConnections.playback = {nodeId: instrumentNode.id, outputName: "returned-playback"};
	}
	
	get notes() {
		const output = [];
		for(let placement of this.clipPlacement) {
			if(placement instanceof NoteClip.Placement) {
				for(let loop = 0; loop <= placement.loopCount; loop++) {
					output.push(...placement.clip.notes.map(note => note.getWithTimeOffset(placement.time + placement.duration * loop)));
				}
			}
		}
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
	
	getSampleRange(startTime, sampleCount, secondsPerSample, channel) {
		return this.nodeGraph.nodes.MAIN_OUTPUT.outputPlayback.getSampleRange(startTime, sampleCount, secondsPerSample, channel);
	}
	
	playNoteSample(pitch) {
		if(!this.noteSamplePlayback) {
			this.noteSamplePlayback = this.nodeGraph.nodes.MAIN_OUTPUT.outputPlayback.createDOMPlayer();
		}
		
		const samplePlaybackTrack = new NoteTrack();
		
		samplePlaybackTrack.nodeGraph = NodeGraph.fromSerialized(this.nodeGraph);
		
		this.noteSamplePlayback.currentTime = 0;
		this.noteSamplePlayback.play();
		this.testingNote = new Note()
	}
	
	serialize() {
		const serialized = super.serialize();
		
		serialized.nodeGraph = this.nodeGraph.serialize();
		
		return serialized;
	}
	
	static fromSerialized(serialized, song) {
		const track = super.fromSerialized(serialized, song);
		
		track.nodeGraph = NodeGraph.fromSerialized(serialized.nodeGraph, track);
		
		return track;
	}
}

export default NoteTrack;