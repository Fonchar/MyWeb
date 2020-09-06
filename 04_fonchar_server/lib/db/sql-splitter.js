function subsqlFuzzySearch(obj, fieldName) {
  return subsqlFuzzySearchV0(obj, fieldName, fieldName);
}

function subsqlFuzzySearchV0(obj, fieldNameInObj, fieldNameInQuery) {
  var str = obj[fieldNameInObj];
  if(str) {
    str = new String(str);
    return ' and ' + fieldNameInQuery + ' like \'%' + str.trim() + '%\'';
  }
  return '';
}

function subsqlAOrBEqual(obj, fieldNameInObj, fieldNameA, fieldNameB, needQuote){ // and (a = 2 or b = 2)
  var subsqlWhere = '';
  if(obj[fieldNameInObj]) {
    subsqlWhere += ' and (' + fieldNameA + ' = ';
    if(needQuote) {
      subsqlWhere += '"' + obj[fieldNameInObj] + '"';
    } else {
      subsqlWhere += obj[fieldNameInObj];
    }
    subsqlWhere += ' or ' + fieldNameB + ' = ';
    if(needQuote) {
      subsqlWhere += '"' + obj[fieldNameInObj] + '"';
    } else {
      subsqlWhere += obj[fieldNameInObj];
    }
    subsqlWhere += ')';
  }
  return subsqlWhere;
}

function subsqlEqual(obj, fieldName, needQuote) { // and a = 2
  return subsqlEqualV0(obj, fieldName, fieldName, needQuote);
}

function subsqlEqualV0(obj, fieldNameInObj, fieldNameInQuery, needQuote) { // and a = 2
  var subsqlWhere = '';
  if(obj[fieldNameInObj]) {
    subsqlWhere += ' and ' + fieldNameInQuery + ' = ';
    if(needQuote) {
      subsqlWhere += '"' + obj[fieldNameInObj] + '"';
    } else {
      subsqlWhere += obj[fieldNameInObj];
    }
  }
  return subsqlWhere;
}

function subsqlEqualV1(obj, fieldNameInObj, fieldNameInQuery, needQuote) { // and a = 2
  var subsqlWhere = '';
  if(obj[fieldNameInObj]) {
    subsqlWhere += ' and (' + fieldNameInQuery + ' = ';
    if(needQuote) {
      subsqlWhere += '"' + obj[fieldNameInObj] + '" or ' + fieldNameInQuery + ' is null)';
    } else {
      subsqlWhere += obj[fieldNameInObj] + ' or ' + fieldNameInQuery + ' is null)';
    }
  }
  return subsqlWhere;
}

function subsqlMulti(obj, fieldName, needQuote){ // and a = 2 or a = 4
  return subsqlMultiV0(obj, fieldName, fieldName, needQuote);
}

function subsqlMultiV0(obj, fieldNameInObj, fieldNameInQuery, needQuote){
  var subsql = '';
  var mergedValue = obj[fieldNameInObj];
  if(mergedValue){
    var values = mergedValue.split(',');
    subsql += ' and (' + fieldNameInQuery + ' = ';
    if(needQuote){
      subsql += '"' + values[0].trim() + '"';
    }else{
      subsql += values[0].trim();
    }
    for(var i = 1; i < values.length; i++){
      subsql += ' or ' + fieldNameInQuery;
      if(values[i].trim() == 'null' || values[i].trim() == 'NULL'){
        subsql += ' is null';
        continue;
      }
      if(needQuote){
        subsql += ' = "' + values[i].trim() + '"';
      }else{
        subsql += ' = ' + values[i].trim();
      }
    }
    subsql += ')';
  }
  return subsql;
}

function subsqlPagination(obj, pageSizeFieldName, pageNumberFieldName) { // limit 0, 10
  if(!pageSizeFieldName || !pageNumberFieldName){
    pageSizeFieldName = 'page_size';
    pageNumberFieldName = 'page_number';
  }
  var valuePageNumber = obj[pageNumberFieldName];
  var valuePageSize = obj[pageSizeFieldName];
  var pageNumber = 1, pageSize = 10;
  if(valuePageSize){
    pageNumber = parseInt(valuePageNumber, 10);
    pageSize = parseInt(valuePageSize, 10);
  }
  return ' limit ' + (pageNumber - 1) * pageSize + ', ' + pageSize;
}

function subsqlFromTo(obj, fieldInDb, fromInObj, toInObj){ // and t >= '2015-1-1' and t <= '2015-2-2'
  var fieldNameFrom = fromInObj? fromInObj: 'from';
  var fieldNameTo = toInObj? toInObj: 'to';
  var from = obj[fieldNameFrom];
  var to   = obj[fieldNameTo];
  var subsql = ' and ';
  if(from){
    from += ' 00:00:00';
    subsql += fieldInDb + ' >= "' + from + '" and ';
  }
  if(to){
    to += ' 23:59:59';
    subsql += fieldInDb + ' <= "' + to + '" and ';
  }
  subsql += '1=1';
  return subsql;
}

function subsqlInDays(field, days){
  return ' and date_sub(curdate(), interval ' + days + ' day) <= ' + field;
}

function subsqlNull(obj, fieldInQuery, fieldInDb){
  if(obj[fieldInQuery] == '1'){
    return ' and (' + fieldInDb + ' is not null and ' + fieldInDb + ' <> "")';
  }
  if(obj[fieldInQuery] == '0'){
    return ' and (' + fieldInDb + ' is null or ' + fieldInDb + ' = "")';
  }
  return '';
}

module.exports.subsqlFuzzySearch   = subsqlFuzzySearch;
module.exports.subsqlFuzzySearchV0 = subsqlFuzzySearchV0;
module.exports.subsqlEqual         = subsqlEqual;
module.exports.subsqlEqualV0       = subsqlEqualV0;
module.exports.subsqlAOrBEqual     = subsqlAOrBEqual;
module.exports.subsqlPagination    = subsqlPagination;
module.exports.subsqlMulti         = subsqlMulti;
module.exports.subsqlMultiV0       = subsqlMultiV0;
module.exports.subsqlFromTo        = subsqlFromTo;
module.exports.subsqlInDays        = subsqlInDays;
module.exports.subsqlNull          = subsqlNull;
module.exports.subsqlEqualV1       = subsqlEqualV1;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;