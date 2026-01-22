
import { HTML } from "imperative-html";
import Header from "./ui/Header.js";
import ContextMenu from "./ui/contextmenu/ContextMenu.js";
import Song from "./Song.js";

class FrusicianEditor {
	song = null;
	parentNode = null;
	songContainer = null;
	
	constructor(parentNode) {
		this.parentNode = parentNode;
		parentNode.textContent = "";
		
		const headerContainer = HTML.div({id: "header"});
		const header = new Header(new ContextMenu([
			new ContextMenu.Submenu("File", [
				new ContextMenu.ClickableItem("New", () => {
					this.song = new Song();
				}),
				new ContextMenu.ClickableItem("Save", () => {
					this.song.save();
				}),
				new ContextMenu.ClickableItem("Open", async () => {
					this.song = await Song.load();
				}),
			]),
			new ContextMenu.Submenu("Edit", [
				new ContextMenu.ClickableItem("Hello World")
			]),
			new ContextMenu.Submenu("Preferences", [
				new ContextMenu.ClickableItem("YAY")
			])
		]));
		
		
		header.render(headerContainer)
		
		const songContainer = HTML.div({id: "song"});
		
		parentNode.appendChild(headerContainer);
		parentNode.appendChild(songContainer);
		
		this.songContainer = songContainer;
		
		this.setSong(new Song());
		
		window.addEventListener("keydown", (keyEvent) => {
			if(document.querySelector(".node-graph-container")) {
				return;
			}
			const keyPressed = keyEvent.key;
			
			
		});
	}
	
	setSong(song) {
		this.song = song;
		this.song.renderEditor(this.songContainer);
	}
}

export default FrusicianEditor;
