use wasm_bindgen::prelude::*;
use std::f32::consts::PI;

#[wasm_bindgen]
pub fn apply_vibrato(input_data: &[f32], output_data: &mut [f32], intensity: f32, speed: f32, seconds_per_sample: f32, start_time: f32) {
	for sample in 0..output_data.len() {
		let time = start_time + sample as f32 * seconds_per_sample;
		let new_time = time + f32::sin(time * speed * PI * 2.0) * intensity;
		let index: f32 = (new_time + intensity * 2.0 - start_time) / seconds_per_sample;
		let mult = index % 1.0;
		
		output_data[sample] = input_data[index.floor() as usize] * (1.0 - mult) + input_data[index.ceil() as usize] * mult;
	}
}