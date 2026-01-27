class Note {
	pitch = 60;
	time = 0;
	beats = 1;
	
	constructor(pitch, time, beats) {
		this.pitch = pitch;
		this.time = time;
		this.beats = beats;
	}
	
	serialize() {
		return {
			pitch: this.pitch,
			time: this.time,
			beats: this.beats
		}
	}
	
	getWithTimeOffset(time) {
		const note = new this.constructor();
		note.pitch = this.pitch;
		note.time = this.time + time;
		note.beats = this.beats;
		return note;
	}
	
	static fromSerialized(serialized) {
		const note = new this();
		note.pitch = serialized.pitch;
		note.time = serialized.time;
		note.beats = serialized.beats;
	}
}

export default Note;