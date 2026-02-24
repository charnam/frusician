import { HTML } from "imperative-html";
import InputNodeValue from "./InputNodeValue.js";
import FileUploads from "../../../lib/FileUploads.js";

class AudioFileInputNodeValue extends InputNodeValue {
	type = "audioFile";
	connectable = false;
	
	constructor(info) {
		super(info);
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
			uploadedFileName.innerText = "1 file selected";
		}
		
		uploadFileButton.onclick = async () => {
			const ac = new AudioContext();
			const buffer = await FileUploads.uploadArrayBuffer("audio/*");
			
			const audioBuffer = await ac.decodeAudioData(buffer);
			
			const channels = [];
			for(let i = 0; i < audioBuffer.numberOfChannels; i++) {
				channels[i] = Array.from(audioBuffer.getChannelData(i));
			}
			
			this.node.inputValues[this.name] = {
				channels,
				sampleRate: audioBuffer.sampleRate
			};
			
			ac.close();
		}
		
		container.appendChild(wrapper);
		return container;
	}
}

export default AudioFileInputNodeValue;