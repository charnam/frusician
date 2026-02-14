use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn apply_echo(input_data: &[f32], output_data: &mut [f32], repetitions: usize, delay_samples: usize, input_start_index: usize) {
	for sample in 0..output_data.len() {
		for i in 0..repetitions {
			let target_idx = (sample as usize + input_start_index) - (i * delay_samples);
			output_data[sample] += input_data[target_idx as usize] * (1.0-((i as f32) / (repetitions as f32)));
		}
	}
}