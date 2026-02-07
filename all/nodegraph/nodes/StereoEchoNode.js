import NodePlaybackInstance from "../../playback/NodePlaybackInstance.js";
import PlaybackInstanceInputNodeValue from "../values/inputs/PlaybackInstanceInputNodeValue.js";
import SliderInputNodeValue from "../values/inputs/SliderInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "./BaseNode.js";

class MonoEchoNode extends BaseNode {
	static name = "Stereo Echo";
	static typeID = "stereoEcho";
	static category = "Effects";
	
	inputs = [
		new SliderInputNodeValue({min: 0, max: 8, step: 0.25, default: 0.2, name: "delay", label: "Delay"}),
		new SliderInputNodeValue({min: 1, max: 8, step: 1, default: 4, name: "repetitions", label: "Repetitions"}),
		new PlaybackInstanceInputNodeValue({name: "incoming-playback", label: "Input Playback"}),
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({name: "returned-playback", label: "Output Playback"}, () => this.playbackInstance)
	];
	
	playbackInstance = new NodePlaybackInstance((time, channel) => {
		
		const playback = this.getInputValue("incoming-playback");
		const delay = this.getInputValue("delay");
		const repetitions = this.getInputValue("repetitions");
		
		let output = 0;
		for(let i = 0; i < repetitions; i++) {
			output += playback.getSampleAt(time - delay * i, channel) * (1 - (i / repetitions));
		}
		
		return output;
	})
}

export default MonoEchoNode;