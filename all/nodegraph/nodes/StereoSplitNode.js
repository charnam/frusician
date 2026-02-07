import PlaybackInstanceInputNodeValue from "../values/inputs/PlaybackInstanceInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "./BaseNode.js";
import NodePlaybackInstance from "../../playback/NodePlaybackInstance.js";

class StereoSplitNode extends BaseNode {
	static name = "Stereo Split";
	static typeID = "stereoVolume";
	static category = "Basic";
	
	inputs = [
		new PlaybackInstanceInputNodeValue({name: "incoming-playback", label: "Input Playback"}),
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({name: "returned-playback-left", label: "Left Channel"}, () => this.playbackInstanceLeft),
		new PlaybackInstanceOutputNodeValue({name: "returned-playback-right", label: "Right Channel"}, () => this.playbackInstanceRight)
	];
	
	
	playbackInstanceLeft = new NodePlaybackInstance((time, channel) => {
		if(channel == 0) {
			return this.getInputValue("incoming-playback").getSampleAt(time, channel)
		} else {
			return 0;
		}
	})
	playbackInstanceRight = new NodePlaybackInstance((time, channel) => {
		if(channel == 1) {
			return this.getInputValue("incoming-playback").getSampleAt(time, channel)
		} else {
			return 0;
		}
	})
}

export default StereoSplitNode;