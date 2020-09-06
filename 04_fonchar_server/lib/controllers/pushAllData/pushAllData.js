var assert = require('assert');
var loger = require('log-helper');
var md5 = require('md5');
var Base64 = require('js-base64').Base64;
var xml2js = require('xml2js');
var Builder = new xml2js.Builder({
  renderOpts: {'pretty': false, 'indent': ' ', 'newline': '\n'},
  explicitRoot: false,
  headless: true
});  // json->xml (并取消美化)
var Parser = new xml2js.Parser({explicitArray: false, ignoreAttrs: true});   //xml -> json (取消强制数组化)

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

var getReqOnData = require('../common/getReqOnData');
var getReqOnDataAsync = require('../common/getReqOnDataAsync');

var {handerAllboundData} = require('../pushAllData/handerAllboundData');

function listenerPushMark() {
  let sqls = [], vals = [];
  handedSqlPutPoData(sqls, vals);
  handedSqlPutSABAData(sqls, vals);
  db.excuteSqls(sqls, vals, function (err, data) {
    if (err) {
      loger.error(err)
    }
    if (data.length > 0) {
      pushAllData(data)
    }
  })
}

function handedSqlPutPoData(sqls, vals) {
  let sql = [
    'select s.order_no,',
    'group_concat(s.id) so_id,',
    'group_concat(s.so_no SEPARATOR "$#$") so_no,',
    'group_concat(s.car_plate_no) car_plate_no,',
    'group_concat(s.vendor) vendor,',
    'group_concat(s.lig_push_state) lig_push_state,',
    'group_concat(date_format(s.input_date, "%Y-%m-%d %H:%i:%S")) input_date,',
    'group_concat(date_format(s.inbound_date, "%Y-%m-%d %H:%i:%S")) inbound_date,',
    'group_concat(i.po SEPARATOR "$#$") po, group_concat(i.sku SEPARATOR "$#$") sku,',
    'sum(i.total_carton) order_total_carton,',
    'sum(i.total_pcs) order_total_pcs,',
    'Convert(sum(i.wms_total_cbm_veritable),decimal(18,2)) order_total_cbm,',
    'Convert(sum(i.wms_total_weight_veritable),decimal(18,2)) order_total_weight,',
    'group_concat(i.unit_length) unit_length,',
    'group_concat(i.unit_width) unit_width,',
    'group_concat(i.unit_height) unit_height,',
    'group_concat(i.unit_weight) unit_weight,',
    'group_concat(i.total_carton) total_carton,',               //实收
    'group_concat(i.total_pcs) total_pcs,',                     //实收
    'group_concat(i.wms_total_cbm_veritable) total_cbm,',       //实收
    'group_concat(i.wms_total_weight_veritable) total_weight,', //实收
    'group_concat(i.pre_total_carton) pre_total_carton,',       //应收
    'group_concat(i.pre_total_pcs) pre_total_pcs,',             //应收
    'group_concat(i.total_cbm) pre_total_cbm,',                 //应收
    'group_concat(i.total_weight) pre_total_weight,',           //应收
    'group_concat(i.memo SEPARATOR "$#$") memo',
    'from tb_inbound_so s, tb_inbound_so_item i, tb_project p',
    'where i.so_id = s.id and s.project_id = p.id and i.unit_width is not null and s.inbound_date is not null',
    'and p.company_id = ? and receive_report_flag = ? and lig_push_state = ? and i.total_pcs != 0 group by s.order_no'].join(' ');
  let val = [mConst.COMPANY_ID.LIG, mConst.LIG_PUSH_STATE.NEED_PUSH_INBOUND, mConst.LIG_PUSH_STATE.INIT]; //通过标志查询
  sqls.push(sql);
  vals.push(val);
}

function handedSqlPutSABAData(sqls, vals) {
  let sql = [
    'select s.id,s.order_no,s.container_no,s.carton,s.pcs,s.container_type,',
    's.seal_no,s.container_weight,s.ship_so,s.ship_info,',
    'date_format(s.outbound_date, "%Y-%m-%d %H:%i:%S") outbound_date,',
    'date_format(s.si_cut_off_time, "%Y-%m-%d %H:%i:%S") si_cut_off_time,',
    'group_concat(so.so_no) so_no,',
    'Convert(sum(i.total_cbm),decimal(18,2)) s_total_cbm,',
    'Convert(sum(i.total_weight),decimal(18,2)) s_total_weight,',
    'group_concat(i.po) po,',
    'group_concat(i.sku) sku,',
    'group_concat(i.carton) i_carton,',
    'group_concat(i.pcs_per_carton) i_pcs_per_carton,',
    'group_concat(i.pcs) i_pcs,',
    'group_concat(i.total_carton) total_carton,',
    'group_concat(i.total_pcs) total_pcs,',
    'group_concat(i.total_weight) total_weight,',
    'group_concat(i.total_cbm) total_cbm,',
    'group_concat(i.remark) remark',
    'from tb_shipment s, tb_shipment_item i ,tb_inbound_so so ,tb_project p',
    'where s.id=i.shipment_id and i.so_id=so.id and so.project_id = p.id',
    'and p.company_id = ? and seal_no is not null and container_no is not null',
    'and i.total_pcs != 0 and i.total_weight != 0',
    'and s.lig_push_state = ? group by s.id'].join(' ');
  let val = [mConst.COMPANY_ID.LIG, mConst.LIG_PUSH_STATE.INIT]; //通过标志查询
  sqls.push(sql);
  vals.push(val);
}

async function pushAllData(data) {
  var inboundData = data[0], outboundData = data[1];
  console.log('inboundData', inboundData);
  console.log('outboundData', outboundData);
  if (inboundData.length > 0) {
    await handerAllboundData(inboundData, mConst.METHOD[0]);
  }
  if (outboundData.length > 0) {
    await handerAllboundData(outboundData, mConst.METHOD[1]);
  }
}

function xml2json(xml) {
  return new Promise(async (resolve, reject) => {
    Parser.parseString(xml, function (err, json) {
      console.log('json', JSON.stringify(json));
      resolve(json);
    });
  })
}

function json2xml(json) {
  return new Promise(async (resolve, reject) => {
    var xml = Builder.buildObject(json);
    console.log('xml', xml);
    resolve(xml)
  })
}

function dislodgeLetter(str) {
  var result;
  var reg = /[a-zA-Z]+/;  //[a-zA-Z]表示匹配字母，g表示全局匹配
  while (result = str.match(reg)) { //判断str.match(reg)是否没有字母了
    str = str.replace(result[0], ''); //替换掉字母  result[0] 是 str.match(reg)匹配到的字母
  }
  return str;
}

module.exports.listenerPushMark = listenerPushMark;
module.exports.pushAllData = pushAllData;