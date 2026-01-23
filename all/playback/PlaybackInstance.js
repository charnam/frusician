
class PlaybackInstance {
	beatsPerMinute = 120;
	
	getSampleAt(time) {
		return 0;
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
}

export default PlaybackInstance;