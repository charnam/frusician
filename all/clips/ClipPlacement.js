import { HTML } from "imperative-html";

class ClipPlacement {
	clip = null;
	time = 0;
	duration = 0;
	loopCount = 0;
	
	boundTo = [];
	
	constructor(clip) {
		this.clip = clip;
	}
	
	render(parentNode) {
		let clipPlacement,
			clipPlacementHeader;
		
		clipPlacement = new HTML.div({class: "clip-placement"},
			clipPlacementHeader = new HTML.div({class: "clip-placement-header"},
				new HTML.span({class: "clip-placement-header-name"})
			)
		);
		
		parentNode.appendChild(clipPlacement)
		this.boundTo.push(clipPlacement);
		this.updateRendered();
		return clipPlacement;
	}
	
	updateRendered() {
		for(let target of this.boundTo) {
			target.querySelector(".clip-placement-header-name").innerText = this.name;
		}
	}
	
	serialize() {
		return {
			clipID: this.clip.id,
			time: this.time,
			duration: this.duration,
			loopCount: this.loopCount
		}
	}
	static fromSerialized(track, serialized) {
		const placement = new ClipPlacement(track.clips[serialized.clipID]);
		
		placement.time = serialized.time;
		placement.duration = serialized.duration;
		placement.loopCount = serialized.loopCount;
		
		return placement;
	}
}

export default ClipPlacement;