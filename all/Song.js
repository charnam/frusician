
// When adding new tracks, make sure to add the track both:
// - here, in the imports section, and
// - below, in the "catalog" section
// This is to ensure songs with a new track type may be properly
// saved and loaded later.
import NoteTrack from "./tracks/NoteTrack.js";
import SampleTrack from "./tracks/SampleTrack.js";
import { HTML } from "imperative-html";

const loadableTrackCatalog = {};
for(let track of [
	NoteTrack,
	SampleTrack,
]) {
	loadableTrackCatalog[track.serializedID] = track;
}

class Song {
	title = "Untitled Song";
	tracks = {};
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
	
	constructor(serialized = null) {
		this.sessionStartTime = Date.now();
		
		if(serialized) {
			this.title = serialized.title;
			if(typeof serialized.timeSpent == "number") {
				this.timeWorkingAtSongLoad = base.timeSpentA
			}
			if(Array.isArray(serialized.tracks)) {
				this.tracks = serialized.tracks;
			}
			this.trackAssortment = serialized.trackAssortment;
		}
	}
	
	save() {
		const link = new HTML.a;
		try {
			link.href = "data:text/plain;base64,"+btoa(this.serialize());
		} catch(err) {
			return alert("Sorry, seems like an error occurred during saving. Make sure you don't have any special symbols (e.g: no Japanese, accented, or other odd characters) in any of your project's text inputs (e.g track names, song name, editor inputs). This slight saving issue will be fixed in a future version.");
		}
		link.download = this.title.replace(/[^0-9a-zA-Z\- ]/g, "_")+".fru";
		document.body.appendChild(link);
		link.click();
		link.remove();
	}
	
	serialize() {
		return {
			title: this.title,
			tracks: Object.fromEntries(
				Object.entries(this.tracks)
					.map(([id, track]) => [id, track.serialize()])
			),
			savedAt: Date.now(),
			timeSpent: this.timeSpent
		}
	}
	
	renderEditor(parentNode) {
		for(let track of this.sortedTracks) {
			this.tracks[track].bindRenderTo(parentNode);
		}
	}
}

export default Song;