
// When adding new tracks, make sure to add the track both:
// - here, in the imports section, and
// - below, in the "catalog" section
// This is to ensure songs with a new track type may be properly
// saved and loaded later.
import NoteTrack from "./tracks/NoteTrack.js";
import SampleTrack from "./tracks/SampleTrack.js";
import { HTML } from "imperative-html";


class Song {
	static FILE_HEADER = "FRUSICIAN%";
	
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
	
	constructor() {
		this.sessionStartTime = Date.now();
	}
	
	save(debug = false) {
		const link = new HTML.a;
		try {
			let outputData = "";
			const serialized = this.serialize();
			if(debug) {
				outputData = Song.FILE_HEADER+JSON.stringify(serialized, null, 4);
			} else {
				outputData = Song.FILE_HEADER+JSON.stringify(serialized);
			}
			
			link.href = "data:text/plain;base64,"+btoa(outputData);
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
			trackAssortment: this.trackAssortment,
			savedAt: Date.now(),
			timeSpent: this.timeSpent
		}
	}
	
	static load() {
		return new Promise((res, rej) => {
			const fileInput = new HTML.input({type: "file", style: "display: none;"});
			fileInput.onchange = () => {
				const reader = new FileReader();
				reader.readAsText(fileInput.files[0]);
				reader.onload = () => {
					let content = reader.result;
					if(content.startsWith(Song.FILE_HEADER)) {
						content = content.replace(Song.FILE_HEADER, "");
					}
					res(Song.fromSerialized(JSON.parse(content)));
				}
				fileInput.remove();
			}
			fileInput.oncancel = () => {
				fileInput.remove();
				rej("Song load cancelled.");
			}
			document.documentElement.appendChild(fileInput);
			fileInput.click();
		});
	}
	
	static fromSerialized(serialized) {
		let song = new Song(serialized);
		song.title = serialized.title;
		
		if(typeof serialized.timeSpent == "number") {
			song.timeWorkingAtSongLoad = serialized.timeSpentA
		}
		if(Array.isArray(serialized.tracks)) {
			song.tracks = serialized.tracks.map(track => loadableTrackCatalog[track.typeID].fromSerialized(track));
		}
		song.trackAssortment = serialized.trackAssortment;
		return song;
	}
	
	render(parentNode) {
		for(let track of this.sortedTracks) {
			this.tracks[track].render(parentNode);
		}
	}
}

export default Song;