import NodePlaybackInstance from "../../playback/NodePlaybackInstance.js";
import PlaybackInstanceInputNodeValue from "../values/inputs/PlaybackInstanceInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "./BaseNode.js";

class JoinerNode extends BaseNode {
	static name = "Mixer";
	static typeID = "joiner";
	
	inputs = [
		new PlaybackInstanceInputNodeValue({name: "incoming-playback-1", label: "Playback 1"}),
		new PlaybackInstanceInputNodeValue({name: "incoming-playback-2", label: "Playback 2"})
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({name: "returned-playback", label: "Output"}, () => this.playbackInstance)
	];
	
	playbackInstance = new NodePlaybackInstance((time, channel) => {
		const incomingPlayback1 = this.getInputValue("incoming-playback-1");
		const incomingPlayback2 = this.getInputValue("incoming-playback-1");
		
		return incomingPlayback1.getSampleAt(time, channel) + incomingPlayback2.getSampleAt(time, channel);
	})
}

export default JoinerNode;