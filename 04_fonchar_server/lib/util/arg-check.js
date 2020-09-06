var assert = require('assert');

var v = require('validator');
assert(v.contains);
assert(v.isLength);
assert(v.isNumeric);
assert(v.isEmail);
assert(v.isIn);
assert(v.isLowercase);
assert(v.isAfter);
assert(v.isBefore);

var ITEM = {
  LEN:             1,
  EMAIL_STYLE:     2,
  FROM_TO:         3,
  IS_NUM:          4,
  IS_LOWER_CASE:   5,
  IS_IN:           6,
  CONTAINS:        7,
  EXISTS:          8,
  MARKETPLACE:     9,
  ARRAY_NOT_NULL: 10,
  IS_INT:         11,
  IS_PHONE:       12
};

function checkFromTo(from, to){
  try{
    if(from && to){
      return new Date(to).getTime() >= new Date(from).getTime();
    }
    if(from){
      return v.isAfter(from, '1970-1-1');
    }
    if(to){
      return v.isBefore(to, '2099-1-1');
    }
    return true;
  }catch(e){
    return false;
  }
}

var IGNORE = -1;
var BAD    = 0;
var GOOD   = 1;

function checkArgNull(obj, fieldName, checkITEM){
  if(fieldName instanceof Object){
    return IGNORE;
  }
  var arg = obj[fieldName];
  if(arg != null && arg != undefined){
    return IGNORE;
  }
  if(checkITEM == ITEM.EXISTS){
    return BAD;
  }
  return GOOD;
}

function check(obj, fieldName, checkITEM, checkOption){
  var checkNull = checkArgNull(obj, fieldName, checkITEM);
  if(checkNull != IGNORE){
    return checkNull == BAD? false: true;
  }

  var arg = obj[fieldName];
  switch(checkITEM){
    case ITEM.LEN:
      return v.isLength(arg, checkOption);
    case ITEM.EMAIL_STYLE:
      return v.isEmail(arg);
    case ITEM.FROM_TO:
      var from = obj[fieldName.from];
      var to = obj[fieldName.to];
      return checkFromTo(from, to);
    case ITEM.IS_NUM:
      return v.isNumeric(arg);
    case ITEM.IS_LOWER_CASE:
      return v.isLowercase(arg);
    case ITEM.IS_IN:
      return v.isIn(arg, checkOption);
    case ITEM.CONTAINS:
      return v.contains(arg, checkOption);
    case ITEM.EXISTS:
      return arg != null && arg != undefined;
    case ITEM.ARRAY_NOT_NULL:
      return arg && arg.length > 0;
    case ITEM.IS_INT:
      return v.isInt(arg, checkOption);
    case ITEM.IS_PHONE:
      return v.isMobilePhone(arg, 'zh-CN');
    default:
      return false;
  }
}

module.exports.ITEM  = ITEM;
module.exports.check = check;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;