use wasm_bindgen::prelude::*;
use wavv::{Wav, Data};

#[wasm_bindgen]
pub fn add_to_array(target_array: &mut [f32], read_array: &[f32]) {
	for sample in 0..target_array.len() {
		target_array[sample] += read_array[sample];
	}
}

#[wasm_bindgen]
pub fn subtract_from_array(target_array: &mut [f32], read_array: &[f32]) {
	for sample in 0..target_array.len() {
		target_array[sample] -= read_array[sample];
	}
}

#[wasm_bindgen]
pub fn multiply_array_by_number(target_array: &mut [f32], number: f32) {
	for sample in 0..target_array.len() {
		target_array[sample] *= number;
	}
}

#[wasm_bindgen]
pub fn multiply_array_by_array(target_array: &mut [f32], read_array: &[f32]) {
	for sample in 0..target_array.len() {
		target_array[sample] *= read_array[sample];
	}
}


#[wasm_bindgen]
pub fn f32_array_to_wav(array: &[f32], sample_rate: usize, channel_count: usize) -> Vec<u8> {
	let len = array.len() / channel_count;

	let mut result = vec![0; array.len()];
	
	for i in 0..result.len() {
		result[i] = (array[(i % channel_count) * len + i / channel_count] * i16::MAX as f32) as i16;
	}
	
	let data = Data::BitDepth16(result);
	let wav = Wav::from_data(data, sample_rate, channel_count);
	
	wav.to_bytes()
}