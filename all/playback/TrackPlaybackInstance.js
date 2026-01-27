import PlaybackInstance from "./PlaybackInstance.js";

class TrackPlaybackInstance extends PlaybackInstance {
	constructor(track) {
		super();
		this.track = track;
	}
	
	getSampleAt(time, channel) {
		return this.track.getSampleAt(time, channel);
	}
}

export default TrackPlaybackInstance;