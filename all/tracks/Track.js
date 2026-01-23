import { HTML } from "imperative-html";
import Identifier from "../lib/Identifier.js";

class Track {
	static typeID = "none"; // Used for importing
	static typeName = "Default base track, do not use"; // Human-readable name
	static acceptsTypes = [];
	
	id = null;
	clips = {};
	clipPlacement = [];
	
	boundTo = [];
	
	constructor(song) {
		this.song = song;
		this.id = Identifier.create();
	}
	
	serialize() {
		return {
			typeID: this.constructor.typeID,
			clips: this.clips.map(clip => clip.serialize())
		}
	}
	
	render(parentNode) {
		const track = HTML.div({class: "track"});
		track.setAttribute("trackid", this.id);
		this.boundTo.push(track);
		parentNode.appendChild(track);
		
		return track;
	}
	
	update() {
		for(let target of this.boundTo) {
			
		}
	}
	
	static fromSerialized(object, song) {
		
	}
}

export default Track;