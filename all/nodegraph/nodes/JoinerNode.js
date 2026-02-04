import NodePlaybackInstance from "../../playback/NodePlaybackInstance.js";
import BaseNode from "./BaseNode.js";

class JoinerNode extends BaseNode {
	static name = "Main Output";
	static typeID = "joiner";
	
	inputs = [
		new PlaybackInstanceInputNodeValue({name: "incoming-playback-1"}),
		new PlaybackInstanceInputNodeValue({name: "incoming-playback-2"})
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({name: "returned-playback"}, () => this.playbackInstance)
	];
	
	playbackInstance = new NodePlaybackInstance((time, channel) => {
		const incomingPlayback1 = this.getInputValue("incoming-playback-1");
		const incomingPlayback2 = this.getInputValue("incoming-playback-1");
		
		return incomingPlayback1.getSampleAt(time, channel) + incomingPlayback2.getSampleAt(time, channel);
	})
}

export default JoinerNode;