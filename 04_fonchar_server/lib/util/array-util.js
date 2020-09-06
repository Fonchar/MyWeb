function concatArrayFrom2DTo1D(array2D) {
	var array1D = [];
	for(var i = 0; i < array2D.length; i++) {
		array1D = array1D.concat(array2D[i]);
	}
	return array1D;
}

function clone(array) {
	var cloned = [];
	for(var i = 0; i < array.length; i++){
		cloned.push(array[i]);
	}
	return cloned;
}

function concat(array1, array2){
	var array = clone(array1);
	for(var i = 0; i < array2.length; i++){
		array.push(array2[i]);
	}
	return array;
}

function concatNoRtn(arraySea, arrayRiver){
  for(var i = 0; i < arrayRiver.length; i++){
    arraySea.push(arrayRiver[i]);
  }
}

function slice(array, item){
	var newArray = [];
	for(var i = 0; i < array.length; i++){
		if(array[i] != item) {
			newArray.push(array[i]);
		}
	}
	return newArray;
}

function foundInArray(array, item){
	for(var i = 0; i < array.length; i++){
		if(item == array[i]){
			return true;
		}
	}
	return false;
}

function removeRepeat(a){
  var b = [];
  for(var i = 0; i < a.length; i++){
    var aI = a[i];
    var found = false;
    for(var j = 0; j < b.length; j++){
      if(b[j] == aI){
        found = true;
      }
    }
    if(!found){
      b.push(aI);
    }
  }
  return b;
}

function reverse(a){
  var b = [];
  for(var i = a.length - 1; i >= 0; i--){
    b.push(a[i]);
  }
  return b;
}

function getAve(a){
  var sum = 0;
  var num = 0;
  try{
    for(var i = 0; i < a.length; i++){
      if(isNaN(a[i])){
        continue;
      }
      if(!a[i] && typeof a[i] != 'number'){
        continue;
      }
      sum += a[i];
      num++;
    }
    if(sum == 0){
      return 0;
    }
    return sum / num;
  }catch(e){
    return -1;
  }
}

module.exports.concatArrayFrom2DTo1D = concatArrayFrom2DTo1D;
module.exports.clone                 = clone;
module.exports.concat                = concat;
module.exports.slice                 = slice;
module.exports.foundInArray          = foundInArray;
module.exports.removeRepeat          = removeRepeat;
module.exports.reverse               = reverse;
module.exports.getAve                = getAve;
module.exports.concatNoRtn           = concatNoRtn;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;