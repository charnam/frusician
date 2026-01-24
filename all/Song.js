
// When adding new tracks, make sure to add the track both:
// - here, in the imports section, and
// - below, in the "catalog" section
// This is to ensure songs with a new track type may be properly
// saved and loaded later.
import { HTML } from "imperative-html";
import ContextMenu from "./ui/contextmenu/ContextMenu.js";
import ContextMenuClickableItem from "./ui/contextmenu/ContextMenuClickableItem.js";
import Identifier from "./lib/Identifier.js";
import Track from "./tracks/Track.js";
import trackCatalog from "./tracks/trackCatalog.js";


class Song {
	static FILE_HEADER = "FRUSICIAN%";
	
	id = null;
	title = "Untitled Song";
	editable = true;
	tracks = {};
	trackAssortment = [];
	sessionStartTime = null;
	timeWorkingAtSongLoad = 0;
	
	tempo = 120;
	beatsPerMeasure = 4;
	boundTo = [];
	pixelsPerMeasure = 100;
	
	addTrackMenu = new ContextMenu(
		trackCatalog.all.map(trackType =>
			new ContextMenuClickableItem(trackType.typeName, () => {
				this.addTrack(new trackType(this));
			})
		)
	);
	
	addTrack(track) {
		if(this.tracks[track.id] !== track) {
			this.tracks[track.id] = track;
		}
		if(!this.trackAssortment.includes(track.id)) {
			this.trackAssortment.push(track.id);
		}
		this.updateRendered();
	}
	
	removeTrack(trackid) {
		delete this.tracks[trackid];
		this.trackAssortment = this.trackAssortment.filter(assortedid => assortedid !== trackid);
		this.updateRendered();
	}
	
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
		this.id = Identifier.create();
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
			console.error("Save error:", err);
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
			trackAssortment: this.trackAssortment.slice(),
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
					try {
						res(Song.fromFile(content));
					} catch(err) {
						alert("This is not a valid or loadable song file.");
						rej("Invalid or unloadable song file uploaded");
					}
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
	
	static fromFile(content) {
		
		if(content.startsWith(Song.FILE_HEADER)) {
			content = content.replace(Song.FILE_HEADER, "");
		}
		let songData;
		try {
			songData = JSON.parse(content);
		} catch(err) {
			throw new Error("Invalid song file.");
		}
		
		try {
			return Song.fromSerialized(songData);
		} catch(err) {
			console.error(err);
			throw new Error("Failed to load song: ", err);
		}
	}
	
	static fromSerialized(serialized) {
		let song = new Song();
		song.title = serialized.title;
		
		if(typeof serialized.timeSpent == "number") {
			song.timeWorkingAtSongLoad = serialized.timeSpent;
		}
		song.tracks = Object.fromEntries(
			Object.values(serialized.tracks)
				.map(track => [
					track.id, trackCatalog.byTypeID[track.typeID].fromSerialized(track, this)
				])
		);
		song.trackAssortment = serialized.trackAssortment;
		return song;
	}
	
	render(targetNode) {
		this.boundTo.push(targetNode);
		
		targetNode.innerHTML = "";
		
		const tracks = new HTML.div({class: "tracks"});
		const userTracks = new HTML.div({class: "user-tracks"});
		
		tracks.appendChild(userTracks);
		
		if(this.editable) {
			const track_add = new HTML.div({class: "track track-add"});
			track_add.onmousedown = () => {
				this.addTrackMenu.open();
			}
			tracks.appendChild(track_add);
		}
		
		targetNode.appendChild(tracks);
		
		this.updateRendered();
	}
	
	updateRendered() {
		for(let target of this.boundTo) {
			target.setAttribute("style", `--pixelsPerMeasure: ${this.pixelsPerMeasure}px; --beatsPerMeasure: ${this.beatsPerMeasure};`);
			const playheadBar = target.querySelector(".playhead-bar");
			if(playheadBar)
			playheadBar.innerHTML = "";
			playheadBar
			
			const renderedTracksEl = target.querySelector(".user-tracks");
			for(let index = 0; index < this.trackAssortment.length; index++) {
				const trackid = this.trackAssortment[index];
				let track = renderedTracksEl.querySelector(`[trackid="${trackid}"]`);
				if(track == null) {
					track = this.tracks[trackid].render(renderedTracksEl);
				}
				
				const renderedTracksArray = [...renderedTracksEl.children];
				const currentDOMPosition = renderedTracksArray.indexOf(track);
				if(currentDOMPosition != index) {
					let elAfterTrack = renderedTracksEl.children[index];
					if(elAfterTrack) {
						renderedTracksEl.insertBefore(track, elAfterTrack);
					} else {
						renderedTracksEl.appendChild(track);
					}
					
					index--;
				}
			}
			
			for(let track of renderedTracksEl.children) {
				if(!this.tracks[track.getAttribute("trackid")]) {
					track.remove();
				}
			}
		}
		
		for(let track of Object.values(this.tracks)) {
			track.updateRendered();
		}
	}
	
}

export default Song;