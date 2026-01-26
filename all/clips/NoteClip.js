import Clip from "./Clip.js";
import ClipPlacement from "./ClipPlacement.js";

class NoteClipPlacement extends ClipPlacement {
	
}

class NoteClip extends Clip {
	static typeID = "noteClip"
	static Placement = NoteClipPlacement;
}

export default NoteClip;