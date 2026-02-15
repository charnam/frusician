import TypeCatalog from "../../lib/TypeCatalog.js";

import BasicInstrumentNode from "./BasicInstrumentNode.js";
import BitcrushNode from "./BitcrushNode.js";
import JoinerNode from "./JoinerNode.js";
import MainoutputNode from "./MainoutputNode.js";
import MonoEchoNode from "./MonoEchoNode/MonoEchoNode.js";
import PlaybackinputNode from "./PlaybackinputNode.js";
import StereoSplitNode from "./StereoSplitNode.js";
import TrackinputNode from "./TrackinputNode.js";
import VibratoNode from "./VibratoNode/VibratoNode.js";


const nodeCatalog = new TypeCatalog([
	MainoutputNode,
	TrackinputNode,
	PlaybackinputNode,
	
	BasicInstrumentNode,
	
	JoinerNode,
	StereoSplitNode,
	
	MonoEchoNode,
	VibratoNode,
	BitcrushNode
]);

export default nodeCatalog;