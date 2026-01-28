class Note {
	clip = null;
	pitch = 60;
	time = 0;
	duration = 0.125;
	
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