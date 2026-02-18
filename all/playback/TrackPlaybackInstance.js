import ArrayMath from "../lib/ArrayMath/ArrayMath.js";
import Math2 from "../lib/Math2.js";
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
		let output;
		
		if(this.track.song.perfectLoop) {
			startTime = Math2.mod(startTime, this.track.song.durationSeconds);
			
			output = this.track.getSampleRange(startTime, sampleCount, secondsPerSample, channel);
			
			const previous_playback = this.track.getSampleRange(startTime - this.track.song.durationSeconds, sampleCount, secondsPerSample, channel);
			const next_playback = this.track.getSampleRange(startTime + this.track.song.durationSeconds, sampleCount, secondsPerSample, channel);
			
			ArrayMath.addToArray(output, previous_playback);
			ArrayMath.addToArray(output, next_playback);
		} else {
			output = this.track.getSampleRange(startTime, sampleCount, secondsPerSample, channel);
		}
		
		return output;
	}
}

export default TrackPlaybackInstance;