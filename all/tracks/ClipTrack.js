import Track from "./Track.js";
import { HTML } from "imperative-html";
import clipCatalog from "../clips/clipCatalog.js";

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
			clips: Object.fromEntries(Object.entries(this.clips).map(([clipid, clip]) => [clipid, clip.serialize()])),
			clipPlacement: this.clipPlacement.map(placement => placement.serialize())
		}
	}
	
	static fromSerialized(serialized, song) {
		const track = super.fromSerialized(serialized, song);
		
		track.clips = Object.fromEntries(
			Object.entries(serialized.clips)
				.map(([clipid, serializedClip]) => [clipid, clipCatalog.fromSerialized(serializedClip, track)])
		);
		
		for(let [clipid, clip] of Object.entries(track.clips)) {
			clip.id = clipid;
		}
		
		for(let serializedPlacement of serialized.clipPlacement) {
			const clip = track.clips[serializedPlacement.clipID];
			if(!clip) {
				throw new Error("Clip of placement is not identified");
			}
			
			const placement = clip.constructor.Placement.fromSerialized(serializedPlacement, track);
			track.clipPlacement.push(placement);
		}
		
		return track;
	}
}

export default ClipTrack;