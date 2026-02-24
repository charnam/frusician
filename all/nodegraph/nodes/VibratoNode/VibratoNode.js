import RangedNodePlaybackInstance from "../../../playback/RangedNodePlaybackInstance.js";
import PlaybackInstanceInputNodeValue from "../../values/inputs/PlaybackInstanceInputNodeValue.js";
import SliderInputNodeValue from "../../values/inputs/SliderInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "../BaseNode.js";

import initSync, {apply_vibrato} from "./pkg/frusician_wasm_vibratonode.js";
initSync();

class VibratoNode extends BaseNode {
	static name = "Vibrato";
	static typeID = "vibrato";
	static category = "Effects";
	
	inputs = [
		new PlaybackInstanceInputNodeValue({name: "playback", label: "Playback"}),
		new SliderInputNodeValue({name: "intensity_v2", label: "Intensity", min: 0.001, max: 0.015, step: 0.00001}),
		new SliderInputNodeValue({name: "speed_v2", label: "Speed", min: 0.1, max: 10, step: 0.1}),
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({name: "returned-playback", label: "Output"}, () => this.playbackInstance)
	];
	
	playbackInstance = new RangedNodePlaybackInstance((startTime, sampleCount, secondsPerSample, channel) => {
		const playback = this.getInputValue("playback");
		const speed = this.graph.track.song.secondsToBeats(this.getInputValue("speed_v2"));
		const intensity = this.getInputValue("intensity_v2") / speed;
		
		const output = new Float32Array(sampleCount);
		const samples = playback.getSampleRange(startTime - intensity * 2, sampleCount + Math.ceil(intensity / secondsPerSample * 4), secondsPerSample, channel);
		
		apply_vibrato(samples, output, intensity, speed, secondsPerSample, startTime);
		
		return output;
	})
	
	// This is here, because previously speed values were calculated differently,
	// and I want to be able to load my old song files.
	static fromSerialized(serializedData, graph) {
		const node = super.fromSerialized(serializedData, graph);
		
		if(typeof node.inputValues.speed !== "undefined") {
			node.inputValues.speed_v2 = graph.track.song.beatsToSeconds(node.inputValues.speed);
			delete node.inputValues.speed;
		}
		
		if(typeof node.inputValues.intensity !== "undefined") {
			node.inputValues.intensity_v2 = node.inputValues.intensity * graph.track.song.secondsToBeats(node.inputValues.speed_v2);
			delete node.inputValues.intensity;
		}
		
		return node;
	}
}

export default VibratoNode;