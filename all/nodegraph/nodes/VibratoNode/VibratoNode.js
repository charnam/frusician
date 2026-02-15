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
		new SliderInputNodeValue({name: "intensity", label: "Intensity", min: 0, max: 0.004, step: 0.00001}),
		new SliderInputNodeValue({name: "speed", label: "Speed", min: 0, max: 10, step: 0.1}),
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({name: "returned-playback", label: "Output"}, () => this.playbackInstance)
	];
	
	playbackInstance = new RangedNodePlaybackInstance((startTime, sampleCount, secondsPerSample, channel) => {
		const playback = this.getInputValue("playback");
		const intensity = this.getInputValue("intensity");
		const speed = this.graph.track.song.beatsToSeconds(this.getInputValue("speed"));
		
		const output = new Float32Array(sampleCount);
		const samples = playback.getSampleRange(startTime - intensity * 2, sampleCount + Math.ceil(intensity / secondsPerSample * 4), secondsPerSample, channel);
		
		apply_vibrato(samples, output, intensity, speed, secondsPerSample, startTime);
		
		return output;
	})
}

export default VibratoNode;