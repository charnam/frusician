import TypeCatalog from "../../lib/TypeCatalog.js";

import BasicInstrumentNode from "./BasicInstrumentNode.js";
import BitcrushNode from "./BitcrushNode.js";
import JoinerNode from "./JoinerNode.js";
import MainoutputNode from "./MainoutputNode.js";
import MonoEchoNode from "./MonoEchoNode.js";
import StereoSplitNode from "./StereoSplitNode.js";
import TrackinputNode from "./TrackinputNode.js";
import VibratoNode from "./VibratoNode.js";


const nodeCatalog = new TypeCatalog([
	MainoutputNode,
	TrackinputNode,
	
	BasicInstrumentNode,
	
	JoinerNode,
	StereoSplitNode,
	
	MonoEchoNode,
	VibratoNode,
	BitcrushNode
]);

export default nodeCatalog;