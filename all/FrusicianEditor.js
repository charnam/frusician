
import { HTML } from "imperative-html";
import Header from "./ui/Header.js";
import ContextMenu from "./ui/contextmenu/ContextMenu.js";
import Song from "./Song.js";
import { ultraboxImportFile } from "./other/ultraboxImport.js";
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
		const contextMenu = new ContextMenu([
			new ContextMenu.Submenu("File", [
				new ContextMenu.ClickableItem("New", () => {
					this.newSong();
				}),
				new ContextMenu.ClickableItem("Open", async () => {
					this.setSong(await Song.load());
				}),
				new ContextMenu.ClickableItem("Save", () => {
					this.song.save(true);
				}),
				new ContextMenu.ClickableItem("Export as WAV", () => {
					this.song.exportWAV();
				}),
				new ContextMenu.Submenu("Other", [
					new ContextMenu.ClickableItem("Import from UltraBox", async () => {
						this.setSong(await ultraboxImportFile());
					}),
				])
			]),
			new ContextMenu.Submenu("Edit", [
				new ContextMenu.ClickableItem("Hello World")
			]),
			new ContextMenu.Submenu("Preferences", [
				new ContextMenu.ClickableItem("YAY")
			])
		]);
		
		const header = new Header(contextMenu);
		header.render(headerContainer)
		parentNode.appendChild(headerContainer);
		
		const songContainer = HTML.div({id: "song"});
		parentNode.appendChild(songContainer);
		
		this.songContainer = songContainer;
		this.newSong();
		
		
		let lastPlayPauseTime = null;
		window.addEventListener("keydown", (keyEvent) => {
			if(document.querySelector(".node-graph-container")) {
				return;
			}
			
			if(keyEvent.key == " ") {
				keyEvent.preventDefault();
				if(document.querySelector(".node-graph") || document.querySelector(".clip-editor")) {
					if(this.song.playback.playing) {
						this.song.playback.pause();
						this.song.playback.currentTime = lastPlayPauseTime;
					} else {
						this.song.playback.play();
						lastPlayPauseTime = this.song.playback.currentTime;
					}
				} else {
					this.song.playback.playpause();
				}
			}
		});
	}
	
	newSong() {
		const song = new Song()
		new NoteTrack(song);
		new NoteTrack(song);
		new NoteTrack(song);
		new SampleTrack(song);
		this.setSong(song);
	}
	
	setSong(song) {
		if(this.song) {
			if(this.song.playback) {
				this.song.playback.pause();
			}
		}
		
		this.song = song;
		this.song.render(this.songContainer);
	}
}

export default FrusicianEditor;
