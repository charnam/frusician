import TypeCatalog from "../../lib/TypeCatalog.js";

import BasicInstrumentNode from "./BasicInstrumentNode.js";
import JoinerNode from "./JoinerNode.js";
import MainoutputNode from "./MainoutputNode.js";
import MonoEchoNode from "./MonoEchoNode.js";
import StereoSplitNode from "./StereoSplitNode.js";
import StereoVolumeNode from "./StereoVolumeNode.js";
import TrackinputNode from "./TrackinputNode.js";
import VibratoNode from "./VibratoNode.js";
import VolumeNode from "./VolumeNode.js";


const nodeCatalog = new TypeCatalog([
	BasicInstrumentNode,
	JoinerNode,
	MainoutputNode,
	MonoEchoNode,
	//VolumeNode,
	//StereoVolumeNode,
	StereoSplitNode,
	TrackinputNode,
	VibratoNode
]);

export default nodeCatalog;