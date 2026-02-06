import NodePlaybackInstance from "../../playback/NodePlaybackInstance.js";
import PlaybackInstanceInputNodeValue from "../values/inputs/PlaybackInstanceInputNodeValue.js";
import SliderInputNodeValue from "../values/inputs/SliderInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "./BaseNode.js";

class VolumeNode extends BaseNode {
	static name = "Gain";
	static typeID = "volume";
	static category = "Basic";
	
	inputs = [
		new SliderInputNodeValue({min: 0, max: 1, step: 0.1, default: 0.2, name: "volume", label: "Volume"}),
		new PlaybackInstanceInputNodeValue({name: "incoming-playback", label: "Input Playback"}),
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({name: "returned-playback", label: "Output Playback"}, () => this.playbackInstance)
	];
	
	playbackInstance = new NodePlaybackInstance((time, channel) => {
		return this.getInputValue("incoming-playback").getSampleAt(time, channel)
				* this.getInputValue("volume");
	})
}

export default VolumeNode;