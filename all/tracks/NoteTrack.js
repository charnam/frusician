import ClipPlacement from "../clips/ClipPlacement.js";
import NoteClip from "../clips/NoteClip.js";
import ClipTrack from "./ClipTrack.js";

class NoteTrack extends ClipTrack {
	static typeID = "noteTrack";
	static typeName = "Note Track";
	static acceptsClipTypes = [NoteClip];
	
	render(parentNode) {
		const track = super.render(parentNode);
		track.classList.add("note-track");
		
		const clipPlacements = track.querySelector(".clip-placements");
		
		clipPlacements.addEventListener("dblclick", event => {
			if(event.target == clipPlacements) {
				const clip = new NoteClip(this);
				const clipPlacement = new ClipPlacement(clip);
				clipPlacement.duration = 1;
				
				const clipPlacementsRect = clipPlacements.getBoundingClientRect();
				clipPlacement.time = Math.floor(((event.clientX - clipPlacementsRect.left) / clipPlacementsRect.width) * this.song.durationMeasures);
				
				this.addClip(clip);
				this.addClipPlacement(clipPlacement);
			}
		});
		
		return track;
	}
	
}

export default NoteTrack;