import initSync, { add_to_array, subtract_from_array, multiply_array_by_number, multiply_array_by_array, f32_array_to_wav } from "./pkg/frusician_wasm_arraymath.js";
initSync();

class ArrayMath {
	static addToArray(target, source) {
		return add_to_array(target, source);
	}
	static subtractFromArray(target, source) {
		return subtract_from_array(target, source);
	}
	static multiplyArrayByNumber(target, source) {
		return multiply_array_by_number(target, source);
	}
	static multiplyArrayByArray(target, source) {
		return multiply_array_by_array(target, source);
	}
	
	static arrayToWav(channels, sample_rate) {
		const arr = new Float32Array(channels.reduce((a,b) => a + b.length, 0));
		for(let channel in channels) {
			const samples = channels[channel];
			arr.set(samples, samples.length * channel);
		}
		return f32_array_to_wav(arr, sample_rate, channels.length);
	}
}

export default ArrayMath;