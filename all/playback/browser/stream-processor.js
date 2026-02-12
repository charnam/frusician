class StreamProcessor extends AudioWorkletProcessor {
	constructor(options) {
		super();
		
		this.channelCount = options.processorOptions?.channelCount || 1;
		
		this.resetBuffers();
		
		this.sampleRate = sampleRate;
		this.started = false;
		
		this.port.onmessage = (event) => {
			if(event.data.type === "chunk") {
				this.appendChunk(event.data.samples, event.data.forceClear);
			} else if(event.data.type === "reset") {
				this.resetBuffers();
			}
		};
	}
	
	resetBuffers() {
		this.readIndex = 0;
		this.buffers = Array.from({length: this.channelCount}, () => new Float32Array(0));
	}
	
	appendChunk(channelBuffers, forceClear = false) {
		for(let channel in channelBuffers) {
			const chunk = channelBuffers[channel];
			let buffer = this.buffers[channel];
			
			if(this.readIndex > 0) {
				// compact
				buffer = buffer.slice(forceClear ? buffer.length : this.readIndex);
			}
			
			// left channel is used for length to prevent somehow desynchonizing
			const merged = new Float32Array(buffer.length + chunk.length);
			merged.set(buffer, 0);
			merged.set(chunk, buffer.length);
			this.buffers[channel] = merged;
		}
		if(this.readIndex > 0) {
			this.readIndex = 0;
		}
	}
	
	process(_inputs, outputs) {
		// Track 0
		const output = outputs[0];
		
		// Each audio channel should have the same duration. The left channel is used here.
		const samplesNeeded = output[0].length;
		
		const bufferedSeconds = (this.buffers[0].length - this.readIndex) / this.sampleRate;
		
		if(bufferedSeconds < 0.15) {
			this.port.postMessage({type: "need-data"});
		}
		
		for (let sample = 0; sample < samplesNeeded; sample++) {
			for(let channel = 0; channel < this.channelCount; channel++) {
				if(this.readIndex < this.buffers[channel].length) {
					output[channel][sample] = this.buffers[channel][this.readIndex];
				} else {
					output[channel][sample] = 0;
				}
			}
			this.readIndex++;
		}
		
		return true;
	}
	
	_debug(value) {
		this.port.postMessage({type: "debug", value});
	}
}

registerProcessor("stream-processor", StreamProcessor);