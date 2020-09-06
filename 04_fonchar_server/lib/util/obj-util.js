function getItemValueFromObj(obj, itemName) {
	if(!obj) {
		return null;
	}
	var itemValue = obj[itemName];
	if(!itemValue){
		return null;
	}
	return itemValue;
}

function getItemValuesFromObj(obj, itemNames) {
	var values = [];
	for(var i = 0; i < itemNames.length; i++) {
		var itemValueI = getItemValueFromObj(obj, itemNames[i]);
		values.push(itemValueI);
	}
	return values;
}

function simpleCloneII(objS, fieldsS, fieldsO) {
	var objO = {};
	for(var i = 0; i < fieldsS.length; i++){
		objO[fieldsO[i]] = objS[fieldsS[i]];
	}
	return objO;
}

function simpleClone(objS, fields) {
	return simpleCloneII(objS, fields, fields);
}

function clone(obj) {
	var o;
	switch (typeof obj) {
		case 'undefined':
			break;
		case 'string':
			o = String(obj);
			break;
		case 'number':
			o = obj - 0;
			break;
		case 'boolean':
			o = obj;
			break;
		case 'object':
			if (obj === null) {
				o = null;
			} else if (obj instanceof Array) {
				o = [];
				for (var i = 0, len = obj.length; i < len; i++) {
					o.push(clone(obj[i]));
				}
			} else {
				o = {};
				for (var k in obj) {
					o[k] = clone(obj[k]);
				}
			}
			break;
	default:
		o = obj;
			break;
	}
	return o;
}

function itemCount(o){
  var c = 0;
  for(var i in o){
    if(o.hasOwnProperty(i)){
      c++;
    }
  }
  return c;
}

module.exports.itemCount = itemCount;
module.exports.getItemValueFromObj = getItemValueFromObj;
module.exports.getItemValuesFromObj = getItemValuesFromObj;
module.exports.clone = clone;
module.exports.simpleClone = simpleClone;
module.exports.simpleCloneII = simpleCloneII;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;