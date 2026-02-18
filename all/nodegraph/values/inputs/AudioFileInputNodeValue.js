import { HTML } from "imperative-html";
import InputNodeValue from "./InputNodeValue.js";

class AudioFileInputNodeValue extends InputNodeValue {
	type = "audioFile";
	connectable = false;
	
	constructor(info) {
		super(info);
		
		this.items = info.items;
		this.default = info.default ?? info.items[0];
	}
	
	render(parentNode) {
		const container = super.render(parentNode);
		
		let uploadedFileName,
			uploadFileButton;
		
		const wrapper = new HTML.label({class: "audio-file-input-wrapper"},
			uploadedFileName = new HTML.div({class: "audio-file-name"}, "No file selected."),
			uploadFileButton = new HTML.button({class: "audio-file-upload-button"}, "Upload...")
		);
		
		let value = this.node.inputValues[this.name];
		if(value) {
			uploadedFileName.innerText = value.filename;
		}
		
		container.appendChild(dropdownWrapper);
		return container;
	}
}

export default AudioFileInputNodeValue;