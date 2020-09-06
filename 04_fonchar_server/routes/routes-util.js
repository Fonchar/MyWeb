var assert = require('assert');

var logger = require('log-helper');

var mErr = require('../lib/err.js');
var errCodes = mErr.codes;
assert(errCodes.SUCCESS);

function getCliEnv(req){
  if(!req.user){
    return {};
  }
  return {
    user_id: req.user.id,
    user_name: req.user.name,
    permission: req.user.permission
  };
}

function logReq(req){
  try{
    logger.info('Http post req, url: ' + req.url);
    if(req.user){
      logger.info(req.user);
    }else{
      logger.info('Not user or user not login yet');
    }
    logger.info(req.body);
  }catch(e){
    logger.error(e);
  }
}

function handleErr(e, res){
  logger.error(e);
  logger.error('Res end failed. error code: ' + e.code);
  res.end(e.code);
}

function handleSuccess(res){
  logger.info('Res end successed.');
  return res.end(errCodes.SUCCESS);
}

module.exports.logReq           = logReq;
module.exports.handleErr        = handleErr;
module.exports.handleSuccess    = handleSuccess;
module.exports.getCliEnv        = getCliEnv;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;