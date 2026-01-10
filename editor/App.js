
class App {
	canvas = null;
	ctx = null;
	
	song = null;
	
	constructor(canvas, song = null) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		
		
	}
}

export default App;