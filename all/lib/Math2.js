class Math2 {
	static mod(a, b) {
		return ((a % b) + b) % b;
	}
	static midiToFreq = (midi) => {
		return 440 * Math.pow(2, (midi - 69) / 12);
	};
	static slideFreq() {
	}
	static average(array, alternate) {
		if(array.length == 0) array = [alternate];
		return array.reduce((a, b) => a + b) / array.length;
	}
}

export default Math2;