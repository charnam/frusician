
// When adding new tracks, make sure to add the track both:
// - here, in the imports section, and
// - below, in the "catalog" section
// This is to ensure songs with a new track type may be properly
// saved and loaded later.
import { HTML, SVG, applyToElement } from "imperative-html";
import ContextMenu from "./ui/contextmenu/ContextMenu.js";
import ContextMenuClickableItem from "./ui/contextmenu/ContextMenuClickableItem.js";
import Identifier from "./lib/Identifier.js";
import Track from "./tracks/Track.js";
import trackCatalog from "./tracks/trackCatalog.js";
import NoteTrack from "./tracks/NoteTrack.js";
import SampleTrack from "./tracks/SampleTrack.js";
import SongPlaybackInstance from "./playback/SongPlaybackInstance.js";


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
	durationMeasures = 16;
	beatsPerMeasure = 4;
	boundTo = [];
	_pixelsPerMeasure = 200;
	
	set pixelsPerMeasure(value) {
		this._pixelsPerMeasure = Math.min(Math.max(50, value), 500);
	}
	get pixelsPerMeasure() {
		return this._pixelsPerMeasure;
	}
	
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
		this.playbackInstance = new SongPlaybackInstance(this);
		
		new NoteTrack(this);
		new NoteTrack(this);
		new NoteTrack(this);
		new SampleTrack(this);
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
			const fileInput = new HTML.input({
				type: "file",
				style: "display: none;",
				accept: ".fru, .frudbg, application/frusician"
			});
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
		const tracks = Object.fromEntries(
			Object.values(serialized.tracks)
				.map(track => [
					track.id, trackCatalog.fromSerialized(track, song)
				])
		);
		song.tracks = tracks;
		song.durationMeasures = serialized.durationMeasures;
		song.beatsPerMeasure = serialized.beatsPerMeasure;
		song.pixelsPerMeasure = serialized.pixelsPerMeasure;
		song.trackAssortment = serialized.trackAssortment;
		return song;
	}
	
	render(targetNode) {
		this.boundTo.push(targetNode);
		
		targetNode.innerHTML = "";
		
		const timeline = new HTML.div({class: "timeline"});
		
		const timelineInternal = new HTML.div({class: "timeline-internal"});
		const timelineHeader = new HTML.div({class: "timeline-header"});
		const timelineHeaderButtons = new HTML.div({class: "timeline-header-buttons"});
		
		const timelineHeaderPlayButton = new HTML.div({class: "timeline-header-button timeline-header-button-play"});
		timelineHeaderButtons.appendChild(timelineHeaderPlayButton);
		
		const timelineHeaderPauseButton = new HTML.div({class: "timeline-header-button timeline-header-button-pause"});
		timelineHeaderButtons.appendChild(timelineHeaderPauseButton);
		
		timelineHeader.appendChild(timelineHeaderButtons);
		const timelineHeaderTicks = new SVG.svg({class: "timeline-header-ticks"});
		timelineHeader.appendChild(timelineHeaderTicks);
		timelineInternal.appendChild(timelineHeader);
		
		const tracks = new HTML.div({class: "tracks"});
		timelineInternal.appendChild(tracks);
		
		const userTracks = new HTML.div({class: "user-tracks"});
		tracks.appendChild(userTracks);
		
		
		timeline.addEventListener("wheel", event => {
			if((event.ctrlKey || event.target == timelineHeaderTicks) && !event.shiftKey) {
				event.preventDefault();
				const songTimelineRect = timelineHeaderTicks.getBoundingClientRect();
				const infoWidth = timelineHeaderButtons.getBoundingClientRect().width;
				const mouseTimeX = ((event.clientX - songTimelineRect.left) / songTimelineRect.width);
				
				this.pixelsPerMeasure /= 1 + Math.min(40, Math.max(event.deltaY, -40)) / 200;
				this.updateRendered();
				const newSongTimelineWidth = timelineHeaderTicks.getBoundingClientRect().width;
				
				timeline.scrollLeft = mouseTimeX * newSongTimelineWidth + infoWidth - event.clientX;
			}
		}, {passive: false})
		if(this.editable) {
			const track_add = new HTML.div({class: "track track-add"});
			track_add.onmousedown = () => {
				this.addTrackMenu.open();
			}
			tracks.appendChild(track_add);
		}
		
		timeline.appendChild(timelineInternal);
		targetNode.appendChild(timeline);
		
		this.updateRendered();
	}
	
	updateRendered() {
		for(let target of this.boundTo) {
			target.setAttribute("style", `--pixelsPerMeasure: ${this.pixelsPerMeasure}px; --beatsPerMeasure: ${this.beatsPerMeasure};`);
			const timelineHeader = target.querySelector(".timeline-header");
			
			
			const timelineHeaderTicks = timelineHeader.querySelector(".timeline-header-ticks");
			const serializedSongInfo = `${this.pixelsPerMeasure}-${this.beatsPerMeasure}-${this.durationMeasures}`;
			if(timelineHeaderTicks.getAttribute("serialized-song-info") !== serializedSongInfo) {
				timelineHeaderTicks.setAttribute("serialized-song-info", serializedSongInfo);
				
				timelineHeaderTicks.innerHTML = "";
				applyToElement(timelineHeaderTicks, {
					width: this.durationMeasures * this.pixelsPerMeasure,
					height: 32,
					viewBox: "0 0 "+this.durationMeasures*this.pixelsPerMeasure+" 32"
				});
				
				for(let i = 0; i < this.durationMeasures; i++) {
					let bigTickX = this.pixelsPerMeasure * i;
					const bigTick = SVG.rect({
						class: "big-tick",
						x: bigTickX,
						y: 0,
						width: 2,
						height: 24
					});
					timelineHeaderTicks.appendChild(bigTick);
					for(let j = 1; j < this.beatsPerMeasure; j++) {
						const littleTick = SVG.rect({
							class: "little-tick",
							x: bigTickX + (this.pixelsPerMeasure / this.beatsPerMeasure) * j,
							y: 0,
							width: 2,
							height: 15
						})
						timelineHeaderTicks.appendChild(littleTick);
					}
				}
				for(let i = 0; i < this.durationMeasures; i++) {
					let bigTickX = this.pixelsPerMeasure * i;
					const beatText = SVG.text({
						class: "beat-number",
						x: bigTickX + 5,
						y: 18,
						fill: "currentColor"
					}, i + 1);
					timelineHeaderTicks.appendChild(beatText);
				}
			}
			
			
			
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