var assert = require('assert');

var db = require('./db.js');
assert(db.excuteSql);

var arrayUtil = require('../util/array-util.js');
assert(arrayUtil.concat);

var mLog = require('../../log/log-helper.js');
var logger = mLog.getLogger();
assert(logger.info);

//field names in db are as same as the ones in object
function getSimpleTbOp(tableName, fieldNames){
	return new TbOp(tableName, fieldNames, fieldNames);
}

function getTbOp(tableName, fieldNamesInDb, fieldNamesInObj){
	return new TbOp(tableName, fieldNamesInDb, fieldNamesInObj);
}

function TbOp(tableName, fieldNamesInDb, fieldNamesInObj){
//id int auto_increment primary key

	this.add            = add;
  this.addIfNotExists = addIfNotExists;
  this.update         = update;
  this.remove         = remove;
  this.show           = show;
  this.queryAll       = queryAll;
  this.sqlAdd         = sqlAdd;
  this.sqlUpdate      = sqlUpdate;
  this.sqlRemove      = sqlRemove;
  this.getIdByField   = getIdByField;

  function getIdByField(fieldName, fieldValue, callback){
    if(!fieldValue){
      return callback(null, null);
    }
    var sql = ['select id from',
               tableName,
               'where ' + fieldName + ' = ?'].join(' ');
    db.excuteSql(sql, [fieldValue], function(err, rows){
      if(err){
        return callback(err);
      }
      if(!rows.length){
        return callback(null, null);
      }
      callback(null, rows[0].id);
    });
  }
	function add(obj, callback) {
		var paraValues = getFieldValues(obj, fieldNamesInObj);
		db.excuteSql(sqlAdd(), paraValues, function(err, rows) {
			if(err){
				return callback(err);
			}
			callback(null, {id: rows.insertId});
		});
	}
	function addIfNotExists(obj, repeatCheckFieldNamesInDb, repeatCheckFieldNamesInObj, callback){
		var paraValues = getFieldValues(obj, fieldNamesInObj);
		var specialFieldValues = getFieldValues(obj, repeatCheckFieldNamesInObj);
		paraValues = arrayUtil.concat(paraValues, specialFieldValues);
		db.excuteSql(sqlAddIfNotExists(repeatCheckFieldNamesInDb), paraValues, function(err, rows) {
			if(err){
				return callback(err);
			}
			logger.trace('affectedRows: ' + rows.affectedRows);
			callback(null, {id: rows.insertId});
		});
	}
	function update(obj, callback) {
		var paraValues = getFieldValues(obj, fieldNamesInObj);
		paraValues.push(obj.id);
		db.excuteSql(sqlUpdate(), paraValues, function(err, rows) {
			if(err){
				return callback(err);
			}
			callback(null, {});
		});
	}
	function remove(obj, callback) {
		db.excuteSql(sqlRemove(), [obj.id], function(err, rows) {
			if(err){
				return callback(err);
			}
			callback(null, {});
		});
	}
	function show(obj, callback) { // 通过id查单条记录
		db.excuteSql(sqlShow(), [obj.id], function(err, rows) {
			if(err){
				return callback(err);
			}
			if(rows.length == 0) {
				return callback(null, null);
			}
			callback(null, rows[0]);
		});
	}
	function queryAll(obj, callback) {
		db.excuteSql(sqlQueryAll(), function(err, rows) {
			if(err){
				return callback(err);
			}
			callback(null, {rows: rows});
		});
	}
	function sqlQueryAll() {
		return ['select id,',
				 fieldNamesInDb.join(', '),
				 'from',
				 tableName].join(' ');
	}
	function sqlAdd() {
		var sql = 'insert into ' + tableName + ' (' + fieldNamesInDb.join(', ') + ') values(?';
		for(var i = 0; i < fieldNamesInDb.length - 1; i++){
			sql += ', ?';
		}
		sql += ')';
		return sql;
	}
	function sqlAddIfNotExists(repeatCheckFieldNamesInDb) {
		var sql = 'insert into ' + tableName + ' (' + fieldNamesInDb.join(', ')	+ ')  select ?';
		for(var i = 1; i < fieldNamesInDb.length; i++){
			sql += ', ?';
		}
		sql += ' from dual where not exists (select 1 from ' + tableName + ' where '
		      + repeatCheckFieldNamesInDb[0] + ' = ?';
		for(var j = 1; j < repeatCheckFieldNamesInDb.length; j++){
			sql += ' and ' + repeatCheckFieldNamesInDb[j] + ' = ?';
		}
		sql += ')';
		return sql;
	}
	function sqlUpdate() {
		var sql = 'update ' + tableName + ' set ' + fieldNamesInDb[0] + ' = ?';
		for(var i = 1; i < fieldNamesInDb.length; i++){
			sql += ', ' + fieldNamesInDb[i] + ' = ?';
		}
		sql += ' where id = ?';
		return sql;
	}
	function sqlRemove() {
		return 'delete from ' + tableName + ' where id = ? ';
	}
	function sqlShow() {
		return 'select id, ' + fieldNamesInDb.join(', ') + ' from ' + tableName + ' where id = ?';
	}
}

function getFieldValues(obj, fieldNames) {
	var values = [];
	for (var i = 0; i < fieldNames.length; i++) {
		var itemValueI = getItemValueFromObj(obj, fieldNames[i]);
		values.push(itemValueI);
	}
	return values;
}

function getItemValueFromObj(obj, itemName) {
	if(!obj) {
		return null;
	}
	var itemValue = obj[itemName];
	if(typeof itemValue == 'number' && 0 == itemValue){
	  return 0;
	}
	if(!itemValue){
		return null;
	}
	return itemValue;
}

module.exports.getTbOp        = getTbOp;
module.exports.getSimpleTbOp  = getSimpleTbOp;
module.exports.getFieldValues = getFieldValues;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;