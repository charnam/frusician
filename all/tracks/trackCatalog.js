
import TypeCatalog from "../lib/TypeCatalog.js";

import NoteTrack from "./NoteTrack.js";
import SampleTrack from "./SampleTrack.js";

const trackCatalog = new TypeCatalog([
	NoteTrack,
	SampleTrack
]);

export default trackCatalog;