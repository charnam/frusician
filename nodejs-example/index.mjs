import Song from "../all/Song.js";
import { readFileSync } from 'fs';

console.log("Reading song.fru...");
const file = readFileSync("song.fru").toString();

console.log("Creating Song instance from file content...");
const song = Song.fromFile(file);

console.log("Converting to WAV...");
const wav = song.toWAV(44100);

console.log("Saving as song.wav...");
fs.writeFileSync("song.wav", wav);

console.log("Done.")
