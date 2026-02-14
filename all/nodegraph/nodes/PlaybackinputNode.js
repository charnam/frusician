import PlaybackInstanceOutputNodeValue from "../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "./BaseNode.js";

class PlaybackinputNode extends BaseNode {
	static name = "Playback";
	static typeID = "playbackInput"
	static canBeAdded = false;
	id = "MAIN_INPUT";
	inputs = [
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({label: "Track Audio", name: "playback"}, () => this.graph.track.rawPlaybackInstance)
	];
}

export default PlaybackinputNode;