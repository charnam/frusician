import { HTML } from "imperative-html";
import InputNodeValue from "./InputNodeValue.js";

class SliderInputNodeValue extends InputNodeValue {
	type = "number";
	
	step = 1;
	min = 0;
	max = 100;
	
	constructor(info) {
		super(info);
		
		this.min = info.min;
		this.max = info.max;
		this.step = info.step;
	}
	
	render(parentNode) {
		const container = super(parentNode);
		
		const sliderInput = new HTML.input({type: "range", min: this.min, max: this.max, step: this.step});
		const sliderInputBox = new HTML.input({type: "number", min: this.min, max: this.max, step: this.step});
		
		container.appendChild(sliderInput);
		container.appendChild(sliderInputBox);
		
		sliderInput.oninput = () => {
			sliderInputBox.value = sliderInput.value;
			this.value = sliderInput.value;
		}
		sliderInputBox.oninput = () => {
			sliderInput.value = sliderInputBox.value;
			this.value = sliderInput.value;
		}
		
		return container;
	}
}

export default SliderInputNodeValue;