import NodePlaybackInstance from "../../playback/NodePlaybackInstance.js";
import PlaybackInstanceInputNodeValue from "../values/inputs/PlaybackInstanceInputNodeValue.js";
import SliderInputNodeValue from "../values/inputs/SliderInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "./BaseNode.js";

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
	
	playbackInstance = new NodePlaybackInstance((time, channel) => {
		const playback = this.getInputValue("playback");
		const intensity = this.getInputValue("intensity");
		const speed = this.getInputValue("speed");
		
		return playback.getSampleAt(time + Math.sin(time * speed * Math.PI * 2) * intensity, channel);
	})
}

export default VibratoNode;