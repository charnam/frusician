
class PlaybackInstance {
	beatsPerMinute = 120;
	
	get duration() { // Total playback time, in seconds
		return 4;
	}
	
	getSampleAt(time) { // Time in seconds
		return Math.sin(time * Math.PI * 100); // Resulting sample (-1 to 1) - 100Hz?
	}
	
	getSampleRange(startTime, duration, samplesPerSecond) {
		const secondsPerSample = 1 / samplesPerSecond;
		const samples = new Float32Array(duration / secondsPerSample);
		
		for(let index = 0; index < samples.length; index++) {
			const currentTime = index * secondsPerSample + startTime;
			samples[index] = this.getSampleAt(currentTime);
		}
		
		return samples;
	}
	
	createDOMPlayer() {
		
	}
}

export default PlaybackInstance;