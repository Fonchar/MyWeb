var assert = require('assert');

var logger = require('../log/log.js').logger;
assert(logger);

var saveFiles = require('../lib/comm/file-helper.js').saveFiles;

function upload(app){
  const basePath = '/images'
  const prefix = 'images'
  app.post('/upload', (req, res)=>{
    saveFiles.asyncFromDataSave(req, res, basePath, prefix);
  })
}
module.exports = function(app){
  upload(app);
};

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;