import { HTML } from "imperative-html";
import Identifier from "../lib/Identifier.js";
import Draggable from "../ui/Draggable.js";
import EditorModal from "../ui/EditorModal.js";
import ContextMenu from "../ui/contextmenu/ContextMenu.js";
import ContextMenuClickableItem from "../ui/contextmenu/ContextMenuClickableItem.js";

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
	
	static Placement = class ClipPlacement {
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
			
			const contextMenu = new ContextMenu([
				new ContextMenuClickableItem("Edit", () => {
					this.clip.openClipEditor();
				}),
				new ContextMenuClickableItem("Remove instance", () => {
					let thisIndex = this.clip.track.clipPlacement.indexOf(this);
					if(thisIndex > -1) {
						this.clip.track.clipPlacement.splice(thisIndex, 1)
					}
					this.clip.track.updateRendered();
				}),
				new ContextMenuClickableItem("Delete clip", () => {
					this.clip.track.clipPlacement = this.clip.track.clipPlacement.filter(
						placement => placement.clip !== this.clip);
					delete this.clip.track.clips[this.clip.id];
					this.clip.track.updateRendered();
				})
			]);
			
			
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
			clipPlacement.oncontextmenu = ContextMenu.eventOpener(contextMenu);
			
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
					--totalDuration: ${this.duration * (this.loopCount + 1)};
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
			const placement = new this(track.clips[serialized.clipID]);
			
			placement.id = serialized.id;
			placement.time = serialized.time;
			placement.duration = serialized.duration;
			placement.loopCount = serialized.loopCount;
			
			return placement;
		}
	};
	
	constructor(track) {
		this.id = Identifier.create();
		this.track = track;
		let name = null;
		let iter = 0;
		while(name == null || Object.values(this.track.clips).some(clip => clip.name == name)) {
			iter++;
			name = "Clip "+iter;
		}
		this.name = name;
	}
	
	openClipEditor() {
		const editorWrapper = new EditorModal();
		return this.renderClipEditor(editorWrapper);
	}
	
	renderClipEditor(parentNode) {
		let editor,
			editorHeader,
			editorCloseButton,
			editorClipName;
		
		editor = new HTML.div({class: "clip-editor"},
			editorHeader = new HTML.div({class: "clip-editor-header"},
				editorCloseButton = new HTML.button({class: "clip-editor-close-button"}),
				editorClipName = new HTML.input({type: "text", class: "clip-editor-clip-name"}),
			),
			new HTML.div({class: "clip-editor-edit-box"})
		);
		
		editorCloseButton.onclick = () => {
			const wrapper = parentNode.parentElement;
			wrapper.remove();
		}
		
		editorClipName.value = this.name;
		editorClipName.oninput = () => {
			this.name = editorClipName.value;
			this.track.updateRendered();
		}
		editorClipName.onkeydown = event => {
			if(event.key == "Enter") {
				editorClipName.blur();
			}
		}
		
		parentNode.appendChild(editor);
		return editor;
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