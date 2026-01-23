import { HTML } from "imperative-html";

class Track {
	static typeID = "none"; // Used for importing
	static typeName = "Default base track, do not use"; // Human-readable name
	static acceptsTypes = [];
	
	clips = {};
	clipPlacement = [];
	
	boundTo = [];
	
	constructor(song, clips) {
		this.song = song;
		this.clips = Object.fromEntries(
			Object.entries(clips)
				.filter(([id, clipData]) => {
					return true // TODO: validation
				})
				.map(([id, clipData]) => {
					
				})
		); // TODO: validation
	}
	
	serialize() {
		return {
			typeID: this.constructor.typeID,
			clips: this.clips.map(clip => clip.serialize())
		}
	}
	
	render(parentNode) {
		const track = HTML.div({class: "track"});
		this.boundTo.push(track);
		
		parentNode.appendChild(track);
	}
	
	static fromSerialized(object, song) {
		
	}
}

export default Track;