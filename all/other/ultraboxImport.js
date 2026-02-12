import { HTML } from "imperative-html";
import Song from "../Song.js";
import NoteTrack from "../tracks/NoteTrack.js";
import NoteClip from "../clips/NoteClip.js";
import Note from "../clips/NoteTrack/Note.js";


function ultraboxImportFile() {
	return new Promise((res, rej) => {
		const fileInput = new HTML.input({
			type: "file",
			style: "display: none;",
			accept: ".json, application/json"
		});
		fileInput.onchange = () => {
			const reader = new FileReader();
			reader.readAsText(fileInput.files[0]);
			reader.onload = () => {
				let content = reader.result;
				try {
					res(ultraboxImport(JSON.parse(content)));
				} catch(err) {
					alert("Error occurred while attempting to import UltraBox project.");
					rej(err);
				}
			}
			fileInput.remove();
		}
		fileInput.oncancel = () => {
			fileInput.remove();
			rej("Upload cancelled.");
		}
		fileInput.click();
	});
}

function ultraboxImport(project) {
	const song = new Song();
	song.tempo = project.beatsPerMinute;
	song.beatsPerMeasure = project.beatsPerBar;
	
	const tickToFrusicianTime = tick => tick / project.ticksPerBeat / project.beatsPerBar;
	
	for(let [channelId, channel] of Object.entries(project.channels)) {
		switch(channel.type) {
			case "pitch":
				const track = new NoteTrack(song);
				track.name = "Channel "+(Number(channelId)+1);
				
				for(let [patternId, pattern] of Object.entries(channel.patterns)) {
					const clip = new NoteClip(track);
					
					for(let note of pattern.notes) {
						const noteTimes = note.points.map(point => point.tick);
						const startTime = tickToFrusicianTime(Math.min(...noteTimes));
						const endTime = tickToFrusicianTime(Math.max(...noteTimes));
						for(let pitch of note.pitches) {
							clip.notes.push(new Note(clip, pitch + 12, startTime, endTime - startTime))
						}
					}
					
					clip.id = "ub-"+(Number(patternId) + 1);
					track.addClip(clip);
				}
				
				for(let [timeMeasures, patternId] of Object.entries(channel.sequence)) {
					if(patternId == 0) continue;
					const clip = track.clips["ub-"+patternId];
					
					if(!clip) {
						console.error("Clip "+patternId+" not found");
						continue;
					}
					
					const placement = new NoteClip.Placement(clip);
					
					placement.time = Number(timeMeasures);
					placement.duration = 1;
					
					track.addClipPlacement(placement);
				}
				
				song.durationMeasures = Math.max(song.durationMeasures, channel.sequence.length);
				
				break;
		}
	}
	
	return song;
}

export {ultraboxImportFile, ultraboxImport};