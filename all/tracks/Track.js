import { HTML } from "imperative-html";
import Identifier from "../lib/Identifier.js";
import ContextMenu from "../ui/contextmenu/ContextMenu.js";
import ContextMenuClickableItem from "../ui/contextmenu/ContextMenuClickableItem.js";
import Draggable from "../ui/Draggable.js";
import TrackPlaybackInstance from "../playback/TrackPlaybackInstance.js";

class Track {
	static typeID = "none"; // Used for importing
	static typeName = "Default base track, do not use"; // Human-readable name
	static acceptsClipTypes = [];
	
	id = null;
	name = "Track";
	zoomLevel = 1;
	
	playbackInstance = new TrackPlaybackInstance(this);
	
	_DOMPlayer = null;
	get DOMPlayer() {
		if(!this._DOMPlayer) {
			this._DOMPlayer = this.playbackInstance.createDOMPlayer();
		}
		return this._DOMPlayer;
	}
	
	muted = false;
	
	boundTo = [];
	
	contextMenu = null;
	
	constructor(song) {
		this.song = song;
		this.id = Identifier.create();
		let iter = 0;
		while(this.name == "Track" || Object.values(song.tracks).some(track => track.name == this.name)) {
			iter++;
			this.name = this.constructor.typeName+" "+iter;
		}
		this.contextMenu = new ContextMenu([
			new ContextMenuClickableItem("Delete Track", () => {
				this.song.removeTrack(this.id);
			})
		])
		song.addTrack(this);
	}
	
	serialize() {
		return {
			typeID: this.constructor.typeID,
			name: this.name,
			id: this.id,
		}
	}
	
	render(parentNode) {
		const track = HTML.div({class: "track", trackid: this.id});
		
		const trackInfo = HTML.div({class: "track-info"});
		trackInfo.oncontextmenu = ContextMenu.eventOpener(this.contextMenu);
		track.appendChild(trackInfo);
		
		const trackType = new HTML.div({class: "track-type"}, this.constructor.typeName);
		trackInfo.appendChild(trackType);
		
		const trackName = new HTML.input({class: "track-name", type: "text"});
		trackName.value = this.name;
		trackName.oninput = () => this.name = trackName.value;
		trackName.onkeydown = event => {
			if(event.key == "Enter") {
				trackName.blur();
			}
		}
		if(this.song && !this.song.editable) {
			trackName.disabled = true;
		}
		trackInfo.appendChild(trackName);
		
		const trackDragHandle = new HTML.div({class: "track-handle"});
		
		let dragTarget = null;
		const draggableTrack = new Draggable(position => {
			track.classList.add("is-dragging");
			track.style.transform = "translateY("+position.deltaY+"px)";
			
			const trackRect = track.getBoundingClientRect();
			const trackHeight = trackRect.height;
			const trackYOffset = position.y - trackRect.y
			const trackIndex = this.song.trackAssortment.indexOf(this.id);
			const tracks = this.song.trackAssortment.map(id => this.song.tracks[id]);
			const targetIndex = trackIndex + Math.floor((position.deltaY + trackYOffset) / trackHeight);
			
			if(tracks[targetIndex]) {
				const trackEntries = Object.entries(track.parentElement.querySelectorAll(".track"));
				dragTarget = targetIndex;
				for(let [movedIndex, movedChild] of trackEntries) {
					if(movedChild == track) continue;
					if(movedIndex <= trackIndex && movedIndex >= targetIndex) {
						movedChild.style.transform = "translateY(100%)";
					} else if(movedIndex >= trackIndex && movedIndex <= targetIndex) {
						movedChild.style.transform = "translateY(-100%)";
					} else {
						movedChild.style.transform = "translateY(0)";
					}
				}
				return;
			}
		}, position => {
			const originalRect = track.getBoundingClientRect();
			for(let track of parentNode.querySelectorAll(".track")) {
				track.style.transition = "unset";
				track.scrollWidth;
				track.style.transform = "";
				track.scrollWidth;
				track.style.transition = "";
			}
			track.scrollWidth;
			if(dragTarget !== null) {
				const oldIndex = this.song.trackAssortment.indexOf(this.id);
				this.song.trackAssortment.splice(oldIndex, 1);
				this.song.trackAssortment.splice(dragTarget, 0, this.id);
				this.song.updateRendered();
			}
			const rect = track.getBoundingClientRect();
			track.style.transform = "translateY("+(originalRect.y - rect.y)+"px)";
			track.scrollWidth;
			track.classList.remove("is-dragging");
			track.scrollWidth;
			track.style.transform = "";
			dragTarget = null;
		});
		trackDragHandle.onmousedown = draggableTrack.createDragEventHandler();
		
		trackInfo.appendChild(trackDragHandle);
		
		parentNode.appendChild(track);
		this.boundTo.push(track);
		
		this.updateRendered();
		return track;
	}
	
	getSampleRange(startTime, sampleCount, secondsPerSample, channel) {
		return 0;
	}
	
	updateRendered() {
		for(let target of this.boundTo) {
			if(this.muted) {
				target.classList.add("muted");
			} else {
				if(this.song && this.song.solo) {
					if(this.song.solo == this.id) {
						target.classList.add("solo");
					} else {
						target.classList.add("muted");
					}
				}
			}
		}
	}
	
	static fromSerialized(object, song) {
		const track = new this(song);
		
		track.id = object.id;
		track.name = object.name;
		
		return track;
	}
}


export default Track;