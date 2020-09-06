var assert = require('assert');

var async = require('async');
assert(async.each);

var mRedis = require('../redis/redis-client.js');
assert(mRedis.getCli);
var redisCli = mRedis.getCli();

function getAllRedisKeysSess(callback){
  redisCli.keys('sess:*', function(err, keys){
    if(err){
      return callback(err);
    }
    if(null == keys){
      return callback(wrapSSErr('Redis error', errCodes.REDIS_OP));
    }
    return callback(null, keys);
  });
}

function kickLoginSession(userName, callback){
  var foundFlag = 'Yeah, found!';
  getAllRedisKeysSess(function(errA, keys){
    if(errA){
      return callback(errA);
    }
    async.each(keys, function(key, oneKeyDone){
      redisCli.get(key, function(errG, val){
        if(errG){
          return oneKeyDone(errG);
        }
        if(val.indexOf(userName) != -1){ // found, so this userName has login info in session
          redisCli.del(key);
          return oneKeyDone(foundFlag);
        }
        return oneKeyDone(null);
      });
    }, function(errAny){
      if(errAny){
        if(errAny == foundFlag){
          return callback(null);
        }
        return callback(errAny);
      }
      return callback(null);
    });
  });
}

module.exports.kickLoginSession = kickLoginSession;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;