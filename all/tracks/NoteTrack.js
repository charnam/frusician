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
		
		track.addEventListener("dblclick", event => {
			if(event.target == track) {
				const clip = new NoteClip(this);
				const clipPlacement = new ClipPlacement(clip);
				this.addClip(clip);
				this.addClipPlacement(clipPlacement);
			}
		});
		
		return track;
	}
	
}

export default NoteTrack;