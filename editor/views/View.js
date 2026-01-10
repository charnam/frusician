class View {
	constructor(app) {
		this.app = app;
	}
	show() {
		this.app.currentView = this;
	}
}
export default View;