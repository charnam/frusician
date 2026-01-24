import { HTML } from "imperative-html";
import Identifier from "../lib/Identifier.js";
import Clip from "../clips/Clip.js";
import ContextMenu from "../ui/contextmenu/ContextMenu.js";
import ContextMenuClickableItem from "../ui/contextmenu/ContextMenuClickableItem.js";

class Track {
	static typeID = "none"; // Used for importing
	static typeName = "Default base track, do not use"; // Human-readable name
	static acceptsTypes = [];
	
	id = null;
	name = "Track";
	clips = {};
	clipPlacement = [];
	zoomLevel = 1;
	
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
		track.appendChild(trackInfo);
		
		trackInfo.oncontextmenu = ContextMenu.eventOpener(this.contextMenu);
		
		const trackType = new HTML.div({class: "track-type"}, this.constructor.typeName);
		trackInfo.appendChild(trackType);
		
		const trackName = new HTML.input({class: "track-name", type: "text"});
		trackName.value = this.name;
		trackInfo.appendChild(trackName);
		
		if(this.song && !this.song.editable) {
			trackName.disabled = true;
		}
		
		parentNode.appendChild(track);
		this.boundTo.push(track);
		
		this.updateRendered();
		return track;
	}
	
	updateRendered() {
	}
	
	static fromSerialized(object, song) {
		const track = new this.constructor(song);
		
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