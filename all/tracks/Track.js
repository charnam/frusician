import { HTML } from "imperative-html";




class Track {
	static serializedID = null;
	static typeName = "Default base track, do not use";
	
	clips = {};
	clipPlacement = [];
	
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
		this.boundTo = track;
		
		// Clear the parent
		parentNode.textContent = "";
		parentNode.appendChild(track);
	}
	
}

export default Track;