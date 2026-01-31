import Overlay from "./Overlay.js";

class Draggable {
	constructor(drag, release) {
		this.drag = drag;
		if(release == undefined) {
			release = drag;
		}
		this.release = release;
	}
	
	startDrag(event) {
		const overlay = new Overlay();
		overlay.style.cursor = "grabbing";
		
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
			window.removeEventListener("mousemove", moveMouse);
			window.removeEventListener("mouseup", releaseMouse);
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
