import Track from "./Track.js";
import Clip from "../clips/Clip.js";

class ClipTrack extends Track {
	clips = {};
	clipPlacement = [];
	
	addClip(clip) {
		this.clips[clip.id] = clip;
		this.updateRendered();
	}
	
	addClipPlacement(placement) {
		this.clipPlacement.push(placement);
		this.updateRendered();
	}
	
	render(parentNode) {
		const track = super.render(parentNode);
		for(let clip of this.clipPlacement) {
			clip.render()
		}
		
		return track;
	}
	
	updateRendered() {
		super.updateRendered();
		
		if(this.clipPlacement) {
			for(let placement of this.clipPlacement) {
				placement.updateRendered();
			}
		}
	}
	
	serialize() {
		return {
			...super.serialize(),
			clips: Object.entries(this.clips).map(([clipid, clip]) => [clipid, clip.serialize()]),
			clipPlacement: this.clipPlacement.map(clipPosition => clipPosition.serialize())
		}
	}
	
	static fromSerialized(serialized) {
		const track = super.fromSerialized(serialized);
		
		track.clips = Object.fromEntries(
			Object.entries(object.clips)
				.map(([clipid, serializedClip]) => [clipid, Clip.fromSerialized(serializedClip)])
		);
		
		return track;
	}
}

export default ClipTrack;