var assert = require('assert');

var fs = require('fs');
assert(fs);
assert(fs.copyFileSync);

var path = require('path');
assert(path);

var archiver = require('archiver');
assert(archiver);

var mLog = require('../../log/log-helper.js');
var logger = mLog.getLogger();
assert(logger.info);

function handleDir(urlList){
  if(!urlList || !urlList.length){
    return null;
  }
  var purePathName = new Date().getTime();
  var fullPathName = getPathServer() + purePathName;
  fs.mkdirSync(fullPathName);
  for(var i = 0; i < urlList.length; i++){
    var pureFileName = getPureFileNameInUrl(urlList[i]);
    var sourceFullFileName = getServerUrlByClient(urlList[i]);
    var destFullFileName = fullPathName + '/' + pureFileName;
    fs.copyFileSync(sourceFullFileName, destFullFileName);
  }
  return purePathName;
}

function getServerUrlByClient(clientUrl){
  var url = '../../public' + clientUrl;
  return path.resolve(__dirname, url);
}

function getPureFileNameInUrl(url){
  var p = url.lastIndexOf('/');
  return url.substr(p + 1);
}

function getPathServer() {
  var relativePath = '../../public/files/zip/';
  return path.resolve(__dirname, relativePath) + '/';
}

function getPathClient(){
  return '/files/zip/';
}

function makeZip(purePathName, dirNameInZip, callback){
  if(!purePathName){
    return callback(null, {});
  }
  var zipFileName = purePathName + '.zip';
  var zipUrlServer = getPathServer() + zipFileName;
  var zipUrlClient = getPathClient() + zipFileName;
  var output = fs.createWriteStream(zipUrlServer);
  var archive = archiver('zip');
  output.on('close', function(){
    try{
      removeDir(purePathName);
      return callback(null, {url: zipUrlClient}); // exit
    }catch(e3){
      return callback(e3);
    }
  });
  archive.on('error', function(e1){
    logger.error(e1);
    return callback(e1);
  });
  archive.on('warning', function(e2){
    logger.warn(e2);
  });
  archive.pipe(output);
  archive.directory(getPathServer() + purePathName, dirNameInZip);
  archive.finalize();
}

function removeDir(purePathName){
  var fullPathUrl = getPathServer() + purePathName;
  var files = fs.readdirSync(fullPathUrl);
  files.forEach(function(file, index){
    fs.unlinkSync(fullPathUrl + '/' + file);
  });
  fs.rmdirSync(fullPathUrl);
}

function outputZip(urlList, dirNameInZip, callback){
  try{
    var purePathName = handleDir(urlList);
    makeZip(purePathName, dirNameInZip, callback);
  }catch(e){
    logger.error(e);
    return callback(e);
  }
}

module.exports.outputZip = outputZip;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;