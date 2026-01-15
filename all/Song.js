
// When adding new tracks, make sure to add the track both:
// - here, in the imports section, and
// - below, in the "catalog" section
// This is to ensure songs with a new track type may be properly
// saved and loaded later.
import Track from "./tracks/Track.js";
import NoteTrack from "./tracks/NoteTrack.js";
import SampleTrack from "./tracks/SampleTrack.js";

const loadableTrackCatalog = {};
for(let Track of [
	NoteTrack,
	SampleTrack,
]) {
	loadableTrackCatalog[Track.typeID] = Track;
}

class Song {
	title = "";
	tracks = [];
	trackAssortment = [];
	sessionStartTime = null;
	timeWorkingAtSongLoad = 0;
	
	get sortedTracks() {
		return Object.entries(this.tracks)
			.sort((a, b) => this.trackAssortment.indexOf(a[0]) - this.trackAssortment.indexOf(b[0]))
			.map(entry => entry[1]);
	}
	
	get timeSpent() {
		return Date.now() - this.sessionStartTime + this.timeWorkingAtSongLoad
	}
	
	constructor(base) {
		this.sessionStartTime = Date.now();
		
		if(base) {
			this.title = base.title;
			if(typeof base.timeSpent == "number") {
				this.timeWorkingAtSongLoad = base.timeSpentA
			}
			if(Array.isArray(base.tracks)) {
				this.tracks = base.tracks;
			}
			this.trackAssortment = base.trackAssortment;
		}
	}
	
	toSavedCopy() {
		return {
			title: this.title,
			tracks: this.tracks,
			savedAt: Date.now(),
			timeSpent: this.timeSpent
		}
	}
	
	renderTracks() {
		for(let track of this.sortedTracks) {
			track.renderTrackInList();
		}
		
	}
}

export default Song;