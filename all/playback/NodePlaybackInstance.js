import PlaybackInstance from "./PlaybackInstance.js";

class NodePlaybackInstance extends PlaybackInstance {
	constructor(getSampleAt = (time, channel) => 0) {
		super();
		this.getSampleAt = getSampleAt;
	}
}

export default NodePlaybackInstance;