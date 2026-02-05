import BaseNode from "./BaseNode.js";
import PlaybackInstanceInputNodeValue from "../values/inputs/PlaybackInstanceInputNodeValue.js";

class MainoutputNode extends BaseNode {
	static name = "Main Output";
	static typeID = "mainOutput";
	static canBeAdded = false;
	id = "MAIN_OUTPUT";
	get inputs() {
		return [
			new PlaybackInstanceInputNodeValue({label: "Playback", name: "playback", node: this})
		];
	}
	outputs = [
	];
	
	constructor(...args) {
		super(...args);
		delete this.inputs;
		this.inputConnections.playback = {nodeId: "MAIN_INPUT", outputName: "track"};
	}
}

export default MainoutputNode;