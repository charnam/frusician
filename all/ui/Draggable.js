import Overlay from "./Overlay.js";

class Draggable {
	constructor(drag, release) {
		this.drag = drag;
		this.release = release;
	}
	
	startDrag(event) {
		const overlay = new Overlay();
		
		overlay.style.cursor = "move";
		
		let startX = event.clientX;
		let startY = event.clientY;
		
		const moveMouse = event => {
			let x = event.clientX;
			let y = event.clientY;
			
			this.drag({
				x,
				y,
				deltaX: x - startX,
				deltaY: y - startY
			});
		}
		
		const releaseMouse = event => {
			let x = event.clientX;
			let y = event.clientY;
			
			this.release({
				x,
				y,
				deltaX: x - startX,
				deltaY: y - startY
			});
			overlay.remove();
		}
		
		window.addEventListener("mousemove", moveMouse);
		window.addEventListener("mouseup", releaseMouse);
	}
	
	createDragEventHandler() {
		return event => {
			this.startDrag(event);
		}
	}
}

export default Draggable;
