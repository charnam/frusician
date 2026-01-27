import PlaybackInstance from "./PlaybackInstance.js";

class SongPlaybackInstance extends PlaybackInstance {
	constructor(song) {
		super();
		this.song = song;
	}
	
	getSampleAt(time, channel) {
		let output = 0;
		for(let track of Object.values(this.song.tracks)) {
			output += track.playbackInstance.getSampleAt(time, channel);
		}
		return output;
	}
}

export default SongPlaybackInstance;