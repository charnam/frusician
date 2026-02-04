import TypeCatalog from "../../lib/TypeCatalog.js";

import BasicInstrumentNode from "./BasicInstrumentNode.js";
import JoinerNode from "./JoinerNode.js";
import MainoutputNode from "./MainoutputNode.js";


const nodeCatalog = new TypeCatalog([
	BasicInstrumentNode,
	JoinerNode,
	MainoutputNode
]);

export default nodeCatalog;