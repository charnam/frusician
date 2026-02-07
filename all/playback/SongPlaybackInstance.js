import PlaybackInstance from "./PlaybackInstance.js";

class SongPlaybackInstance extends PlaybackInstance {
	constructor(song) {
		super();
		this.song = song;
	}
	
	getSampleAt(time, channel) {
		let output = 0;
		for(let track of Object.values(this.song.tracks)) {
			output += track.playbackInstance.getSampleAt(time, channel);
		}
		return output;
	}
	
	getSampleRange(startTime, sampleCount, secondsPerSample, channel) {
		const output = new Float32Array(sampleCount);
		
		for(let track of Object.values(this.song.tracks)) {
			const samples = track.playbackInstance.getSampleRange(startTime, sampleCount, secondsPerSample, channel);
			for(let index in samples) {
				output[index] += samples[index];
			}
		}
		
		return output;
	}
}

export default SongPlaybackInstance;