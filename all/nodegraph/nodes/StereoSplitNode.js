import PlaybackInstanceInputNodeValue from "../values/inputs/PlaybackInstanceInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "./BaseNode.js";
import RangedNodePlaybackInstance from "../../playback/RangedNodePlaybackInstance.js";

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
	
	
	playbackInstanceLeft = new RangedNodePlaybackInstance((startTime, sampleCount, secondsPerSample, channel) => {
		if(channel == 0) {
			return this.getInputValue("incoming-playback").getSampleRange(startTime, sampleCount, secondsPerSample, channel)
		} else {
			return new Float32Array(sampleCount);
		}
	})
	playbackInstanceRight = new RangedNodePlaybackInstance((startTime, sampleCount, secondsPerSample, channel) => {
		if(channel == 1) {
			return this.getInputValue("incoming-playback").getSampleRange(startTime, sampleCount, secondsPerSample, channel)
		} else {
			return new Float32Array(sampleCount);
		}
	})
}

export default StereoSplitNode;