import { HTML } from "imperative-html";
import Note from "../clips/NoteTrack/Note.js";
import NodeGraph from "../nodegraph/NodeGraph.js";
import MainoutputNode from "../nodegraph/nodes/MainoutputNode.js";
import ClipTrack from "./ClipTrack.js";
import BoxAnimation from "../ui/BoxAnimation.js";
import SampleClip from "../clips/SampleClip.js";
import PlaybackinputNode from "../nodegraph/nodes/PlaybackinputNode.js";
import RangedNodePlaybackInstance from "../playback/RangedNodePlaybackInstance.js";

class SampleTrack extends ClipTrack {
	static typeID = "sampleTrack";
	static typeName = "Sample Track";
	static acceptsClipTypes = [SampleClip];
	
	rawPlaybackInstance = new RangedNodePlaybackInstance((startTime, sampleCount, secondsPerSample, channel) => {
		const arr = new Float32Array(sampleCount);
		
		/*for(let i = 0; i < arr.length; i++) {
			const time = i / sampleCount;
		}*/
		
		return arr;
	})
	
	constructor(...args) {
		super(...args);
		const inputNode = new PlaybackinputNode();
		const outputNode = new MainoutputNode();
		
		this.nodeGraph = new NodeGraph(this, [
			inputNode,
			outputNode
		])
		
		outputNode.inputConnections.playback = {nodeId: inputNode.id, outputName: "playback"};
	}
	
	render(parentNode) {
		const track = super.render(parentNode);
		track.classList.add("sample-track");
		
		const nodeGraphButton = new HTML.button({class: "node-graph-button"});
		track.querySelector(".track-info").appendChild(nodeGraphButton);
		
		nodeGraphButton.onclick = () => {
			const editor = this.nodeGraph.openGraphEditor();
			BoxAnimation.fromElements(nodeGraphButton, editor);
		}
		
		const clipPlacements = track.querySelector(".clip-placements");
		
		clipPlacements.addEventListener("click", async event => {
			if(event.target == clipPlacements) {
				const clip = await SampleClip.upload(this);
				const clipPlacement = new SampleClip.Placement(clip);
				
				clipPlacement.duration = this.song.secondsToBeats(clip.duration);
				
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

export default SampleTrack;