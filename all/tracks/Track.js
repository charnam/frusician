import { HTML } from "imperative-html";
import Identifier from "../lib/Identifier.js";
import Clip from "../clips/Clip.js";
import ContextMenu from "../ui/contextmenu/ContextMenu.js";
import ContextMenuClickableItem from "../ui/contextmenu/ContextMenuClickableItem.js";
import Draggable from "../ui/Draggable.js";

class Track {
	static typeID = "none"; // Used for importing
	static typeName = "Default base track, do not use"; // Human-readable name
	static acceptsTypes = [];
	
	id = null;
	name = "Track";
	clips = {};
	clipPlacement = [];
	zoomLevel = 1;
	
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
			clips: Object.entries(this.clips).map(([clipid, clip]) => [clipid, clip.serialize()]),
			clipPlacement: this.clipPlacement.map(clipPosition => clipPosition.serialize())
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
			dragTarget = null;
			track.classList.add("is-dragging");
			track.style.transform = "translateY("+position.deltaY+"px)";
			const tracks = parentNode.querySelectorAll(".track");
			for(let childTrack of tracks) {
				if(childTrack == track) continue;
				childTrack.style.transform = "translateY(0)";
			}
			
			const trackEntries = Object.entries(tracks);
			const originalIndex = trackEntries.findIndex(entry => entry[1] == track);
			for(let [targetIndex, targetTrack] of trackEntries) {
				const rect = targetTrack.getBoundingClientRect();
				
				if( position.x > rect.left &&  position.y > rect.top &&
					position.x < rect.right && position.y < rect.bottom && targetTrack !== track) {
					dragTarget = targetIndex;
					for(let [movedIndex, movedChild] of trackEntries) {
						if(movedChild == track) continue;
						if(movedIndex <= originalIndex) {
							if(movedIndex >= targetIndex) {
								movedChild.style.transform = "translateY(100%)";
							}
						}
						if(movedIndex >= originalIndex) {
							if(movedIndex <= targetIndex) {
								movedChild.style.transform = "translateY(-100%)";
							}
						}
					}
					return;
				}
			}
		}, position => {
			const originalRect = track.getBoundingClientRect();
			for(let track of parentNode.querySelectorAll(".track")) {
				track.style.transform = "";
			}
			track.scrollWidth;
			if(dragTarget) {
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
		});
		trackDragHandle.onmousedown = draggableTrack.createDragEventHandler();
		
		trackInfo.appendChild(trackDragHandle);
		
		
		parentNode.appendChild(track);
		this.boundTo.push(track);
		
		this.updateRendered();
		return track;
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
		track.clips = Object.fromEntries(
			Object.entries(object.clips)
				.map(([clipid, serializedClip]) => [clipid, Clip.fromSerialized(serializedClip)])
		);
		
		return track;
	}
}


export default Track;