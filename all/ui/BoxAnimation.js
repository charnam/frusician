import { HTML } from "imperative-html"

class BoxAnimation {
	
	static fromPositions(x, y, width, height, x2, y2, width2, height2) {
		return new Promise(res => {
			const box = new HTML.div({class: "box-animation"});
			document.body.appendChild(box);
			box.style.left = x+"px";
			box.style.top = y+"px";
			box.style.width = width+"px";
			box.style.height = height+"px";
			
			box.scrollWidth; // force reflow, to animate
			
			box.style.left = x2+"px";
			box.style.top = y2+"px";
			box.style.width = width2+"px";
			box.style.height = height2+"px";
			
			const done = () => {
				box.remove();
				res();
			};
			
			setTimeout(done, 2000); // in case animation fails to play
			
			box.addEventListener("transitionend", done);
			box.addEventListener("transitioncancel", done);
		})
	}
	
	static async fromElements(el1, el2) {
		const box1 = el1.getBoundingClientRect();
		const box2 = el2.getBoundingClientRect();
		
		el1.style.visibility = "hidden";
		el2.style.visibility = "hidden";
		
		await this.fromPositions(box1.left, box1.top, box1.width, box1.height,
		                         box2.left, box2.top, box2.width, box2.height);
		
		el1.style.visibility = "";
		el2.style.visibility = "";
	}
	
}


export default BoxAnimation;
