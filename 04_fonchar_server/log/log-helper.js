var assert = require('assert');

var log4js = require('log4js');
assert(log4js.configure);

var logConf = require('./log-config.js').config;
log4js.configure(logConf);
var logger = getLoggerV0('FWA', 'ALL');

function obj2StrDiscardObj(o){
  var copied = {};
  for(elem in o){
    if(typeof o[elem] == 'object'){
      continue;
    }
    copied[elem] = o[elem];
  }
  return obj2Str(copied)
}

function obj2Str(o) {
	var r = [];
	if (typeof o == 'string') {
		return '\'' +
		  o.replace(/([\'\'\\])/g, '\\$1').replace(/(\n)/g, '\\n').replace(/(\r)/g, '\\r').replace(/(\t)/g, '\\t') + '\'';
	}
	if (typeof o == 'object' && o != null) {
		if (!o.sort) {
			for (var i in o) {
				r.push(i + ':' + obj2Str(o[i]));
			}
			if (!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
				r.push('toString:' + o.toString.toString());
			}
			r = '{' + r.join() + '}';
		} else {
			for (var j = 0; j < o.length; j++) {
				r.push(obj2Str(o[j]));
			}
			r = '[' + r.join() + ']';
		}
		return r;
	}
	return o == null ? 'null' : o.toString();
}

function getLogger(){
	return logger;
}

function getLoggerV0(catalog, level) {
	var logger = log4js.getLogger(catalog);
	logger.setLevel(level);
	return logger;
}

module.exports.getLogger = getLogger;
module.exports.obj2Str = obj2Str;
module.exports.obj2StrDiscardObj = obj2StrDiscardObj;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;