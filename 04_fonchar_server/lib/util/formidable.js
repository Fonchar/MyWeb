const formidable = require('formidable');
const assert = require('assert');
const fs = require('fs');

var mErr = require('../err.js');
var errCodes = mErr.codes;
assert(errCodes);
var wrapSSErr = mErr.wrapSSErr;
assert(wrapSSErr);

/**
 * @param {Object} req request对象
 * @param {String} dir 文件保存路径
 */
let formidableGetData = function (req, dir, rename = false){
  return new Promise((resolve, reject) => {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = dir;
    form.keepExtensions = true;
    if(rename){
      form.on('file', function(field, file) {
        //rename the incoming file to the file's name
        fs.rename(file.path, form.uploadDir + '/' + file.name, (err) => {
          if(err){
            return reject(wrapSSErr('ERROR: File rename failed',errCodes.RENAME_FILE_ERROR));
          }
        });
      });
    }
    form.parse(req, function(err, fields, files) {
      if(err){
        return reject(wrapSSErr('ERROR: File upload failed',errCodes.UPLOAD_FILE_ERROR));
      }
      resolve({fields,files});
    });
  });
};

// form.on('file', function(field, file) {
//   fs.rename(file.path, form.uploadDir + '/' + file.name, (err) => {
//     //rename the incoming file to the file's name
//     console.log(err);
//   });
// });
module.exports = formidableGetData;