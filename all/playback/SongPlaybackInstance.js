import ArrayMath from "../lib/ArrayMath/ArrayMath.js";
import Math2 from "../lib/Math2.js";
import PlaybackInstance from "./PlaybackInstance.js";

class SongPlaybackInstance extends PlaybackInstance {
	get shouldLoop() {
		return this.song.perfectLoop;
	}
	get duration() {
		return this.song.durationSeconds;
	}
	
	constructor(song) {
		super();
		delete this.shouldLoop;
		delete this.duration;
		this.song = song;
	}
	
	getSampleAt(time, channel) {
		let output = 0;
		for(let track of Object.values(this.song.tracks)) {
			output += track.playbackInstance.getSampleAt(time, channel);
		}
		return output;
	}
	
	getSampleRange(startTime, sampleCount, secondsPerSample, channel, _shouldDoLoop = true) {
		const output = new Float32Array(sampleCount);
		
		for(let track of Object.values(this.song.tracks)) {
			ArrayMath.addToArray(output, track.playbackInstance.getSampleRange(startTime, sampleCount, secondsPerSample, channel));
		}
		
		return output;
	}
}

export default SongPlaybackInstance;