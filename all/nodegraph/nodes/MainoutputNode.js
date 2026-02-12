import BaseNode from "./BaseNode.js";
import PlaybackInstanceInputNodeValue from "../values/inputs/PlaybackInstanceInputNodeValue.js";
import RangedNodePlaybackInstance from "../../playback/RangedNodePlaybackInstance.js";
import SliderInputNodeValue from "../values/inputs/SliderInputNodeValue.js";

class MainoutputNode extends BaseNode {
	static name = "Main Output";
	static typeID = "mainOutput";
	static canBeAdded = false;
	id = "MAIN_OUTPUT";
	
	inputs = [
		new PlaybackInstanceInputNodeValue({label: "Playback", name: "playback"}),
		new SliderInputNodeValue({label: "Volume", name: "volume", min: 0.0, max: 1.0, step: 0.01, default: 0.1})
	];
	outputs = [
	];
	
	outputPlayback = new RangedNodePlaybackInstance((startTime, sampleCount, secondsPerSample, channel) => {
		const playback = this.getInputValue("playback");
		const volume = this.getInputValue("volume");
		
		const playbackData = playback.getSampleRange(startTime, sampleCount, secondsPerSample, channel);
		
		for(let sample in playbackData) {
			playbackData[sample] *= volume;
		}
		
		return playbackData;
	})
}

export default MainoutputNode;