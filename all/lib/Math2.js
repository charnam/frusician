class Math2 {
	static mod(a, b) {
		return ((a % b) + b) % b;
	}
	static midiToFreq = (midi) => {
		return 440 * Math.pow(2, (midi - 69) / 12);
	};
}

export default Math2;