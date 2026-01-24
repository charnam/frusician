
class TypeCatalog {
	all = [];
	byTypeID = {};
	
	constructor(types) {
		for(let type of types) {
			this.all.push(type);
			this.byTypeID[type.typeID] = type;
		}
	}
	
	fromSerialized(object, ...otherData) {
		if(!object.typeID)
			throw new Error("Object.typeID is not a valid string value!");
		
		if(!this.byTypeID[object.typeID])
			throw new Error("No valid object for typeID "+object.typeID+" found");
		
		return this.byTypeID[object.typeID].fromSerialized(object, ...otherData);
	}
}

export default TypeCatalog;