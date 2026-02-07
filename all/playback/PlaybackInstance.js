import DOMPlayer from "./browser/DOMPlayer.js";

class PlaybackInstance {
	channelCount = 2;
	
	get duration() { // Total playback time, in seconds
		return 4;
	}
	
	getSampleAt(time, channel) { // Time is in seconds
		return Math.sin(time * Math.PI * 440 * (channel + 1)); // Resulting sample (-1 to 1) - 100Hz?
	}
	
	getSampleRange(startTime, duration, samplesPerSecond, channel) {
		const secondsPerSample = 1 / samplesPerSecond;
		const samples = new Float32Array(duration / secondsPerSample);
		
		for(let index = 0; index < samples.length; index++) {
			const currentTime = index * secondsPerSample + startTime;
			samples[index] = this.getSampleAt(currentTime, channel);
		}
		
		return samples;
	}
	
	getChannelSamplesAt(time) {
		return Array.from({length: this.channelCount}, (_, index) => this.getSampleAt(time, index));
	}
	
	getChannelSampleRange(startTime, duration, samplesPerSecond) {
		return Array.from({length: this.channelCount}, (_, index) => this.getSampleRange(startTime, duration, samplesPerSecond, index));
	}
	
	createDOMPlayer() {
		return new DOMPlayer(this);
	}
}

export default PlaybackInstance;