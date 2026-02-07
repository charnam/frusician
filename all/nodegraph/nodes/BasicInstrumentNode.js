import Math2 from "../../lib/Math2.js";
import RangedNodePlaybackInstance from "../../playback/RangedNodePlaybackInstance.js";
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
			label: "Track Data"
		}),
		new DropdownInputNodeValue({name: "wave", label: "Wave", items: ["Sine", "Square", "Sawtooth", "Triangle"], default: "Sine"})
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({label: "Instrument Audio", name: "returned-playback"}, () => this.playbackInstance)
	];
	
	playbackInstance = new RangedNodePlaybackInstance((startTime, sampleCount, secondsPerSample, channel) => {
		const noteTrack = this.getInputValue("noteTrack");
		const wave = this.getInputValue("wave");
		
		const duration = sampleCount * secondsPerSample;
		const notes = noteTrack.notes.map(note => ({
			start: note.timeSeconds,
			end: note.endTimeSeconds,
			frequency: Math2.midiToFreq(note.pitch)
		})).filter(note => note.end > startTime && note.start < startTime + duration);
		
		const output = new Float32Array(sampleCount);
		for(let i = 0; i < output.length; i++) {
			const time = startTime + i * secondsPerSample;
			for(let note of notes) {
				if(note.start <= time && note.end > time) {
					const repeat = (time - note.start) * note.frequency;
					if(wave == "Sine") {
						output[i] += Math.sin(repeat * Math.PI * 2);
					} else if(wave == "Square") {
						output[i] += repeat % 1 < 0.5 ? 1 : -1;
					} else if(wave == "Sawtooth") {
						output[i] += ((repeat % 1) - 0.5) * 2;
					} else if(wave == "Triangle") {
						output[i] += Math.asin(Math.sin(repeat * Math.PI * 2)) * 2 / Math.PI
					}
				}
			}
		}
		
		return output;
	})
}

export default BasicInstrumentNode;