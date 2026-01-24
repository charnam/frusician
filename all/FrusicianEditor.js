
import { HTML } from "imperative-html";
import Header from "./ui/Header.js";
import ContextMenu from "./ui/contextmenu/ContextMenu.js";
import Song from "./Song.js";
import NoteTrack from "./tracks/NoteTrack.js";
import SampleTrack from "./tracks/SampleTrack.js";

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
					this.setSong(new Song());
				}),
				new ContextMenu.ClickableItem("Save", () => {
					this.song.save();
				}),
				new ContextMenu.ClickableItem("Open", async () => {
					this.setSong(await Song.load());
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
		
		const song = new Song()
		this.setSong(song);
		
		window.addEventListener("keydown", (keyEvent) => {
			if(document.querySelector(".node-graph-container")) {
				return;
			}
			const keyPressed = keyEvent.key;
			
			
		});
	}
	
	setSong(song) {
		this.song = song;
		this.song.render(this.songContainer);
	}
}

export default FrusicianEditor;
