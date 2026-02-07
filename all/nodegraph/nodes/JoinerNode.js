import NodePlaybackInstance from "../../playback/NodePlaybackInstance.js";
import PlaybackInstanceInputNodeValue from "../values/inputs/PlaybackInstanceInputNodeValue.js";
import SliderInputNodeValue from "../values/inputs/SliderInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "./BaseNode.js";

class JoinerNode extends BaseNode {
	static name = "Mixer";
	static typeID = "joiner";
	static category = "Basic";
	
	constructor(...args) {
		super(...args)
		delete this.inputs;
	}
	
	getInputPlaybacks() {
		return Object.keys(this.inputConnections).filter(key => key.startsWith("incoming-playback-"));
	}
	
	get inputs() {
		let inputs = [
		];
		
		const playbacks = this.getInputPlaybacks();
		for(let key of playbacks) {
			inputs.push(new PlaybackInstanceInputNodeValue({node: this, name: key, label: "Playback " + key.replace("incoming-playback-", "")}));
			inputs.push(new SliderInputNodeValue({node: this, name: "volume-"+key, min: 0.0, max: 2.0, step: 0.01, default: 1.0}));
		}
		
		let proposedName = null;
		let proposedId = 0;
		
		while(proposedName == null || playbacks.includes(proposedName)) {
			proposedId++;
			proposedName = "incoming-playback-"+proposedId;
		}
		
		inputs.push(new PlaybackInstanceInputNodeValue({node: this, name: proposedName, label: "Playback "+proposedId}));
		
		return inputs;
	}
	
	outputs = [
		new PlaybackInstanceOutputNodeValue({name: "returned-playback", label: "Output"}, () => this.playbackInstance)
	];
	
	playbackInstance = new NodePlaybackInstance((time, channel) => {
		const playbacks = this.getInputPlaybacks();
		
		let output = 0;
		for(let playback of playbacks) {
			const volume = this.getInputValue("volume-"+playback);
			if(volume !== undefined) {
				output += this.getInputValue(playback).getSampleAt(time, channel) * volume;
			}
		}
		
		return output;
	})
}

export default JoinerNode;