import { HTML } from "imperative-html";
import InputNodeValue from "./InputNodeValue.js";

class ADSRInputNodeValue extends InputNodeValue {
	type = "adsr";
	color = 250;
	
	default = {attack: 0.01, decay: 0, sustain: 1.0, release: 0.01};
	
	constructor(info) {
		super(info);
		
		this.min = info.min;
		this.max = info.max;
		this.step = info.step;
		if(info.default) {
			this.default = info.default;
		}
	}
	
	render(parentNode) {
		const container = super.render(parentNode);
		
		const sliders = [
			{name: "attack", label: "Attack", min: 0.0, step: 0.01, max: 1.0, default: this.default.attack},
			{name: "decay", label: "Decay", min: 0.0, step: 0.01, max: 1.0, default: this.default.decay},
			{name: "sustain", label: "Sustain", min: 0.0, step: 0.01, max: 1.0, default: this.default.sustain},
			{name: "release", label: "Release", min: 0.0, step: 0.01, max: 1.0, default: this.default.release},
		]
		
		const slidersEl = new HTML.div({class: "adsr-sliders"});
		
		let value = this.node.inputValues[this.name];
		if(value === undefined) {
			value = this.node.inputValues[this.name] = this.default;
		}
		
		for(let slider of sliders) {
			let sliderInput,
				sliderInputBox;
			
			const sliderWrapper = new HTML.div({class: "adsr-slider-label"},
				new HTML.div({class: "slider-text"}, slider.label),
				new HTML.div({class: "slider-wrapper"},
					sliderInput = new HTML.input({type: "range", min: slider.min, max: slider.max, step: slider.step}),
					sliderInputBox = new HTML.input({type: "number", min: slider.min, max: slider.max, step: slider.step})
				)
			);
			
			sliderInput.value = value[slider.name];
			sliderInputBox.value = value[slider.name];
			
			if(this.node.inputConnections[this.name]) {
				sliderInput.disabled = true;
				sliderInputBox.disabled = true;
			}
			
			sliderInput.oninput = () => {
				sliderInputBox.value = sliderInput.value;
				this.node.inputValues[this.name][slider.name] = Number(sliderInput.value);
			}
			sliderInputBox.oninput = () => {
				sliderInput.value = sliderInputBox.value;
				sliderInput.oninput();
			}
			
			slidersEl.appendChild(sliderWrapper)
		}
		
		container.appendChild(slidersEl);
		return container;
	}
}

export default ADSRInputNodeValue;