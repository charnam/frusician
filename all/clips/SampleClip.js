import { applyToElement, HTML, SVG } from "imperative-html";
import Clip from "./Clip.js";
import BoxAnimation from "../ui/BoxAnimation.js";
import Note from "./NoteTrack/Note.js";
import Math2 from "../lib/Math2.js";
import Draggable from "../ui/Draggable.js";
import NoteTrack from "../tracks/NoteTrack.js";

class SampleClip extends Clip {
	static typeID = "sampleClip"
	static Placement = class SampleClipPlacement extends Clip.Placement {
		render(parentNode) {
			const clipPlacement = super.render(parentNode);
			clipPlacement.classList.add("sample-clip-placement");
			
			return clipPlacement;
		}
		
		updateRendered() {
			super.updateRendered();
			for(let target of this.boundTo) {
			}
		}
	}
	
	audio = {
		sampleRate: 8000,
		channels: []
	};
	
	renderClipEditor(parentNode, fromPlacement) {
	}
	
	serialize() {
		const serialized = super.serialize();
		serialized.audio = this.audio;
		return serialized;
	}
	
	static fromSerialized(serialized, track) {
		const clip = super.fromSerialized(serialized, track);
		clip.audio = serialized.audio;
		return clip;
	}
	
	static upload(track) {
		return new Promise((res, err) => {
			const ac = new AudioContext();
			const upload = new HTML.input({type: "file"});
			
			const checkFile = async () => {
				const buffer = await upload.files[0].arrayBuffer();
				const audioBuffer = await ac.decodeAudioData(buffer);
				
				const channels = [];
				for(let i = 0; i < audioBuffer.numberOfChannels; i++) {
					channels[i] = audioBuffer.getChannelData(i);
				}
				
				const clip = new this(track);
				
				clip.audio = {
					channels,
					sampleRate: audioBuffer.sampleRate
				};
				
				upload.remove();
				ac.close();
			}
			
			upload.addEventListener("input", checkFile);
			upload.addEventListener("cancel", () => {
				upload.remove()
				ac.close();
				err();
			});
			
		});
	}
}

export default SampleClip;