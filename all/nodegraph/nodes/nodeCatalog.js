import TypeCatalog from "../../lib/TypeCatalog.js";

import BitcrushNode from "./BitcrushNode.js";
import ChipInstrumentNode from "./InstrumentNodes/ChipInstrumentNode/ChipInstrumentNode.js";
import JoinerNode from "./JoinerNode.js";
import MainoutputNode from "./MainoutputNode.js";
import MonoEchoNode from "./MonoEchoNode/MonoEchoNode.js";
import PlaybackinputNode from "./PlaybackinputNode.js";
import SampledInstrumentNode from "./InstrumentNodes/SampledInstrumentNode/SampledInstrumentNode.js";
import StereoSplitNode from "./StereoSplitNode.js";
import TrackinputNode from "./TrackinputNode.js";
import VibratoNode from "./VibratoNode/VibratoNode.js";


const nodeCatalog = new TypeCatalog([
	MainoutputNode,
	TrackinputNode,
	PlaybackinputNode,
	
	SampledInstrumentNode,
	ChipInstrumentNode,
	
	JoinerNode,
	StereoSplitNode,
	
	MonoEchoNode,
	VibratoNode,
	BitcrushNode
]);

export default nodeCatalog;