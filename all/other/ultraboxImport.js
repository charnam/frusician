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
	const octave = (project.keyOctave ?? 0) + 1;
	const offset = (octave * 12) + ["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"].indexOf(project.key);
	
	const tickToFrusicianTime = tick => tick / project.ticksPerBeat / project.beatsPerBar;
	
	for(let [channelId, channel] of Object.entries(project.channels)) {
		if(!channel.sequence.some(pattern => pattern !== 0)) continue;
		
		switch(channel.type) {
			case "pitch":
				const track = new NoteTrack(song);
				track.name = "Channel "+(Number(channelId)+1);
				
				
				let patternSequences = [];
				let patternSequenceClips = [];
				let currentPatternSequence = [];
				for(let patternId of channel.sequence) {
					if(patternId == 0) {
						if(currentPatternSequence.length > 0) {
							patternSequences.push(currentPatternSequence);
							currentPatternSequence = [];
						}
						continue;
					}
					currentPatternSequence.push(patternId);
				}
				if(currentPatternSequence.length > 0) {
					patternSequences.push(currentPatternSequence);
				}
				
				for(let index in channel.patterns) {
					const patternId = index + 1;
					if(patternSequences.filter(sequence => sequence.includes(patternId)).length > 1) {
						for(let sequenceIndex in patternSequences) {
							const sequence = patternSequences[sequenceIndex];
							const indexOfPatternId = sequence.indexOf(patternId)
							if(indexOfPatternId > -1) {
								delete patternSequences[sequenceIndex];
								patternSequences[sequenceIndex] = sequence.slice(0,indexOfPatternId);
								patternSequences.push(sequence.slice(indexOfPatternId+1));
							}
						}
						patternSequences.push([patternId]);
					}
				}
				patternSequences = patternSequences.filter(sequence => Array.isArray(sequence) && sequence.length > 0);
				
				for(let sequence in patternSequences) {
					
					for(let sequenceId of sequence) {
						
					}
					
				}
				
				for(let [timeMeasures, patternId] of Object.entries(channel.sequence)) {
					if(patternId == 0) continue;
					let clip = track.clips["ub-"+patternId];
					
					if(!clip) {
						clip = new NoteClip(track);
						
						for(let note of channel.patterns[patternId-1].notes) {
							const noteTimes = note.points.map(point => point.tick);
							const startTime = tickToFrusicianTime(Math.min(...noteTimes));
							const endTime = tickToFrusicianTime(Math.max(...noteTimes));
							for(let pitch of note.pitches) {
								clip.notes.push(new Note(clip, pitch + offset, startTime, endTime - startTime))
							}
						}
						clip.name = "Pattern "+(Number(patternId) + 1);
						track.addClip(clip);
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