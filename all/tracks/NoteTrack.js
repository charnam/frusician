import Track from "./Track.js";

class NoteTrack extends Track {
	static typeID = "noteTrack";
	static typeName = "Note Track";
	
	render(parentNode) {
		const track = super.render(parentNode);
		
		track.classList.add("note-track");
		
		return track;
	}
}

export default NoteTrack;