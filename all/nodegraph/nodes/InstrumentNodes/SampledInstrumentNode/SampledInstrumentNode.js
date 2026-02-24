import Math2 from "../../../../lib/Math2.js";
import RangedNodePlaybackInstance from "../../../../playback/RangedNodePlaybackInstance.js";
import ADSRInputNodeValue from "../../../values/inputs/ADSRInputNodeValue.js";
import AudioFileInputNodeValue from "../../../values/inputs/AudioFileInputNodeValue.js";
import SliderInputNodeValue from "../../../values/inputs/SliderInputNodeValue.js";
import TrackDataInputNodeValue from "../../../values/inputs/TrackDataInputNodeValue.js";
import PlaybackInstanceOutputNodeValue from "../../../values/outputs/PlaybackInstanceOutputNodeValue.js";
import BaseNode from "../../BaseNode.js";

import initSync, { generate_sampled_instrument_samples } from "./pkg/frusician_wasm_sampledinstrumentnode.js";
initSync();

class SampledInstrumentNode extends BaseNode {
	static name = "Sampled Instrument";
	static category = "Instruments";
	static typeID = "sampledInstrument";
	static exclusiveTo = ["noteTrack"];
	
	inputs = [
		new TrackDataInputNodeValue({
			name: "noteTrack",
			label: "Track Data"
		}),
		new AudioFileInputNodeValue({name: "sample", label: "Sampled Audio"}),
		new SliderInputNodeValue({name: "sample-frequency", label: "Original Pitch", min: 1, default: 440, max: 5000, step: 0.001}),
		new ADSRInputNodeValue({name: "adsr"}),
	];
	outputs = [
		new PlaybackInstanceOutputNodeValue({label: "Instrument Audio", name: "returned-playback"}, () => this.playbackInstance)
	];
	
	playbackInstance = new RangedNodePlaybackInstance((startTime, sampleCount, secondsPerSample, channel) => {
		const sample = this.getInputValue("sample");
		if(sample == null) {
			return new Float32Array(sampleCount);
		}
		
		const duration = sampleCount * secondsPerSample;
		const noteTrack = this.getInputValue("noteTrack");
		
		const sampleFrequency = this.getInputValue("sample-frequency");
		
		const adsr = this.getInputValue("adsr");
		
		const attack = this.graph.track.song.beatsToSeconds(adsr.attack);
		const decay = this.graph.track.song.beatsToSeconds(adsr.decay);
		const sustain = adsr.sustain;
		const release = this.graph.track.song.beatsToSeconds(adsr.release);
		
		const notes = noteTrack.notes.filter(note => note.endTimeSeconds + release > startTime && note.timeSeconds < startTime + duration);
		const noteStartTimes = new Float32Array(notes.length);
		const noteEndTimes = new Float32Array(notes.length);
		const noteFrequencies = new Float32Array(notes.length);
		for(let index in notes) {
			const note = notes[index];
			noteStartTimes[index] = note.timeSeconds;
			noteEndTimes[index] = note.endTimeSeconds;
			noteFrequencies[index] = Math2.midiToFreq(note.pitch);
		}
		
		const output = generate_sampled_instrument_samples(
			new Float32Array(sample.channels[channel % sample.channels.length]), sample.sampleRate, sampleFrequency,
			startTime, sampleCount, secondsPerSample,
			new Float32Array([attack, decay, sustain, release]),
			noteStartTimes, noteEndTimes, noteFrequencies
		);
		
		
		return output;
	})
}

export default SampledInstrumentNode;