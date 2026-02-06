import Math2 from "../../lib/Math2.js";
import NodePlaybackInstance from "../../playback/NodePlaybackInstance.js";
import TrackDataInputNodeValue from "../values/inputs/TrackDataInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "./BaseNode.js";

class BasicInstrumentNode extends BaseNode {
	static name = "Basic Instrument";
	static category = "Instruments";
	static typeID = "basicInstrument";
	static exclusiveTo = ["noteTrack"];
	
	inputs = [
		new TrackDataInputNodeValue({label: "Track Data", name: "noteTrack"}),
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({label: "Instrument Audio", name: "returned-playback"}, () => this.playbackInstance)
	];
	
	playbackInstance = new NodePlaybackInstance((time, channel) => {
		const noteTrack = this.getInputValue("noteTrack");
		
		const playingNotes = noteTrack.notes.filter(note => note.timeSeconds < time && note.endTimeSeconds > time);
		
		let output = 0;
		for(let note of playingNotes) {
			output += Math.sin(time * Math2.midiToFreq(note.pitch) * Math.PI);
		}
		if(playingNotes.length > 0) {
			output /= playingNotes.length;
		}
		
		return output;
	})
}

export default BasicInstrumentNode;