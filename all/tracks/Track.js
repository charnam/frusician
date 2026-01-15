import { HTML } from "imperative-html";

class Track {
	static typeID = null;
	
	clips = [];
	constructor(song, clips) {
		this.song = song;
		
		if(Array.isArray(clips)) {
			clips = clips.filter(clip => clip instanceof Clip);
			this.clips = clips;
		}
	}
	
	renderTrackInList(parentNode) {
		// Clear the parent
		parentNode.textContent = "";
		
		const track = HTML.div({class: "track"});
		
		this.renderTrackAttributes(track);
		this.renderTrackClips(track);
		parentNode.appendChild(track);
	}
	
	renderTrackAttributes(parentNode) {
		
		
		
	}
	
	renderTrackClips(parentNode) {
		
	}
	
}

export default Track;