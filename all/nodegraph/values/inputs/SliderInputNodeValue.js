import { HTML } from "imperative-html";
import InputNodeValue from "./InputNodeValue.js";

class SliderInputNodeValue extends InputNodeValue {
	type = "number";
	color = 200;
	
	default = 0;
	step = 1;
	min = 0;
	max = 100;
	
	constructor(info) {
		super(info);
		
		this.min = info.min;
		this.max = info.max;
		this.step = info.step;
		if(info.default) {
			this.default = info.default;
		}
		this.default = Math.max(this.min, Math.min(this.default, this.max));
	}
	
	render(parentNode) {
		const container = super.render(parentNode);
		
		let sliderInput,
			sliderInputBox;
		
		const sliderWrapper = new HTML.div({class: "slider-wrapper"},
			sliderInput = new HTML.input({type: "range", min: this.min, max: this.max, step: this.step}),
			sliderInputBox = new HTML.input({type: "number", min: this.min, max: this.max, step: this.step})
		);
		
		let value = this.node.inputValues[this.name];
		if(value === undefined) {
			value = this.default;
		}
		
		sliderInput.value = value;
		sliderInputBox.value = value;
		
		if(this.node.inputConnections[this.name]) {
			sliderInput.disabled = true;
			sliderInputBox.disabled = true;
		}
		
		sliderInput.oninput = () => {
			sliderInputBox.value = sliderInput.value;
			this.node.inputValues[this.name] = sliderInput.value;
		}
		sliderInputBox.oninput = () => {
			sliderInput.value = sliderInputBox.value;
			this.node.inputValues[this.name] = sliderInput.value;
		}
		
		container.appendChild(sliderWrapper);
		return container;
	}
}

export default SliderInputNodeValue;