import PlaybackInstance from "./PlaybackInstance.js";

class TrackPlaybackInstance extends PlaybackInstance {
	constructor(track) {
		super();
		this.track = track;
	}
	
	getSampleAt(time, channel) {
		return this.track.getSampleRange(time, 1, 1, channel)[0];
	}
	
	getSampleRange(startTime, sampleCount, secondsPerSample, channel) {
		return this.track.getSampleRange(startTime, sampleCount, secondsPerSample, channel);
	}
}

export default TrackPlaybackInstance;