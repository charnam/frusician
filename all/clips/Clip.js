import { HTML } from "imperative-html";
import Identifier from "../lib/Identifier.js";

class Clip {
	static typeID = null;
	static typeName = "Default clip, do not use";
	
	id = null;
	name = "Clip"
	track = null;
	
	get canLoop() {
		return true;
	}
	get canModifyDuration() {
		return true;
	}
	get maxDuration() {
		return 2;
	}
	
	constructor(track) {
		this.id = Identifier.create();
		this.track = track;
		let name = null
		let iter = 0;
		while(name == null || Object.values(this.track.clips).some(clip => clip.name == name)) {
			iter++;
			name = "Clip "+iter;
		}
		return name;
	}
	
	serialize() {
		return {
			typeID: this.constructor.typeID,
			loopCount: this.loopCount,
			name: this.name
		}
	}
	static fromSerialized(track, serializedData) {
		const clip = new Clip(track);
		return clip;
	}
}

export default Clip;