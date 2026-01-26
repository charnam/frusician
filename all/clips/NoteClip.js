import { HTML } from "imperative-html";
import Clip from "./Clip.js";

class NoteClip extends Clip {
	static typeID = "noteClip"
	static Placement = class NoteClipPlacement extends Clip.Placement {
		render(parentNode) {
			const clipPlacement = super.render(parentNode);
			
			clipPlacement.appendChild(new HTML.canvas({width: 1, height: 1}));
			
			return clipPlacement;
		}
		
		updateRendered() {
			super.updateRendered();
			for(let target of this.boundTo) {
				const canvas = target.querySelector("canvas");
				if(canvas) {
					const context = canvas.getContext("2d");
				}
			}
		}
	}
	notes = [];
}

export default NoteClip;