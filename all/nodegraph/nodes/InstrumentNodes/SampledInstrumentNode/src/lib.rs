use wasm_bindgen::prelude::*;
use frusician_wasm_instrumentnode_lib::get_adsr_multiplier;

#[wasm_bindgen]
pub fn generate_sampled_instrument_samples(
	sample_data: &[f32], sample_rate: i32, sample_frequency: f32,
	
	start_time: f32,
	sample_count: usize,
	seconds_per_sample: f32,
	
	adsr: &[f32],
	
	note_start_times: &[f32], note_end_times: &[f32], note_frequencies: &[f32]
) -> Vec<f32> {
	let mut output = vec![0.0; sample_count];
	
	for i in 0..sample_count {
		let time = start_time + i as f32 * seconds_per_sample;
		let mut sample = 0.0;
		
		for note in 0..note_start_times.len() {
			let note_start_time = note_start_times[note];
			let note_end_time = note_end_times[note];
			let note_duration = note_end_time - note_start_time;
			let note_frequency = note_frequencies[note];
			
			if note_start_time <= time && note_end_time + adsr[3] > time {
				let note_time = time - note_start_time;
				let mut note_value = 0.0;
				
				let sample_index = (note_time / sample_frequency * note_frequency) * sample_rate as f32;
				
				if (sample_index.ceil() as usize) < sample_data.len() {
					let next_sample_volume = sample_index % 1.0;
					let prev_sample_volume = 1.0 - next_sample_volume;
					
					let prev_sample = sample_data[sample_index.floor() as usize];
					let next_sample = sample_data[sample_index.ceil() as usize];
					
					note_value = prev_sample * prev_sample_volume + next_sample * next_sample_volume;
				}
				
				note_value *= get_adsr_multiplier(adsr, note_time, note_duration);
				
				sample += note_value;
			}
		}
		
		output[i] = sample;
	}
	
	output
}