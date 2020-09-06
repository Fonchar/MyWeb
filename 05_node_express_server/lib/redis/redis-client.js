var redis = require('redis');

var cli = redis.createClient();

function getCli(){
  return cli;
}

module.exports.getCli = getCli;