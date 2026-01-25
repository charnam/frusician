import PlaybackInstance from "./PlaybackInstance.js";

class TrackPlaybackInstance extends PlaybackInstance {
	constructor(track) {
		super();
		this.track = track;
	}
	
	getSampleAt(time) {
		return this.track.getSampleAt(time);
	}
}

export default TrackPlaybackInstance;