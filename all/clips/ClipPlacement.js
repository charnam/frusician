import { HTML } from "imperative-html";
import Identifier from "../lib/Identifier.js";
import Draggable from "../ui/Draggable.js";

class ClipPlacement {
	
	clip = null;
	time = 0;
	duration = 0;
	loopCount = 0;
	
	boundTo = [];
	
	constructor(clip) {
		this.id = Identifier.create();
		this.clip = clip;
	}
	
	render(parentNode) {
		let clipPlacement,
			clipPlacementHeader,
			clipPlacementHeaderName,
			clipPlacementExtendPanel,
			clipPlacementExtendDuration,
			clipPlacementExtendLoop;
		
		
		
		clipPlacement = new HTML.div({class: "clip-placement", placementid: this.id},
			clipPlacementHeader = new HTML.div({class: "clip-placement-header"},
				clipPlacementHeaderName = new HTML.span({class: "clip-placement-header-name"})
			),
			clipPlacementExtendPanel = new HTML.div({class: "clip-placement-extend-panel"},
				clipPlacementExtendDuration = new HTML.div({class: "clip-placement-extend-duration"}),
				clipPlacementExtendLoop = new HTML.div({class: "clip-placement-extend-loop"})
			)
		);
		
		const dragTrack = new Draggable(position => {
			const roundBy = this.clip.track.song.pixelsPerMeasure / this.clip.track.song.beatsPerMeasure;
			clipPlacement.classList.add("is-dragging");
			clipPlacement.style.transform = `translateX(${(Math.round(position.deltaX / roundBy) * roundBy)}px)`;
		}, position => {
			const roundBy = this.clip.track.song.pixelsPerMeasure / this.clip.track.song.beatsPerMeasure;
			clipPlacement.classList.remove("is-dragging");
			const rounded = (Math.round(position.deltaX / roundBy) * roundBy);
			this.time += rounded / this.clip.track.song.pixelsPerMeasure;
			this.updateRendered();
		});
		clipPlacementHeader.onmousedown = dragTrack.createDragEventHandler();
		
		parentNode.appendChild(clipPlacement);
		this.boundTo.push(clipPlacement);
		this.updateRendered();
		return clipPlacement;
	}
	
	updateRendered() {
		for(let target of this.boundTo) {
			target.querySelector(".clip-placement-header-name").innerText = this.clip.name;
			target.setAttribute("style", `
				--clip-hue: ${[...this.clip.id].reduce((a, b) => a + b.charCodeAt(0), 0) % 360}deg;
				--time: ${this.time};
				--duration: ${this.duration};
				--loopCount: ${this.loopCount};
				--totalDuration: ${this.duration * this.loopCount};
			`.replace(/[\s\n]+/g, " "))
		}
	}
	
	serialize() {
		return {
			clipID: this.clip.id,
			placementID: this.id,
			time: this.time,
			duration: this.duration,
			loopCount: this.loopCount
		}
	}
	static fromSerialized(track, serialized) {
		const placement = new ClipPlacement(track.clips[serialized.clipID]);
		
		placement.id = serialized.id;
		placement.time = serialized.time;
		placement.duration = serialized.duration;
		placement.loopCount = serialized.loopCount;
		
		return placement;
	}
}

export default ClipPlacement;