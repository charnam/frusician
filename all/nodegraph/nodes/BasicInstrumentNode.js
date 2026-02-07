import Math2 from "../../lib/Math2.js";
import NodePlaybackInstance from "../../playback/NodePlaybackInstance.js";
import DropdownInputNodeValue from "../values/inputs/DropdownInputNodeValue.js";
import TrackDataInputNodeValue from "../values/inputs/TrackDataInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "./BaseNode.js";

class BasicInstrumentNode extends BaseNode {
	static name = "Basic Instrument";
	static category = "Instruments";
	static typeID = "basicInstrument";
	static exclusiveTo = ["noteTrack"];
	
	inputs = [
		new TrackDataInputNodeValue({
			name: "noteTrack",
			label: "Track Data"}),
		new DropdownInputNodeValue({name: "wave", label: "Wave", items: ["Sine", "Square", "Sawtooth", "Triangle"], default: "Sine"})
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({label: "Instrument Audio", name: "returned-playback"}, () => this.playbackInstance)
	];
	
	playbackInstance = new NodePlaybackInstance((time, channel) => {
		const noteTrack = this.getInputValue("noteTrack");
		const wave = this.getInputValue("wave");
		
		const playingNotes = noteTrack.notes.filter(note => note.timeSeconds < time && note.endTimeSeconds > time);
		
		let output = 0;
		for(let note of playingNotes) {
			const repeat = (time - note.timeSeconds) * Math2.midiToFreq(note.pitch);
			if(wave == "Sine") {
				output += Math.sin(repeat * Math.PI * 2);
			} else if(wave == "Square") {
				output += repeat % 1 < 0.5 ? 1 : -1;
			} else if(wave == "Sawtooth") {
				output += ((repeat % 1) - 0.5) * 2;
			} else if(wave == "Triangle") {
				if(repeat % 1 > 0.5) {
					output += ((repeat % 1) - 0.5) * 2
				} else {
					output += (1 - (repeat % 1) - 0.5) * 2
				}
			}
		}
		if(playingNotes.length > 0) {
			output /= playingNotes.length;
		}
		
		return output;
	})
}

export default BasicInstrumentNode;