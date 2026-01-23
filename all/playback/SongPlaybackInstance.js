import PlaybackInstance from "./PlaybackInstance.js";

class SongPlaybackInstance extends PlaybackInstance {
	constructor(song) {
		this.song = song;
	}
	
	getSampleAt(time) {
		this.song.getSampleAt(time);
	}
}

export default SongPlaybackInstance;