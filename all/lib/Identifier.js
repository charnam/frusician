
class Identifier {
	static create() {
		if(crypto && crypto.randomUUID) {
			return crypto.randomUUID();
		} else {
			return `${Date.now().toString(16).padStart(16, "0")}-${Math.round(Math.random()*10000000).toString(16).padStart(8, "0")}`;
		}
	}
}

export default Identifier;