var assert = require('assert');

var db = require('./db.js');
assert(db.excuteSql);

var sqlSplitter = require('./sql-splitter.js');
assert(sqlSplitter.subsqlPagination);

function getNewSql(sql, socketReq){
  var pos = 'select'.length;
  return 'select SQL_CALC_FOUND_ROWS' + sql.substr(pos) + sqlSplitter.subsqlPagination(socketReq);
}

/*
 * paginationQuery(socketReq, sql, callback)
 * paginationQuery(socketReq, sql, values, callback)
 */
function paginationQuery(socketReq, sql, arg1, arg2){
  var callback, values;
  var sqlQuery = getNewSql(sql, socketReq);
  var sqlTotal = 'select FOUND_ROWS() as t';
  var rtnObj = {page_number: socketReq.page_number, page_size: socketReq.page_size};
  if(arg2){
    values = arg1;
    callback = arg2;
  }else{
    callback = arg1;
  }
  if(values){
    db.excuteSqls([sqlQuery, sqlTotal], [values, [null]], function(errR1, rowsR1){
      if(errR1){
        return callback(errR1);
      }
      rtnObj.total = rowsR1[1][0].t;
      rtnObj.rows  = rowsR1[0];
      return callback(null, rtnObj);
    });
  }else{
    db.excuteSqls([sqlQuery, sqlTotal], function(errR2, rowsR2){
      if(errR2){
        return callback(errR2);
      }
      rtnObj.total = rowsR2[1][0].t;
      rtnObj.rows  = rowsR2[0];
      return callback(null, rtnObj);
    });
  }
}

module.exports.paginationQuery = paginationQuery;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;