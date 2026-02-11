import Math2 from "../../lib/Math2.js";

class Note {
	clip = null;
	pitch = 60;
	time = 0;
	duration = 0.125;
	get endTime() {
		return this.time + this.duration;
	}
	get timeSeconds() {
		return this.clip.track.song.beatsToSeconds(this.time)
	}
	get durationSeconds() {
		return this.clip.track.song.beatsToSeconds(this.duration);
	}
	get endTimeSeconds() {
		return this.clip.track.song.beatsToSeconds(this.endTime);
	}
	
	getPhaseAt(timeSeconds) {
		return (Math2.midiToFreq(this.pitch) * (timeSeconds - this.timeSeconds));
	}
	
	secondsToBeats(sec) {
		const timeBeats = sec / 60 * this.clip.track.song.tempo;
		const timeMeasures = timeBeats / this.clip.track.song.beatsPerMeasure;
		return {
			timeBeats,
			timeMeasures
		}
	}
	
	constructor(clip, pitch, time, duration) {
		this.clip = clip;
		this.pitch = pitch;
		this.time = time;
		this.duration = duration;
	}
	
	getWithTimeOffset(time) {
		const note = new this.constructor(this.clip);
		note.pitch = this.pitch;
		note.time = this.time + time;
		note.duration = this.duration;
		return note;
	}
	
	serialize() {
		return {
			pitch: this.pitch,
			time: this.time,
			duration: this.duration
		}
	}
	static fromSerialized(serialized, clip) {
		const note = new this(clip);
		note.pitch = serialized.pitch;
		note.time = serialized.time;
		note.duration = serialized.duration;
		return note;
	}
}

export default Note;