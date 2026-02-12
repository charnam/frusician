import Math2 from "../../lib/Math2.js";
import RangedNodePlaybackInstance from "../../playback/RangedNodePlaybackInstance.js";
import ADSRInputNodeValue from "../values/inputs/ADSRInputNodeValue.js";
import DropdownInputNodeValue from "../values/inputs/DropdownInputNodeValue.js";
import SliderInputNodeValue from "../values/inputs/SliderInputNodeValue.js";
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
		new DropdownInputNodeValue({name: "wave", label: "Wave", items: ["Sine", "Square", "Sawtooth", "Triangle"], default: "Square"}),
		new ADSRInputNodeValue({name: "adsr"}),
		/*new SliderInputNodeValue({
			name: "attack",
			label: "Attack",
			min: 0.0, max: 8.0, default: 0.01, step: 0.01
		}),
		new SliderInputNodeValue({
			name: "decay",
			label: "Decay",
			min: 0.0, max: 8.0, default: 0.0, step: 0.01
		}),
		new SliderInputNodeValue({
			name: "sustain",
			label: "Sustain",
			min: 0.0, max: 1.0, default: 1.0, step: 0.01
		}),
		new SliderInputNodeValue({
			name: "release",
			label: "Release",
			min: 0.0, max: 8.0, default: 0.01, step: 0.01
		}),*/
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({label: "Instrument Audio", name: "returned-playback"}, () => this.playbackInstance)
	];
	
	playbackInstance = new RangedNodePlaybackInstance((startTime, sampleCount, secondsPerSample, channel) => {
		const noteTrack = this.getInputValue("noteTrack");
		const wave = this.getInputValue("wave");
		
		const adsr = this.getInputValue("adsr");
		
		const attack = this.graph.track.song.beatsToSeconds(adsr.attack);
		const decay = this.graph.track.song.beatsToSeconds(adsr.decay);
		const sustain = adsr.sustain;
		const release = this.graph.track.song.beatsToSeconds(adsr.release);
		
		const duration = sampleCount * secondsPerSample;
		const notes = noteTrack.notes.map(note => ({
			start: note.timeSeconds,
			end: note.endTimeSeconds,
			frequency: Math2.midiToFreq(note.pitch)
		})).filter(note => note.end + release > startTime && note.start < startTime + duration);
		
		const output = new Float32Array(sampleCount);
		for(let i = 0; i < output.length; i++) {
			const time = startTime + i * secondsPerSample;
			
			for(let note of notes) {
				if(note.start <= time && note.end + release > time) {
					let noteValue = 0
					
					const noteTime = time - note.start;
					
					const repeat = noteTime * note.frequency;
					if(wave == "Sine") {
						noteValue = Math.sin(repeat * Math.PI * 2);
					} else if(wave == "Square") {
						noteValue = repeat % 1 < 0.5 ? 1 : -1;
					} else if(wave == "Sawtooth") {
						noteValue = ((repeat % 1) - 0.5) * 2;
					} else if(wave == "Triangle") {
						noteValue = Math.asin(Math.sin(repeat * Math.PI * 2)) * 2 / Math.PI
					}
					
					if(noteTime < attack) {
						noteValue *= noteTime / attack;
					} else if(noteTime < attack + decay) {
						noteValue *= ((attack - noteTime) / decay + 1) * (1 - sustain) + sustain;
					} else {
						noteValue *= sustain
					}
					
					if(note.end < time) {
						noteValue *= 1 - (time - note.end) / release;
					}
					
					output[i] += noteValue;
				}
			}
			
		}
		
		return output;
	})
}

export default BasicInstrumentNode;