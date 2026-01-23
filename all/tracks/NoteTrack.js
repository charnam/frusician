import Track from "./Track.js";

class NoteTrack extends Track {
	static typeID = "noteTrack";
	static typeName = "Note Track";
	
	render(parentNode) {
		const track = super.render(parentNode);
		
		return track;
	}
}

export default NoteTrack;