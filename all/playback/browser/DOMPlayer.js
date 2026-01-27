class DOMPlayer {
	static CHUNK_DURATION = 0.1;
	static TARGET_BUFFER = 0.3;
	
	node = null;
	
	_playStartCtxTime = 0;
	_playStartMediaTime = 0;
	
	_nextChunkTime = 0;
	_channelCount = 0;
	_streaming = false;
	
	_currentTime = 0;
	set currentTime(seconds) {
		this._currentTime = seconds;
		this._nextChunkTime = seconds;
		
		if(this.ctx) {
			if (this.node) {
				this.node.port.postMessage({ type: "reset" });
			}
			if (this.ctx.state === "running") {
				this._playStartCtxTime = this.ctx.currentTime;
				this._playStartMediaTime = seconds;
			}
		}
	}
	get currentTime() {
		if(this.ctx && this.ctx.state === "running") {
			return this._playStartMediaTime + (this.ctx.currentTime - this._playStartCtxTime);
		}
		return this._currentTime;
	}
	
	set volume(volume) {
		this.gain.gain.value = volume;
	}
	get volume() {
		return this.gain.gain.value;
	}
	
	async play() {
		await this.pause();
		this._playStartCtxTime = this.ctx.currentTime;
		this._playStartMediaTime = this._currentTime;
		this._nextChunkTime = this._currentTime;
		await this.ctx.resume();
		this._stream();
	}
	
	async pause() {
		await this._ensureNode();
		this._currentTime = this.currentTime;
		this.node.port.postMessage({type: "reset"});
		if (this.ctx.state === "running") {
			await this.ctx.suspend();
		}
	}
	
	constructor(playbackInstance) {
		this.playbackInstance = playbackInstance;
		
		this._currentTime = 0;
		this._nextChunkTime = 0;
		this._streaming = false;
		
	}
	
	async _ensureNode() {
		if (this.node && this._channelCount === this.playbackInstance.channelCount) return;
		
		if (this.node) {
			this.node.disconnect();
			delete this.node;
		} else if(!this.ctx) {
			this.ctx = new AudioContext();
			this.gain = this.ctx.createGain();
			this.gain.connect(this.ctx.destination);
		}
		
		// FIXME: absolute URL path used here
		await this.ctx.audioWorklet.addModule("/all/playback/browser/stream-processor.js");
		this.node = new AudioWorkletNode(this.ctx, "stream-processor", {
			numberOfOutputs: 1,
			outputChannelCount: [this.playbackInstance.channelCount],
			processorOptions: {channelCount: this.playbackInstance.channelCount}
		});
		this.node.connect(this.gain);
		this._channelCount = this.playbackInstance.channelCount;
		
		this.node.port.onmessage = (e) => {
			if(e.data.type == "need-data") {
				this._stream();
			}
			if(e.data.type == "debug") {
				console.log(e.data.value);
			}
		};
	}
	
	async _stream() {
		if (this._streaming) return;
		await this._ensureNode();
		this._streaming = true;
		
		const profilingStartTime = Date.now();
		const playheadTime = this._playStartMediaTime + this.ctx.currentTime - this._playStartCtxTime;
		while (this._nextChunkTime < playheadTime + DOMPlayer.TARGET_BUFFER) {
			const samples = this.playbackInstance.getChannelSampleRange(
				this._nextChunkTime, DOMPlayer.CHUNK_DURATION, this.ctx.sampleRate);
			
			this.node.port.postMessage({type: "chunk", samples}, samples.map(channel => channel.buffer));
			
			this._nextChunkTime += DOMPlayer.CHUNK_DURATION;
		}
		
		this.testedOverhead = (Date.now() - profilingStartTime) / (DOMPlayer.TARGET_BUFFER * 1000);
		
		this._currentTime = playheadTime;
		this._streaming = false;
	}
}

export default DOMPlayer;