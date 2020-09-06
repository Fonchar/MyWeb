var assert = require('assert');

var fs = require('fs');
assert(fs.existsSync);

var path = require('path');

var random = require('random-js')();
assert(random);

var mErr = require('../err.js');
var errCodes = mErr.codes;
assert(errCodes);
var wrapSSErr = mErr.wrapSSErr;
assert(wrapSSErr);

var mLog = require('../../log/log-helper.js');
var logger = mLog.getLogger();
assert(logger.info);

function makeRandomStr(){
  return new Date().getTime() + '-' + random.integer(1000, 9999);
}

function getFileUrlClient(basePath, pathName, fileName){
  return '/files/' + basePath + '/' + pathName + '/' + fileName;
}

function getFileUrlServer(basePath, pathName, fileName){
  return getPathUrlServer(basePath, pathName) + '/' + fileName;
}

function getPathUrlServer(basePath, pathName){
  var relativePath = '../../public/files/' + basePath + '/' + pathName;
  return path.resolve(__dirname, relativePath);
}

function makeDir(pathUrlServer, callback){
  try{
    if(fs.existsSync(pathUrlServer)){
      return callback();
    }
    fs.mkdir(pathUrlServer, callback);
  }catch(e){
    return callback(wrapSSErr(e, errCodes.FILE_OP_ERROR));
  }
}

function saveFileToPath(basePath, file, fileName, callback){
  var pathName = makeRandomStr();
  var pathUrlServer = getPathUrlServer(basePath, pathName);
  makeDir(pathUrlServer, function(errD){
    if(errD){
      return callback(errD);
    }
    var fileUrlServer = getFileUrlServer(basePath, pathName, fileName);
    var fileUrlClient = getFileUrlClient(basePath, pathName, fileName);
    fs.writeFile(fileUrlServer, file, function(err) {
      if(err){
        return callback(err);
      }
      return callback(null, fileUrlClient);
    });
  });
}

const  mkdir = function(dir){
  return new Promise((resolve,reject) => {
      fs.mkdir(dir, {recursive: true}, (err) => {
          if(err){
            return reject(wrapSSErr('ERROR: Folder creation failed',errCodes.MAKE_DIR_ERROR));
          }
          resolve(true);
      });
  });
};

const readFile = function(filePath){
  return new Promise((resolve, reject) => {
    fs.readFile(filePath,(err, data) => {
      if(err){
        return reject(wrapSSErr('ERROR: File read failed',errCodes.READ_FILE_ERROR));
      }
      resolve(data);
    });
  });
};

module.exports.mkdir = mkdir;
module.exports.readFile = readFile;
module.exports.saveFileToPath = saveFileToPath;
function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;