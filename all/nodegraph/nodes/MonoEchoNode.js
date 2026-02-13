import RangedNodePlaybackInstance from "../../playback/RangedNodePlaybackInstance.js";
import PlaybackInstanceInputNodeValue from "../values/inputs/PlaybackInstanceInputNodeValue.js";
import SliderInputNodeValue from "../values/inputs/SliderInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "./BaseNode.js";

class MonoEchoNode extends BaseNode {
	static name = "Echo";
	static typeID = "echo";
	static category = "Effects";
	
	get inputs() {
		return [
			new SliderInputNodeValue({node: this, min: 0, max: 2, step: 1 / this.graph.track.song.beatsPerMeasure / this.graph.track.song.beatsPerMeasure, default: 0.25, name: "delay", label: "Delay"}),
			new SliderInputNodeValue({node: this, min: 1, max: 8, step: 1, default: 4, name: "repetitions", label: "Repetitions"}),
			new PlaybackInstanceInputNodeValue({node: this, name: "incoming-playback", label: "Input Playback"}),
		];
	}
	outputs = [
		new PlaybackInstanceOutputNodeValue({name: "returned-playback", label: "Output Playback"}, () => this.playbackInstance)
	];
	
	playbackInstance = new RangedNodePlaybackInstance((startTime, sampleCount, secondsPerSample, channel) => {
		const playback = this.getInputValue("incoming-playback");
		const delay = this.graph.track.song.beatsToSeconds(this.getInputValue("delay"));
		const repetitions = this.getInputValue("repetitions");
		
		const output = new Float32Array(sampleCount);
		
		const maxStartOffset = delay * repetitions;
		const range = playback.getSampleRange(startTime - maxStartOffset, Math.ceil(sampleCount + maxStartOffset / secondsPerSample), secondsPerSample, channel);
		
		for(let sample = 0; sample < sampleCount; sample++) {
			let value = 0;
			for(let i = 0; i < repetitions; i++) {
				value += range[sample + Math.floor((maxStartOffset - delay * i) / secondsPerSample)] * (1 - i / repetitions);
			}
			output[sample] = value;
		}
		
		return output;
	})
}

export default MonoEchoNode;