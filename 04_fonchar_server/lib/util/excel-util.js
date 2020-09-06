const assert = require('assert');

const mLog = require('../../log/log-helper.js');
const logger = mLog.getLogger();
assert(logger.info);
assert(logger.warn);

const mErr = require('../err.js');
assert(mErr.SSErr);
assert(mErr.codes);

const mArrayUtil = require('./array-util.js');
assert(mArrayUtil.removeRepeat);

const BAD_VALUE = null;

const EXCEL_CELL_TYPE = {
  Null: 0,
  Merge: 1,
  Number: 2,
  String: 3,
  Date: 4,
  Hyperlink: 5,
  Formula: 6,
  SharedString: 7,
  RichText: 8,
  Boolean: 9,
  Error: 10
};

function getCellValue(excelCell){
  try{
    if(excelCell.type == EXCEL_CELL_TYPE.String){
      return excelCell.value.trim();
    }
    if(excelCell.type == EXCEL_CELL_TYPE.Number){
      return excelCell.value;
    }
    if(excelCell.type == EXCEL_CELL_TYPE.Formula){
      let result = excelCell.value.result;
      if(typeof(result) == 'string'){
        if(result.trim() == ''){
          return null;
        }
        return result.trim();
      }
      return result;
    }
    if(excelCell.type == EXCEL_CELL_TYPE.RichText){
      let buffer = [];
      let rich = excelCell.value.richText;
      for(let i = 0; i < rich.length; i++){
        buffer.push(rich[i].text.trim());
      }
      if(!buffer.length){
        return null;
      }
      return buffer.join('');
    }
    if(excelCell.type == EXCEL_CELL_TYPE.Error){
      return null;
    }
    if(excelCell.type == EXCEL_CELL_TYPE.Hyperlink){
      return excelCell.value.text;
    }
    return excelCell.value;
  }catch(e){
    logger.error(e);
    return null;
  }
}

function pickSingleColVal(worksheet, cellName, rowFrom){
  let valList = [];
  for(let i = rowFrom; i <= worksheet.actualRowCount; i++){
    let row = worksheet.getRow(i);
    valList.push(getCellValue(row.getCell(cellName)));
  }
  return mArrayUtil.removeRepeat(valList);
}

function checkCellNull(cell){
  if(!cell || !cell.type){
    return false;
  }
  return cell.type != EXCEL_CELL_TYPE.Null;
}

function checkCellNotNullMultiRow(worksheet, cellList, rowFrom, errCode, callback){
  checkMultiRow(checkCellNull, worksheet, cellList, rowFrom, errCode, callback);
}

function checkCellTypeNumber(cell){
  let cellValue = getCellValue(cell);
  if(!cellValue){
    return true;
  }
  if(typeof(cellValue) == 'number'){
    return true;
  }
  if(typeof(cellValue) == 'string'){
    return parseInt(cellValue, 10) > 0;
  }
  return false;
}

function checkCellTypeNumberMultiRow(worksheet, cellList, rowFrom, errCode, callback){
  checkMultiRow(checkCellTypeNumber, worksheet, cellList, rowFrom, errCode, callback);
}

function checkMultiRow(checkCell, worksheet, cellList, rowFrom, errCode, callback){
  let cellListErr = [];
  for(let i = rowFrom; i <= worksheet.actualRowCount; i++){
    let row = worksheet.getRow(i);
    for(let j = 0; j < cellList.length; j++){
      let cell = row.getCell(cellList[j]);
      let isOk = checkCell(cell);
      if(!isOk){
        cellListErr.push(cellList[j] + i);
      }
    }
  }
  if(cellListErr.length){
    return callback(new mErr.SSErr(errCode, cellListErr, null));
  }
  return callback();
}

function checkDateFormatMultiRow(worksheet, cellList, rowFrom, errCode, callback){
  checkMultiRow(checkDateFormat, worksheet, cellList, rowFrom, errCode, callback);
}

function checkYearFormatMultiRow(worksheet, cellList, rowFrom, errCode, callback){
  checkMultiRow(checkYearFormat, worksheet, cellList, rowFrom, errCode, callback);
}

function checkMobileFormatMultiRow(worksheet, cellList, rowFrom, errCode, callback){
  checkMultiRow(checkMobileFormat, worksheet, cellList, rowFrom, errCode, callback);
}

function checkRepeatMultiCol(worksheet, colList, rowFrom, errCode, callback){
  let cellListErrAll = [];
  for(let i = 0; i < colList.length; i++){
    let cellListErrI = checkRepeatOneCol(worksheet, colList[i], rowFrom);
    for(let j = 0; j < cellListErrI.length; j++){
      cellListErrAll.push(cellListErrI[j]);
    }
  }
  if(cellListErrAll.length){
    return callback(new mErr.SSErr(errCode, cellListErrAll, null));
  }
  return callback();
}

function checkRepeatOneCol(worksheet, col, rowFrom){
  let cellListErr = [];
  for(let i = rowFrom; i <= worksheet.actualRowCount; i++){
    let valI = getCellValue(worksheet.getRow(i).getCell(col));
    let repeatI = 0;
    for(let j = rowFrom; j <= worksheet.actualRowCount; j++){
      if(i === j){
        continue;
      }
      let valJ = getCellValue(worksheet.getRow(j).getCell(col));
      if(valI === valJ){
        repeatI++;
      }
    }
    if(repeatI > 0){
      cellListErr.push(col + i);
    }
  }
  return cellListErr;
}

function checkYearFormat(cell){
  if(cell.type == EXCEL_CELL_TYPE.Null){
    return true;
  }
  let s = getCellValue(cell).toString();
  if(s.length > 4){
    return false;
  }
  let d = parseInt(s, 10);
  return d >= 1900 && d <= 2100;
}

function checkMobileFormat(cell){
  if(cell.type == EXCEL_CELL_TYPE.Null){
    return true;
  }
  let d = getCellValue(cell).toString();
  return /^1[3456789]\d{9}$/.test(d);
}

function checkDateFormat(cell){
  if(cell.type == EXCEL_CELL_TYPE.Null){
    return true;
  }
  let d = getCellValue(cell).toString();
  let result = d.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
  if(!result){
    return false;
  }
  let d1 = new Date(d);
  if(d1 == 'Invalid Date'){ // but, 2019-02-29 is valid
    return false;
  }
  return true;
}

/*
 * colDef = [{col: '*', mp:[{target:*, raw:*}}]
 * e.g.
 * colDef = [
 *  {col: 'A', mp: null},
 *  {col: 'C', mp: [{target:1, raw:'男'}, {target:2, raw:'女'}]},
 * ]
 */
function valuesInsertOneRow(row, colDef){
  let values = [];
  for(let i = 0; i < colDef.length; i++){
    let rawVal = getCellValue(row.getCell(colDef[i].col));
    let targetVal = getTargetVal(rawVal, colDef[i].mp);
    values.push(targetVal);
  }
  return values;
}

function getTargetVal(rawVal, mapTable){
  if(!mapTable){
    return rawVal;
  }
  for(let i = 0; i < mapTable.length; i++){
    if(mapTable[i].raw == rawVal){
      return mapTable[i].target;
    }
  }
  return BAD_VALUE;
}

module.exports.getCellValue = getCellValue;

module.exports.pickSingleColVal = pickSingleColVal;
module.exports.valuesInsertOneRow = valuesInsertOneRow;

module.exports.checkCellNotNullMultiRow = checkCellNotNullMultiRow;
module.exports.checkCellTypeNumberMultiRow = checkCellTypeNumberMultiRow;
module.exports.checkDateFormatMultiRow = checkDateFormatMultiRow;
module.exports.checkYearFormatMultiRow = checkYearFormatMultiRow;
module.exports.checkMobileFormatMultiRow = checkMobileFormatMultiRow;
module.exports.checkRepeatMultiCol = checkRepeatMultiCol;
module.exports.checkRepeatOneCol = checkRepeatOneCol;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;