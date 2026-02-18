use wasm_bindgen::prelude::*;

#[wasm_bindgen]
fn get_adsr_multiplier(adsr: &[f32], note_time: f32, note_duration: f32) -> f32 {
	let attack = adsr[0];
	let decay = adsr[1];
	let sustain = adsr[2];
	let release = adsr[3];
	
	let note_value = 1.0;
	
	if note_time < attack {
		note_value *= note_time / attack;
	} else if note_time < attack + decay {
		note_value *= ((attack - note_time) / decay + 1.0) * (1.0 - sustain) + sustain;
	} else {
		note_value *= sustain;
	}
	
	if note_end_time < time {
		note_value *= 1.0 - (time - note_end_time) / release;
	}
	
	note_value
}