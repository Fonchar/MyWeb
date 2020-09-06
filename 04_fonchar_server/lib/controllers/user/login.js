var assert = require('assert');
var loger = require('log-helper');
var md5 = require('md5');
var Base64 = require('js-base64').Base64;

var http = require('http');
var querystring = require('querystring');

var xml2js = require('xml2js');
var Builder = new xml2js.Builder({ renderOpts: { 'pretty': false, 'indent': ' ', 'newline': '\n' } });  // json->xml (并取消美化)
var Parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });   //xml -> json (取消强制数组化)

var mConst = require('../../const.js');

var db = require('../../db/db.js');
assert(db.executeSql);
assert(db.checkUniqueMultiFields);

var dbUtil = require('../../db/db-util.js');
assert(dbUtil.paginationQuery);

var sqlSplitter = require('../../db/sql-splitter.js');
assert(sqlSplitter.subsqlFuzzySearch);
assert(sqlSplitter.subsqlEqual);

var mTbOp = require('../../db/tb-op.js');
assert(mTbOp.getSimpleTbOp);

var querystring = require('querystring');
var dateFormat = require('dateformat');


function login(req, res) {
  let sqls = [], vals = [];
  handedSqlGetUerInfo(sqls, vals);
  db.excuteSqls(sqls, vals, function (err, data) {
    if (err) {
      loger.error(err)
    }
    if (data.length > 0) {
      pushAllData(data)
    }
  })
}


function handedSqlGetUerInfo(sqls, vals) {
  let sql = [
    'select * from user',
    'where name = ? and password = ? and role = ?',
  ].join(' ');
  let val = [vals.name, vals.md_pw, mConst.ADMIN_ROLE]; //通过标志查询
  sqls.push(sql);
  vals.push(val);
}
