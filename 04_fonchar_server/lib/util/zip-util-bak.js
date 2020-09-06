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
  console.log('fullPathName');
  console.log(fullPathName);
  fs.mkdirSync(fullPathName);
  for(var i = 0; i < urlList.length; i++){
    var pureFileName = getPureFileNameInUrl(urlList[i]);
    console.log('pureFileName');
    console.log(pureFileName);
    var sourceFullFileName = getServerUrlByClient(urlList[i]);
    console.log('sourceFullFileName');
    console.log(sourceFullFileName);
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

function getPathServer(){
  var relatedPath = '../../public/files/test-log/';
  return path.resolve(__dirname, relatedPath);
}

function getPathClient(){
  return '/files/test-log/';
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
    console.log('000000000000');
    var purePathName = handleDir(urlList);
    console.log('7777777777777');
    console.log('执行到这里了');
    makeZip(purePathName, dirNameInZip, callback);
  }catch(e){
    return callback(e);
  }
}

module.exports.outputZip = outputZip;
module.exports.getPathServer = getPathServer;
module.exports.getServerUrlByClient = getServerUrlByClient;
module.exports.getPathClient = getPathClient;
function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;