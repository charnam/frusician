import Track from "./Track.js";
import Clip from "../clips/Clip.js";
import { HTML } from "imperative-html";

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
		track.appendChild(
			new HTML.div({class: "clip-placements"})
		);
		this.updateRendered();
		return track;
	}
	
	updateRendered() {
		super.updateRendered();
		
		if(this.clipPlacement) {
			for(let target of this.boundTo) {
				const clips = target.querySelector(".clip-placements");
				if(!clips) continue;
				
				for(let placementEl of clips.querySelectorAll(".clip-placement")) {
					if(!this.clipPlacement.some(placement => placement.id == placementEl.getAttribute("placementid"))) {
						placementEl.remove();
					}
				}
				
				for(let placement of this.clipPlacement) {
					if(!clips.querySelector(`.clip-placement[placementid="${placement.id}"]`)) {
						placement.render(clips);
					}
				}
			}
			
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