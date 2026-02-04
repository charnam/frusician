class Note {
	clip = null;
	pitch = 60;
	time = 0;
	duration = 0.125;
	get endTime() {
		return this.clip.time + this.clip.duration;
	}
	get timeSeconds() {
		return this.beatsToSeconds(this.time)
	}
	get durationSeconds() {
		return this.beatsToSeconds(this.durationSeconds)
	}
	get endTimeSeconds() {
		return this.beatsToSeconds(this.endTime);
	}
	
	secondsToBeats(sec) {
		const timeBeats = sec / 60 * this.clip.track.song.tempo;
		const timeMeasures = timeBeats / this.clip.track.song.beatsPerMeasure;
		return {
			timeBeats,
			timeMeasures
		}
	}
	beatsToSeconds(beats) {
		const duration = beats * 60 / this.clip.track.song.tempo;
		return duration
	}
	
	constructor(clip, pitch, time, duration) {
		this.clip = clip;
		this.pitch = pitch;
		this.time = time;
		this.duration = duration;
	}
	
	serialize() {
		return {
			pitch: this.pitch,
			time: this.time,
			duration: this.duration
		}
	}
	
	getWithTimeOffset(time) {
		const note = new this.constructor(this.clip);
		note.pitch = this.pitch;
		note.time = this.time + time;
		note.duration = this.duration;
		return note;
	}
	
	static fromSerialized(serialized, clip) {
		const note = new this(clip);
		note.pitch = serialized.pitch;
		note.time = serialized.time;
		note.duration = serialized.duration;
	}
}

export default Note;