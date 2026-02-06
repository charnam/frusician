import PlaybackInstance from "../../../playback/PlaybackInstance.js";
import InputNodeValue from "./InputNodeValue.js";

class PlaybackInstanceInputNodeValue extends InputNodeValue {
	static default = new PlaybackInstance();
	
	type = "playbackInstance";
	color = 300;
	default = PlaybackInstanceInputNodeValue.default;
}

export default PlaybackInstanceInputNodeValue;