import { HTML } from "imperative-html";

class Clip {
	static typeID = null;
	
	length = null;
	maxLength = null;
	
	constructor(track) {
		this.track = track;
	}
	
	render(parentNode) {
		const clip = new HTML.div({class: "clip"});
		parentNode.appendChild(clip);
		return clip;
	}
	
	serialize() {
		return {
			typeID: this.constructor.typeID
		}
	}
	static fromSerialized(track, serializedData) {
		const clip = new Clip(track);
		return clip;
	}
}

export default Clip;