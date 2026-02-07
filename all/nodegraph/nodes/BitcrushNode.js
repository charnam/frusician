import RangedNodePlaybackInstance from "../../playback/RangedNodePlaybackInstance.js";
import PlaybackInstanceInputNodeValue from "../values/inputs/PlaybackInstanceInputNodeValue.js";
import SliderInputNodeValue from "../values/inputs/SliderInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "./BaseNode.js";

class BitcrushNode extends BaseNode {
	static name = "Bitcrusher";
	static typeID = "bitcrush";
	static category = "Effects";
	
	inputs = [
		new PlaybackInstanceInputNodeValue({name: "playback", label: "Playback"}),
		new SliderInputNodeValue({name: "bitcrush", label: "Sample quality", min: 0.001, max: 1, step: 0.001, default: 0.02}),
		new SliderInputNodeValue({name: "freq-crush", label: "Frequency divisor", min: 1, max: 32, step: 0.1, default: 1}),
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({name: "returned-playback", label: "Output"}, () => this.playbackInstance)
	];
	
	playbackInstance = new RangedNodePlaybackInstance((startTime, sampleCount, secondsPerSample, channel) => {
		const playback = this.getInputValue("playback");
		const bitcrush = this.getInputValue("bitcrush");
		const frequencyCrush = this.getInputValue("freq-crush");
		
		const output = new Float32Array(sampleCount);
		const samples = playback.getSampleRange(startTime, sampleCount / frequencyCrush + 2, secondsPerSample * frequencyCrush, channel);
		for(let sample in output) {
			output[sample] = Math.round(samples[Math.floor(sample / frequencyCrush)] / bitcrush) * bitcrush;
		}
		
		return output;
	})
}

export default BitcrushNode;