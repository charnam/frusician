import Track from "./Track.js";

class NoteTrack extends Track {
	static typeID = "noteTrack";
	static typeName = "Note Track";
	
	render(parentNode) {
		const track = super.render(parentNode);
		track.classList.add("note-track");
		
		track.addEventListener("dblclick", event => {
			if(event.target == track) {
				this.clips
			}
		});
		
		return track;
	}
	
	updateRendered() {
		/*for(let clip)
		for(let clip of this.clips) {
		}*/
	}
}

export default NoteTrack;