import NodePlaybackInstance from "../../playback/NodePlaybackInstance.js";
import PlaybackInstanceInputNodeValue from "../values/inputs/PlaybackInstanceInputNodeValue.js";
import SliderInputNodeValue from "../values/inputs/SliderInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "./BaseNode.js";

class StereoVolumeNode extends BaseNode {
	static name = "Stereo Volume";
	static typeID = "stereoVolume";
	static category = "Basic";
	
	inputs = [
		new SliderInputNodeValue({min: 0, max: 2, step: 0.01, default: 0.2, name: "volume-left", label: "Left Channel"}),
		new SliderInputNodeValue({min: 0, max: 2, step: 0.01, default: 0.2, name: "volume-right", label: "Right Channel"}),
		new PlaybackInstanceInputNodeValue({name: "incoming-playback", label: "Input Playback"}),
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({name: "returned-playback", label: "Output Playback"}, () => this.playbackInstance)
	];
	
	playbackInstance = new NodePlaybackInstance((time, channel) => {
		return this.getInputValue("incoming-playback").getSampleAt(time, channel)
				* (channel == 0 ? this.getInputValue("volume-left") : this.getInputValue("volume-right"));
	})
}

export default StereoVolumeNode;