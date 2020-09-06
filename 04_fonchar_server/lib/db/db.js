var assert = require('assert');

var async = require('async');
assert(async.eachOfSeries);

var mysql = require('mysql');
assert(mysql.createPool);

var mLog = require('../../log/log-helper.js');
var logger = mLog.getLogger();
assert(logger.info);

var mErr = require('../err.js');
var errCodes = mErr.codes;
var wrapSSErr = mErr.wrapSSErr;
assert(errCodes);
assert(wrapSSErr);

var dbConfig = require('../../config.js');

var pool = mysql.createPool(dbConfig.DB);

var errMapping = [{raw: 1451, transfered: errCodes.DB_FK_DEL},
                  {raw: 1452, transfered: errCodes.DB_FK_ADD}];

function getErrTransfered(err){
  for(var i = 0; i < errMapping.length; i++){
    if(err.errno == errMapping[i].raw){
      var myErrCode = errMapping[i].transfered;
      return mErr.wrapSSErr(err, myErrCode);
    }
  }
  return null;
}

function checkArgSingle(arg0, arg1, arg2){
  if(!arg0){
    return false;
  }
  if(!arg2){
    return arg1 && arg1 instanceof Function;
  }
  return arg2 instanceof Function && arg1 && arg1 instanceof Array;
}

function checkArgMulti(arg0, arg1, arg2){
  if(!arg0){
    logger.error('!arg0');
    return false;
  }
  if(!(arg0 instanceof Array) || arg0.length == 0){
    logger.error('!(arg0 instanceof Array)');
    logger.error(arg0);
    return false;
  }
  if(arg0.length == 0){
    logger.error('arg0.length == 0');
    return false;
  }
  if(!arg2){
    if(!arg1){
      logger.error('!arg2 && !arg1');
      return false;
    }
    if(!(arg1 instanceof Function)){
      logger.error('!(arg1 instanceof Function)');
      return false;
    }
    return true;
  }
  if(!(arg2 instanceof Function)){
    logger.error('!(arg2 instanceof Function)');
    return false;
  }
  if(!arg1){
    logger.error('!arg1');
    return false;
  }
  if(!(arg1 instanceof Array)){
    logger.error('!(arg1 instanceof Array)');
    return false;
  }
  if(!(arg1[0] instanceof Array)){
    logger.error('!(arg1[0] instanceof Array)');
    return false;
  }
  if(!(arg1[0].length > 0)){
    logger.error('!(arg1[0].length > 0)');
    return false;
  }
  return true;
}

function executeSql(arg0, arg1, arg2){
  var argsParsed = parseArgs(arg0, arg1, arg2);
  var sql = argsParsed.sql, para = argsParsed.para, callback = argsParsed.callback;
  if(!checkArgSingle(arg0, arg1, arg2)){
    return callback('Arg invalid, db.executeSql', errCodes.ARG_CHECK_FAILED);
  }
  if(para){
    excuteSqls([sql], [para], function(err1, rtn1){
      if(err1){
        return callback(err1);
      }
      callback(null, rtn1[0]);
    });
  }else{
    excuteSqls([sql], function(err2, rtn2){
      if(err2){
        return callback(err2);
      }
      callback(null, rtn2[0]);
    });
  }
}

function excuteSqls(arg0, arg1, arg2){
  var rtns = [];
  var argsParsed = parseArgs(arg0, arg1, arg2);
  var sqls = argsParsed.sql, paras = argsParsed.para, callback = argsParsed.callback;
  if(!checkArgMulti(arg0, arg1, arg2)){
    return callback('Arg invalid, db.excuteSqls', errCodes.ARG_CHECK_FAILED);
  }
  pool.getConnection(function(errConn, conn) {
    if (errConn) { // get connection failed
      logger.error('get db connection error');
      logger.error(errConn);
      return callback(wrapSSErr(errConn, errCodes.DB_CONN));
    }
    conn.beginTransaction(function(errBegin){
      if (errBegin) { // start transaction failed
        logger.error('db begin transaction error');
        logger.error(errBegin);
        conn.release();
        return callback(errBegin);
      }
      async.eachOfSeries(sqls, excuteOneSql, allSqlsDone);
    });
    function excuteOneSql(sql, i, oneSqlDone){
      logger.trace('SQL: ' + sql);
      if(paras){
        logger.trace(paras[i]);
        conn.query(sql, paras[i], function(err1, rows1){
          if(err1){
            var myErr1 = getErrTransfered(err1);
            if(myErr1){
              return oneSqlDone(myErr1);
            }
            logger.error('ERROR SQL: ' + sql);
            logger.error(paras[i]);
            return oneSqlDone(err1);
          }
          rtns[i] = rows1;
          return oneSqlDone(null);
        });
      }else{
        conn.query(sql, function(err2, rows2){
          if(err2){
            var myErr2 = getErrTransfered(err2);
            if(myErr2){
              return oneSqlDone(myErr2);
            }
            logger.error('ERROR SQL: ' + sql);
            return oneSqlDone(err2);
          }
          rtns[i] = rows2;
          return oneSqlDone(null);
        });
      }
    }
    function allSqlsDone(errAny){
      if(errAny){
        logger.error(errAny); // log err before exit here, rather than log in innner funcs
        conn.rollback(function(){
          return callback(errAny);
        });
        conn.release();
        return;
      }
      conn.commit(function(errCommit){
        if(errCommit){
          logger.error('db commit transaction error');
          logger.error(errCommit);
          conn.rollback(function() {
            return callback(errCommit);
          });
          conn.release();
          return;
        }
        conn.release();
        return callback(null, rtns);
      });
    }
  });
}

function parseArgs(arg0, arg1, arg2){
  var rtn = {};
  rtn.sql = arg0;
  if(arg2 && Array.isArray(arg1)){
    rtn.para = arg1;
    rtn.callback = arg2;
  }else{
    rtn.callback = arg1;
  }
  return rtn;
}

function recordExists(arg0, arg1, arg2){
  var argsParsed = parseArgs(arg0, arg1, arg2);
  var sql = argsParsed.sql, para = argsParsed.para, callback = argsParsed.callback;
  if(!checkArgSingle(arg0, arg1, arg2)){
    return callback('Arg invalid, db.recordExists', errCodes.ARG_CHECK_FAILED);
  }
  if(para){
    executeSql(sql, para, function(err1, rows1){
      return getExistsResult(err1, rows1, callback);
    });
  }else{
    executeSql(sql, function(err2, rows2){
      return getExistsResult(err2, rows2, callback);
    });
  }
}

function recordExistsMultiSql(sqls, values, callback){
  var foundExistsFlag = 'some exists found';
  async.eachOf(sqls, function(sql, index, oneDone){
    recordExists(sql, values[index], function(err, exists){
      if(err){
        return oneDone(err);
      }
      if(exists){
        return oneDone(foundExistsFlag);
      }
      return oneDone();
    });
  }, function(errAny){
    if(errAny){
      if(errAny == foundExistsFlag){
        return callback(null, true);
      }
      return callback(errAny);
    }
    return callback(null, false);
  });
}

function getExistsResult(err, rows, callback){
  if(err){
    return callback(err);
  }
  if(!rows || rows.length <= 0){
    return callback(null, false);
  }
  return callback(null, true);
}

/*
 * conf = {table_name:*, field_name:*, field_value:*, err_code:*, self_id:*}
 * 其中，self_id可以有（更新时）、可以没有（创建时）
 */
function checkUnique(conf, callback){
  var sql = ['select * from',
             conf.table_name,
             'where',
             conf.field_name,
             '= ?'].join(' ');
  if(conf.self_id){
    sql += ' and id <> ' + conf.self_id; // 为了兼容更新时候的检查
  }
  recordExists(sql, [conf.field_value], function(err, exists){
    if(err){
      return callback(err);
    }
    if(exists){
      return callback(wrapSSErr('Unique check error', conf.err_code));
    }
    return callback(null);
  });
}

/*
 * conf:{table_name:*, fields:[{name:*, value:*}], err_code:*, self_id:*}
 */
function checkUniqueMultiFields(conf, callback){
  var subSql = [], values = [];
  for(var i = 0; i < conf.fields.length; i++){
    subSql.push('and ' + conf.fields[i].name + ' = ?');
    values.push(conf.fields[i].value);
  }
  var sql = ['select * from',
             conf.table_name,
             'where 1 = 1',
             subSql.join(' ')].join(' ');
  if(conf.self_id){
    sql += ' and id <> ' + conf.self_id; // 为了兼容更新时候的检查
  }
  recordExists(sql, values, function(err, exists){
    if(err){
      return callback(err);
    }
    if(exists){
      return callback(wrapSSErr('Unique check error', conf.err_code));
    }
    return callback(null);
  });
}

module.exports.recordExists         = recordExists;
module.exports.recordExistsMultiSql = recordExistsMultiSql;

module.exports.executeSql   = executeSql;
module.exports.excuteSqls  = excuteSqls;

module.exports.checkUnique            = checkUnique;
module.exports.checkUniqueMultiFields = checkUniqueMultiFields;

module.exports.rawPool = pool;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;