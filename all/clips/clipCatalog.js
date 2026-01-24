
import TypeCatalog from "../lib/TypeCatalog.js";

import NoteClip from "./NoteClip.js";
import SampleClip from "./SampleClip.js";

const clipCatalog = new TypeCatalog([
	NoteClip,
	SampleClip
]);

export default clipCatalog;