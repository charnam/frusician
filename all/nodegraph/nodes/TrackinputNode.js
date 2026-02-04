import TrackDataOutputNodeValue from "../values/outputs/TrackDataOutputNodeValue.js";
import BaseNode from "./BaseNode.js";

class TrackinputNode extends BaseNode {
	static name = "Track";
	static typeID = "trackInput"
	static canBeAdded = false;
	id = "MAIN_INPUT";
	inputs = [
	];
	outputs = [
		new TrackDataOutputNodeValue({label: "Track Data", name: "track"}, () => this.graph.track)
	];
}

export default TrackinputNode;