import { HTML } from "imperative-html";
import Identifier from "../lib/Identifier.js";
import Draggable from "../ui/Draggable.js";
import EditorModal from "../ui/EditorModal.js";
import ContextMenu from "../ui/contextmenu/ContextMenu.js";
import ContextMenuClickableItem from "../ui/contextmenu/ContextMenuClickableItem.js";
import ContextMenuConditionalItem from "../ui/contextmenu/ContextMenuConditionalItem.js";

class Clip {
	static typeID = null;
	static typeName = "Default clip, do not use";
	id = null;
	name = "Clip";
	color = 0;
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
	
	delete() {
		
		this.track.clipPlacement = this.track.clipPlacement.filter(
			placement => placement.clip !== this);
		delete this.track.clips[this.id];
		this.track.updateRendered();
	}
	
	static Placement = class ClipPlacement {
		clip = null;
		time = 0;
		duration = 0;
		loopCount = 0;
		
		boundTo = [];
		contextMenu = new ContextMenu([
			new ContextMenuClickableItem("Edit", () => {
				this.clip.openClipEditor(this);
				console.log(this.clip.track.clipPlacement);
			}),
			new ContextMenuConditionalItem(() => this.hasDuplicates(),
				new ContextMenuClickableItem("Edit as new", () => {
					this.clip = this.clip.constructor.fromSerialized(this.clip.serialize(), this.clip.track);
					this.clip.name += " copy";
					this.clip.track.updateRendered();
					this.clip.openClipEditor(this);
				}),
			),
			new ContextMenuClickableItem("Add linked clip", () => {
				this.duplicate(this.duration);
				this.clip.track.updateRendered();
			}),
			new ContextMenuConditionalItem(() => this.loopCount > 0,
				new ContextMenuClickableItem("Apply loop", () => {
					if(this.hasDuplicates()) {
						this.clip = this.clip.constructor.fromSerialized(this.clip.serialize(), this.clip.track);
						this.clip.name += " copy";
					}
					this.clip.notes = this.allNotes;
					this.duration += this.loopCount * this.duration;
					this.loopCount = 0;
					this.clip.track.updateRendered();
				}),
			),
			new ContextMenuConditionalItem(() => this.loopCount > 0,
				new ContextMenuClickableItem("Break down loop", () => {
					const loops = this.loopCount;
					this.loopCount = 0;
					for(let i = 0; i < loops; i++) {
						this.duplicate(this.duration * (i + 1));
					}
					this.clip.track.updateRendered();
				})
			),
			new ContextMenuConditionalItem(() => this.hasDuplicates(),
				new ContextMenuClickableItem("Remove link", () => {
					this.remove();
				}),
			),
			new ContextMenuConditionalItem(() => !this.hasDuplicates(),
				new ContextMenuClickableItem("Delete clip", () => {
					this.clip.delete();
				})
			),
		]);
		
		constructor(clip) {
			this.id = Identifier.create();
			this.clip = clip;
		}
		
		remove() {
			let thisIndex = this.clip.track.clipPlacement.indexOf(this);
			if(thisIndex > -1) {
				this.clip.track.clipPlacement.splice(thisIndex, 1)
			}
			this.clip.track.updateRendered();
		}
		
		duplicate(addTime) {
			const placement = this.constructor.fromSerialized(this.serialize(), this.clip.track);
			placement.id = Identifier.create();
			placement.time += addTime;
			this.clip.track.clipPlacement.push(placement);
		}
		
		hasDuplicates() {
			return Object.values(this.clip.track.clipPlacement).filter(placement => placement.clip.id == this.clip.id).length > 1;
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
			clipPlacement.oncontextmenu = ContextMenu.eventOpener(this.contextMenu);
			
			let extendStartDuration = 0;
			clipPlacementExtendDuration.onmousedown = event => {
				extendStartDuration = this.duration;
				extendClip.startDrag(event);
			}
			const extendClip = new Draggable(position => {
				const roundBy = this.clip.track.song.pixelsPerMeasure / this.clip.track.song.beatsPerMeasure;
				this.duration = extendStartDuration + Math.round(position.deltaX / roundBy) * roundBy / this.clip.track.song.pixelsPerMeasure;
				this.duration = Math.max(this.duration, 1 / this.clip.track.song.beatsPerMeasure);
				this.updateRendered();
			})
			
			let loopStartCount = 0;
			clipPlacementExtendLoop.onmousedown = event => {
				loopStartCount = this.loopCount;
				loopClip.startDrag(event);
			}
			const loopClip = new Draggable(position => {
				this.loopCount = loopStartCount + Math.round(position.deltaX / this.clip.track.song.pixelsPerMeasure / this.duration);
				this.loopCount = Math.max(this.loopCount, 0);
				this.updateRendered();
			})
			
			parentNode.appendChild(clipPlacement);
			this.boundTo.push(clipPlacement);
			this.updateRendered();
			return clipPlacement;
		}
		
		updateRendered() {
			for(let target of this.boundTo) {
				target.querySelector(".clip-placement-header-name").innerText = this.clip.name;
				target.setAttribute("style", `
					--clip-hue: ${this.clip.color * 15 % 360}deg;
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
		static fromSerialized(serialized, track) {
			const placement = new this(track.clips[serialized.clipID]);
			
			placement.id = serialized.placementID;
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
		const clips = Object.values(track.clips);
		this.color = clips.length;
		while(name == null || clips.some(clip => clip.name == name)) {
			iter++;
			name = "Clip "+iter;
		}
		this.name = name;
	}
	
	openClipEditor(fromPlacement) {
		const editorWrapper = new EditorModal();
		return this.renderClipEditor(editorWrapper, fromPlacement);
	}
	
	renderClipEditor(parentNode, _fromPlacement) {
		let editor,
			editorHeader,
			editorHeaderButtons,
			editorPlayButton,
			editorCloseButton,
			editorClipName,
			editorEditBox;
		
		editor = new HTML.div({class: "clip-editor"},
			editorHeader = new HTML.div({class: "clip-editor-header"},
				editorClipName = new HTML.input({type: "text", class: "clip-editor-clip-name"}),
				editorHeaderButtons = new HTML.div({class: "clip-editor-header-buttons"},
					editorPlayButton = new HTML.button({class: "clip-editor-play-button"}),
					editorCloseButton = new HTML.button({class: "clip-editor-close-button"}),
				)
			),
			editorEditBox = new HTML.div({class: "clip-editor-edit-box"})
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
		return editorEditBox;
	}
	
	serialize() {
		return {
			typeID: this.constructor.typeID,
			loopCount: this.loopCount,
			name: this.name
		}
	}
	static fromSerialized(serializedData, track) {
		const clip = new this(track);
		clip.name = serializedData.name;
		clip.loopCount = serializedData;
		return clip;
	}
}

export default Clip;