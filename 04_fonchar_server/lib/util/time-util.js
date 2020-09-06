var assert = require('assert');

var ms = require('ms');
assert(ms);

var mLog = require('../../log/log-helper.js');
var logger = mLog.getLogger();
assert(logger.info);

function isRecent(aTime, aWindow, aNow){
  try{
    var now = aNow? aNow.getTime(): new Date().getTime();
    var timeValueFromNow = now - new Date(aTime).getTime();
    return aWindow > timeValueFromNow;
  }catch(e){
    logger.error('Time format error');
    logger.error(e);
    return false;
  }
}

module.exports.isRecent = isRecent;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;