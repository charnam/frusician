import PlaybackInstance from "./PlaybackInstance.js";

class RangedNodePlaybackInstance extends PlaybackInstance {
	constructor(getSampleRange = (startTime, sampleCount, secondsPerSample, channel) => 0) {
		super();
		this.getSampleRange = getSampleRange;
	}
}

export default RangedNodePlaybackInstance;