
class ContextMenuConditionalItem {
	constructor(shouldShow, item) {
		this.shouldShow = shouldShow;
		this.item = item;
	}
	
	render(parentNode) {
		if(this.shouldShow()) {
			this.item.render(parentNode);
		}
	}
}

export default ContextMenuConditionalItem;