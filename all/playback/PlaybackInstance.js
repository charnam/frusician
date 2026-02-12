import DOMPlayer from "./browser/DOMPlayer.js";

class PlaybackInstance {
	channelCount = 2;
	
	get duration() { // Total playback time, in seconds
		return 4;
	}
	
	getSampleAt(time, channel) {
		return this.getSampleRange(time, 1, 1/8000, channel)[0];
	}
	
	getSampleRange(startTime, sampleCount, secondsPerSample, channel) {
		const samples = new Float32Array(sampleCount);
		
		for(let index = 0; index < samples.length; index++) {
			if(sampleCount !== 1) {
				samples[index] = this.getSampleAt(startTime + secondsPerSample * index, channel);
			} else {
				samples[index] = 0;
			}
		}
		
		return samples;
	}
	
	getChannelSamplesAt(time) {
		return Array.from({length: this.channelCount}, (_, index) => this.getSampleAt(time, index));
	}
	
	getChannelSampleRange(startTime, sampleCount, secondsPerSample) {
		return Array.from({length: this.channelCount}, (_, index) => this.getSampleRange(startTime, sampleCount, secondsPerSample, index));
	}
	
	createDOMPlayer() {
		return new DOMPlayer(this);
	}
}

export default PlaybackInstance;