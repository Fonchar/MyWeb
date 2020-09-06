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

function handedAboundData(data, method) {
  return new Promise(async (resolve, reject) => {
    // data = await dataLimit(data, 1);
    console.log('method: ' + method);
    console.log('data.lenght: ' + data.length);
    console.log('data: ' + data);
    data = await putData2Mode(data, method);
    data = await filterNullCarPlateNo(data);
    if (data.xmldata.header.length > 0) {
      let xml = await json2xml(data);
      var postData = await builderPostData(xml, method); //这是需要提交的数据
      var options = mConst.HTTP_OPTIONS(method);
      var resXml = '';
      var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          loger.info('RES DATA: ' + chunk);
          resXml += chunk;
        });
        res.on('end', function () {
          console.log('resXml: ' + resXml);
          //将返回的xml报文转换为JSON数据
          Parser.parseString(resXml, function (err, json) {
            if (err) {
              loger.error(err, data);
              reject(false);
            }
            if (method === mConst.METHOD[0]) {
              handlerReqInbound(json, data);
              resolve(true);
            } else if (method === mConst.METHOD[1]) {
              handlerReqOutbound(json, data);
              resolve(true);
            }
          });
        })
      });
      req.on('error', function (e) {
        loger.error('problem with request: ' + e.message);
      });
      req.write(postData); // write data to request body
      req.end();
    } else {
      resolve(true)
    }
  });
}

/**
 * 入仓推送之后根据返回信息对数据库数据进行处理
 * @param {JSON} json 
 * @param {JSON} data 
 */
function handlerReqInbound(json, data) {
  let vals = '';
  for (let i = 0; i < data.xmldata.header.length; i++) {
    vals = i === 0 ? vals + '"' + data.xmldata.header[i].docNo + '"' : vals + ',"' + data.xmldata.header[i].docNo + '"';
  }
  if (json.Response.return.returnCode === mConst.ERR_CODE.SUCCESS.code) {
    let usql = 'update tb_inbound_so set lig_push_state = ? where order_no IN (' + vals + ')';
    db.executeSql(usql, [mConst.LIG_PUSH_STATE.HAS_PUSH_INBOUND], function (uerr, ures) {
      if (uerr) {
        loger.error(uerr);
      }
    })
  } else if (json.Response.return.returnCode === mConst.ERR_CODE.ERR_HAD_UPDATE.code) {
    console.log('json.Response.return.returnDesc', json.Response.return.returnDesc);
    var jsonStr = '{' + json.Response.return.returnDesc.split('allowed:')[1].replace(/\ /g, '').replace(/\=/g, ':"').replace(/\,/g, '",') + '"}';
    console.log('jsonStr', jsonStr.indexOf(':'));
    if (jsonStr.indexOf(':') === -1) {
      let usql = 'update tb_inbound_so set lig_push_state = ? where order_no IN (' + vals + ')';
      db.executeSql(usql, [mConst.LIG_PUSH_STATE.PUSH_ERR], function (uerr, ures) {
        if (uerr) {
          loger.error(uerr);
        }
      })
    } else {
      var resJson = eval('(' + jsonStr + ')');
      console.log('resJson', resJson);
      if (resJson.soReference1) {
        let usql = 'update tb_inbound_so set lig_push_state = ? where order_no IN ("' + resJson.soReference1 + '")';
        db.executeSql(usql, [mConst.LIG_PUSH_STATE.PUSH_ERR], function (uerr, ures) {
          if (uerr) {
            loger.error(uerr);
          }
        })
      }
    }
  } else {
    let usql = 'update tb_inbound_so set lig_push_state = ? where order_no IN (' + vals + ')';
    db.executeSql(usql, [mConst.LIG_PUSH_STATE.PUSH_ERR], function (uerr, ures) {
      if (uerr) {
        loger.error(uerr);
      }
    });
    loger.error(json, data);
  }
}

/**
 * 出仓推送之后根据返回信息对数据库数据进行处理
 * @param {JSON} json 
 * @param {JSON} data 
 */
function handlerReqOutbound(json, data) {
  let vals = '';
  for (let i = 0; i < data.xmldata.header.length; i++) {
    vals = i === 0 ? vals + '"' + data.xmldata.header[i].docNo + '"' : vals + ',"' + data.xmldata.header[i].docNo + '"';
  }
  if (json.Response.return.returnCode === mConst.ERR_CODE.SUCCESS.code) {
    let usql = 'update tb_shipment set lig_push_state = ? where order_no IN (' + vals + ')';
    db.executeSql(usql, [mConst.LIG_PUSH_STATE.HAS_PUSH_OUTBOUND], function (uerr, ures) {
      if (uerr) {
        loger.error(uerr);
      }
    })
  } else if (json.Response.return.returnCode === mConst.ERR_CODE.ERR_HAD_UPDATE.code) {
    var jsonStr = '{' + json.Response.return.returnDesc.split('allowed:')[1].replace(/\ /g, '').replace(/\=/g, ':"').replace(/\,/g, '",') + '"}';
    if (jsonStr.indexOf(':') === -1) {
      let usql = 'update tb_shipment set lig_push_state = ? where order_no IN (' + vals + ')';
      db.executeSql(usql, [mConst.LIG_PUSH_STATE.PUSH_ERR], function (uerr, ures) {
        if (uerr) {
          loger.error(uerr);
        }
      })
    } else {
      var resJson = eval('(' + jsonStr + ')');
      console.log('resJson', resJson);
      if (resJson.soReference1) {
        let usql = 'update tb_shipment set lig_push_state = ? where order_no IN ("' + resJson.soReference1 + '")';
        db.executeSql(usql, [mConst.LIG_PUSH_STATE.PUSH_ERR], function (uerr, ures) {
          if (uerr) {
            loger.error(uerr);
          }
        })
      }
    }
  } else {
    let usql = 'update tb_shipment set lig_push_state = ? where order_no IN (' + vals + ')';
    db.executeSql(usql, [mConst.LIG_PUSH_STATE.PUSH_ERR], function (uerr, ures) {
      if (uerr) {
        loger.error(uerr);
      }
    })
    loger.error(json, data);
  }
}

function builderPostData(xml, method) {
  return new Promise((resolve, reject) => {
    let tmpData = mConst.APPSECRET + xml + mConst.APPSECRET;
    let calcMd5 = md5(tmpData);
    let calcBsae64 = Base64.encode(calcMd5);
    let sign = encodeURIComponent(calcBsae64).toUpperCase();
    // let postData = {
    //   method: method,
    //   client_customerid: mConst.CLIENT_CUSTOMERID,
    //   client_db: mConst.CLIENT_DB,
    //   messageid: mConst.MESSADEID_BY_METHOD[method],
    //   apptoken: mConst.APPTOKEN,
    //   appkey: mConst.APPKEY,
    //   sign: sign,
    //   data: xml
    // };
    // console.log("------postDataJson- ", postData);
    // postData = querystring.stringify(postData);
    // console.log("-postDataStringify- ", postData);

    let postData =
      'method=' + method +
      '&client_customerid=' + mConst.CLIENT_CUSTOMERID +
      '&client_db=' + mConst.CLIENT_DB +
      '&messageid=' + mConst.MESSADEID_BY_METHOD[method] +
      '&apptoken=' + mConst.APPTOKEN +
      '&appkey=' + mConst.APPKEY +
      '&sign=' + sign +
      '&data=' + xml;
    console.log("-postDataStringify- ", postData);
    resolve(postData)
  })
}

/**
 * 限制单次推送数据条数
 * @param {*} date 
 * @param {*} limit 
 */
function dataLimit(date, limit) {
  return new Promise(async (resolve, reject) => {
    if (date.length >= limit) {
      resolve(date.slice(0, limit));
    } else {
      resolve(date)
    }
  })
}

/**
 * 过滤无车牌的数据，无车牌的数据不推送
 * @param {JSON} date 
 * @returns {JSON}
 */
function filterNullCarPlateNo(date) {
  return new Promise(async (resolve, reject) => {
    let temp = [];
    // console.log("filterNullCarPlateNo date length ", date.xmldata.header.length);
    // console.log("filterNullCarPlateNo date.xmldata ", date.xmldata);
    if (date.xmldata.header.length === 0) {
      resolve(date);
    } else {
      for (let i = 0; i < date.xmldata.header.length; i++) {
        // console.log("filterNullCarPlateNo date.xmldata.header.details ", date.xmldata.header[i].details);
        // console.log("date.xmldata.header[i].car_plate_no ", date.xmldata.header[i].docNo);
        let details = date.xmldata.header[i].details;
        let notNull = true;
        for (let m = 0; m < details.length; m++) {
          if (details[m].skuDescrC === 'null') {
            notNull = false;
          }
        }
        if (notNull) {
          temp.push(date.xmldata.header[i]);
        }
      }
      resolve({ xmldata: { header: temp } })
    }
  })
}

/**
 * 将数据库查询结果转换为符合XML模板的Json数据
 * @param {Array} data 
 * @param {string} method 
 * @returns {Array}
 */
function putData2Mode(data, method) {
  return new Promise(async (resolve, reject) => {
    let tmpArr = [];
    if (method === mConst.METHOD[0]) {
      data = mergeData2(data);
      console.log('data', data);
      data.forEach((item, index) => {
        let tmpData = {}, details = [];
        let order_no = item.order_no;
        let so_no = item.so_no.split('$#$');
        let car_plate_no = item.car_plate_no.split(',');
        let vendor = item.vendor.split(',');
        let inbound_date = item.inbound_date.split(',');
        let sku = item.sku.split('$#$');
        let po = item.po.split('$#$');

        let order_total_carton = item.order_total_carton;
        let order_total_pcs = item.order_total_pcs;
        let order_total_cbm = item.order_total_cbm;
        let order_total_weight = item.order_total_weight;

        let unit_length = item.unit_length.split(',');
        let unit_width = item.unit_width.split(',');
        let unit_height = item.unit_height.split(',');
        let unit_weight = item.unit_weight.split(',');

        let total_carton = item.total_carton.split(',');
        let total_pcs = item.total_pcs.split(',');
        let total_cbm = item.total_cbm.split(',');
        let total_weight = item.total_weight.split(',');

        let pre_total_carton = item.pre_total_carton.split(',');
        let pre_total_pcs = item.pre_total_pcs.split(',');
        let pre_total_cbm = item.pre_total_cbm.split(',');
        let pre_total_weight = item.pre_total_weight.split(',');

        let so_total_carton = item.so_total_carton.toString().split(',');
        let so_total_pcs = item.so_total_pcs.toString().split(',');
        let so_total_cbm = item.so_total_cbm.toString().split(',');
        let so_total_weight = item.so_total_weight.toString().split(',');

        let so_pre_total_carton = item.so_pre_total_carton.toString().split(',');
        let so_pre_total_pcs = item.so_pre_total_pcs.toString().split(',');
        let so_pre_total_cbm = item.so_pre_total_cbm.toString().split(',');
        let so_pre_total_weight = item.so_pre_total_weight.toString().split(',');

        let memo = item.memo.split('$#$');
        tmpData.warehouseId = "WHCFS";
        tmpData.customerId = "LIGSZX2";
        tmpData.poType = "PR";
        tmpData.poStatus = "99";
        tmpData.docNo = order_no;
        tmpData.poReferenceA = car_plate_no[0];
        tmpData.poCreationTime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        tmpData.expectedArriveTime1 = inbound_date[0];
        tmpData.hedi05 = order_total_carton;
        tmpData.hedi06 = order_total_cbm.toFixed(2);
        tmpData.hedi07 = order_total_weight.toFixed(2);
        tmpData.hedi08 = order_total_pcs;
        for (let j = 0; j < so_no.length; j++) {
          tmpData.notes = so_no[j].split('-')[1];
          details.push({
            lineNo: j + 1,
            customerId: 'LIGSZX2',
            PoLineStatus: 99,
            sku: sku[j] === '' ? so_no[j] : sku[j],
            orderedQty: pre_total_carton[j],
            totalCubic: pre_total_cbm[j],
            orderedQty_Each: pre_total_pcs[j],
            totalGrossWeight: pre_total_weight[j],
            receivedQty: total_carton[j],
            receivedQty_Each: total_pcs[j],
            uom: 'CS',
            lotAtt04: so_no[j],
            lotAtt05: dislodgeLetter(so_no[j].split('-')[0]),
            lotAtt06: so_no[j].split('-')[0],
            lotAtt07: so_no[j].split('-').length <= 1 ? '' : so_no[j].split('-')[1],
            lotAtt09: so_total_carton[j],
            lotAtt10: so_total_weight[j],
            lotAtt11: so_total_cbm[j],
            dedi01: dislodgeLetter(so_no[j].split('-')[0]),
            dedi03: total_cbm[j],
            dedi04: total_weight[j],
            dedi05: total_pcs[j],
            dedi06: vendor[j],
            dedi07: po[j] === '' ? so_no[j] : po[j],
            dedi09: so_total_pcs[j],

            dedi10: so_pre_total_carton[j],
            userDefine1: unit_length[j],
            userDefine2: unit_width[j],
            userDefine3: unit_height[j],
            userDefine4: so_pre_total_weight[j],
            userDefine5: so_pre_total_cbm[j],
            notes: memo[j],
          })
        }
        tmpData.details = details;
        tmpArr.push(tmpData);
      });
      resolve({ xmldata: { header: tmpArr } });
    } else if (method === mConst.METHOD[1]) {
      data.forEach((item, index) => {
        let tmpData = {}, details = [], container_type = '';
        for (let j = 0; j < mConst.CONTAINER_TYPE.length; j++) {
          if (mConst.CONTAINER_TYPE[j].id === item.container_type) {
            container_type = mConst.CONTAINER_TYPE[j].name;
          }
        }
        let sku = item.sku == null ? null : item.sku.split(',');
        let i_carton = item.i_carton == null ? null : item.i_carton.split(',');
        let i_pcs = item.i_pcs == null ? null : item.i_pcs.split(',');
        let i_pcs_per_carton = item.i_pcs_per_carton == null ? null : item.i_pcs_per_carton.split(',');
        let po = item.po == null ? null : item.po.split(',');
        let so_no = item.so_no == null ? null : item.so_no.split(',');
        let remark = item.remark == null ? null : item.remark.split(',');
        let total_carton = item.total_carton.split(',');
        let total_pcs = item.total_pcs.split(',');
        let total_weight = item.total_weight.split(',');
        let total_cbm = item.total_cbm.split(',');
        tmpData.warehouseId = "WHCFS";
        tmpData.customerId = "LIGSZX2";
        tmpData.orderType = "CM";
        tmpData.orderstatus = 99;
        tmpData.docNo = item.order_no;
        tmpData.soReferenceA = item.container_no;
        tmpData.orderTime = item.outbound_date;
        tmpData.consigneeId = 'Ligentia';
        tmpData.consigneeName = 'Ligentia';
        tmpData.hedi01 = item.carton;
        tmpData.hedi02 = item.s_total_cbm;
        tmpData.hedi03 = item.s_total_weight;
        tmpData.hedi04 = item.pcs;
        tmpData.hedi05 = container_type;
        tmpData.hedi07 = item.seal_no;
        tmpData.hedi08 = item.container_weight;
        tmpData.hedi09 = (item.container_weight + item.s_total_weight).toFixed(2);
        tmpData.route = item.ship_so;
        tmpData.userDefine1 = item.ship_info == null ? null : item.ship_info.split('|')[2];
        tmpData.userDefine4 = item.ship_info == null ? null : item.ship_info.split('|')[1];
        tmpData.userDefine2 = item.si_cut_off_time;
        tmpData.userDefine5 = item.ship_info == null ? null : item.ship_info.split('|')[0];
        for (let j = 0; j < so_no.length; j++) {
          details.push({
            lineNo: j + 1,
            LineStatus: 99,
            sku: sku[j] === '' ? (dislodgeLetter(so_no[j].split('-')[0]) === '' ? so_no[j] : dislodgeLetter(so_no[j].split('-')[0])) : sku[j],
            qtyOrdered: total_carton,
            qtyOrdered_Each: total_pcs,
            qtyShipped: total_carton,
            qtyShipped_Each: total_pcs,
            customerId: 'LIGSZX2',
            dedi04: so_no == null ? null : (dislodgeLetter(so_no[j].split('-')[0]) === '' ? so_no[j] : dislodgeLetter(so_no[j].split('-')[0])),
            dedi05: po[j] === '' ? (dislodgeLetter(so_no[j].split('-')[0]) === '' ? so_no[j] : dislodgeLetter(so_no[j].split('-')[0])) : po[j],
            dedi06: item.order_no,
            dedi08: total_cbm == null ? null : total_cbm[j],
            dedi11: so_no == null ? null : so_no[j],
            dedi12: so_no == null ? null : (so_no[j].split('-').length === 2 ? '' : so_no[j].split('-')[1]),
            userDefine1: remark == null ? null : remark[j],
            userDefine2: total_weight == null ? null : total_weight[j],
          })
        }
        tmpData.details = details;
        tmpArr.push(tmpData);
      });
      resolve({ xmldata: { header: tmpArr } });
    }
  })
}

function mergeData2bb(data) {
  let tmpData = [];
  data.forEach((item, index) => {
    let soId = item.so_id.split(',');
    let totalCarton = item.total_carton.split(',');
    let totalPcs = item.total_pcs.split(',');
    let totalCbm = item.total_cbm.split(',');
    let totalWeight = item.total_weight.split(',');
    let tmpTCarton = 0, tmpTPcs = 0, tmpTCbm = 0.0, tmpTWeight = 0.0;

    let preTotalCarton = item.pre_total_carton.split(',');
    let preTotalPcs = item.pre_total_pcs.split(',');
    let preTotalCbm = item.pre_total_cbm.split(',');
    let preTotalWeight = item.pre_total_weight.split(',');
    let tmpPTCarton = 0, tmpPTPcs = 0, tmpPTCbm = 0.0, tmpPTWeight = 0.0;


    item.so_total_carton = '';
    item.so_total_pcs = '';
    item.so_total_cbm = '';
    item.so_total_weight = '';
    item.so_pre_total_carton = '';
    item.so_pre_total_pcs = '';
    item.so_pre_total_cbm = '';
    item.so_pre_total_weight = '';

    let keySoId = '', newSoIndex = 0;
    for (let m = 0; m < soId.length + 1; m++) {
      if (keySoId === soId[m] || m === 0) {
        tmpTCarton += parseInt(totalCarton[m], 10);
        tmpTPcs += parseInt(totalPcs[m], 10);
        tmpTCbm += parseFloat(totalCbm[m], 10);
        tmpTWeight += parseFloat(totalWeight[m], 10);

        tmpPTCarton += parseInt(preTotalCarton[m], 10);
        tmpPTPcs += parseInt(preTotalPcs[m], 10);
        tmpPTCbm += parseFloat(preTotalCbm[m], 10);
        tmpPTWeight += parseFloat(preTotalWeight[m], 10);

      } else if (m !== 0 || m === soId.length) {
        for (let k = newSoIndex; k < m; k++) {
          console.log("k k k k k k k ", k);
          item.so_total_carton += k === 0 ? tmpTCarton.toString() : ',' + tmpTCarton.toString();
          item.so_total_pcs += k === 0 ? tmpTPcs.toString() : ',' + tmpTPcs.toString();
          item.so_total_cbm += k === 0 ? tmpTCbm.toFixed(2).toString() : ',' + tmpTCbm.toFixed(2).toString();
          item.so_total_weight += k === 0 ? tmpTWeight.toFixed(2).toString() : ',' + tmpTWeight.toFixed(2).toString();
          item.so_pre_total_carton += k === 0 ? tmpPTCarton.toString() : ',' + tmpPTCarton.toString();
          item.so_pre_total_pcs += k === 0 ? tmpPTPcs.toString() : ',' + tmpPTPcs.toString();
          item.so_pre_total_cbm += k === 0 ? tmpPTCbm.toFixed(2).toString() : ',' + tmpPTCbm.toFixed(2).toString();
          item.so_pre_total_weight += k === 0 ? tmpPTWeight.toFixed(2).toString() : ',' + tmpPTWeight.toFixed(2).toString();
        }
        newSoIndex = m;
        tmpTCarton = 0;
        tmpTPcs = 0;
        tmpTCbm = 0.0;
        tmpTWeight = 0.0;
        tmpPTCarton = 0;
        tmpPTPcs = 0;
        tmpPTCbm = 0.0;
        tmpPTWeight = 0.0;
        if (m !== soId.length) {
          tmpTCarton += parseInt(totalCarton[m], 10);
          tmpTPcs += parseInt(totalPcs[m], 10);
          tmpTCbm += parseFloat(totalCbm[m], 10);
          tmpTWeight += parseFloat(totalWeight[m], 10);

          tmpPTCarton += parseInt(preTotalCarton[m], 10);
          tmpPTPcs += parseInt(preTotalPcs[m], 10);
          tmpPTCbm += parseFloat(preTotalCbm[m], 10);
          tmpPTWeight += parseFloat(preTotalWeight[m], 10);
        }
      }
      keySoId = soId[m];
    }
    tmpData.push(item);
  });
  return tmpData;
}

/**
 * 
 * @param {Array} data
 * @returns {Array} 
 */
function mergeData2(data) {
  let tmpData = [];
  data.forEach((item, index) => {
    let soId = item.so_id.split(',');
    let totalCarton = item.total_carton.split(',');
    let totalPcs = item.total_pcs.split(',');
    let totalCbm = item.total_cbm.split(',');
    let totalWeight = item.total_weight.split(',');

    let preTotalCarton = item.pre_total_carton.split(',');
    let preTotalPcs = item.pre_total_pcs.split(',');
    let preTotalCbm = item.pre_total_cbm.split(',');
    let preTotalWeight = item.pre_total_weight.split(',');

    let so_total_carton_t = [soId.length];
    let so_total_pcs_t = [soId.length];
    let so_total_cbm_t = [soId.length];
    let so_total_weight_t = [soId.length];
    let so_pre_total_carton_t = [soId.length];
    let so_pre_total_pcs_t = [soId.length];
    let so_pre_total_cbm_t = [soId.length];
    let so_pre_total_weight_t = [soId.length];

    item.so_total_carton = '';
    item.so_total_pcs = '';
    item.so_total_cbm = '';
    item.so_total_weight = '';
    item.so_pre_total_carton = '';
    item.so_pre_total_pcs = '';
    item.so_pre_total_cbm = '';
    item.so_pre_total_weight = '';

    let soIndeOfArr = getIndexOfArr(soId, 'arr');
    for (let k = 0; k < soIndeOfArr.length; k++) {
      let tmpTCarton = 0, tmpTPcs = 0, tmpTCbm = 0.0, tmpTWeight = 0.0;
      let tmpPTCarton = 0, tmpPTPcs = 0, tmpPTCbm = 0.0, tmpPTWeight = 0.0;
      for (let m = 0; m < soIndeOfArr[k].length; m++) {
        //console.log('totalCarton[m]',soIndeOfArr[k][m], totalCarton[soIndeOfArr[k][m]]);
        tmpTCarton += parseInt(totalCarton[soIndeOfArr[k][m]], 10);
        tmpTPcs += parseInt(totalPcs[soIndeOfArr[k][m]], 10);
        tmpTCbm += parseFloat(totalCbm[soIndeOfArr[k][m]], 10);
        tmpTWeight += parseFloat(totalWeight[soIndeOfArr[k][m]], 10);

        tmpPTCarton += parseInt(preTotalCarton[soIndeOfArr[k][m]], 10);
        tmpPTPcs += parseInt(preTotalPcs[soIndeOfArr[k][m]], 10);
        tmpPTCbm += parseFloat(preTotalCbm[soIndeOfArr[k][m]], 10);
        tmpPTWeight += parseFloat(preTotalWeight[soIndeOfArr[k][m]], 10);
      }
      for (let m = 0; m < soIndeOfArr[k].length; m++) {
        so_total_carton_t[soIndeOfArr[k][m]] = tmpTCarton;
        so_total_pcs_t[soIndeOfArr[k][m]] = tmpTPcs;
        so_total_cbm_t[soIndeOfArr[k][m]] = tmpTCbm;
        so_total_weight_t[soIndeOfArr[k][m]] = tmpTWeight;

        so_pre_total_carton_t[soIndeOfArr[k][m]] = tmpPTCarton;
        so_pre_total_pcs_t[soIndeOfArr[k][m]] = tmpPTPcs;
        so_pre_total_cbm_t[soIndeOfArr[k][m]] = tmpPTCbm;
        so_pre_total_weight_t[soIndeOfArr[k][m]] = tmpPTWeight;
      }
    }
    for (let m = 0; m < soId.length; m++) {
      item.so_total_carton += m === 0 ? so_total_carton_t[m].toString() : ',' + so_total_carton_t[m].toString();
      item.so_total_pcs += m === 0 ? so_total_pcs_t[m].toString() : ',' + so_total_pcs_t[m].toString();
      item.so_total_cbm += m === 0 ? so_total_cbm_t[m].toFixed(2).toString() : ',' + so_total_cbm_t[m].toFixed(2).toString();
      item.so_total_weight += m === 0 ? so_total_weight_t[m].toFixed(2).toString() : ',' + so_total_weight_t[m].toFixed(2).toString();
      item.so_pre_total_carton += m === 0 ? so_pre_total_carton_t[m].toString() : ',' + so_pre_total_carton_t[m].toString();
      item.so_pre_total_pcs += m === 0 ? so_pre_total_pcs_t[m].toString() : ',' + so_pre_total_pcs_t[m].toString();
      item.so_pre_total_cbm += m === 0 ? so_pre_total_cbm_t[m].toFixed(2).toString() : ',' + so_pre_total_cbm_t[m].toFixed(2).toString();
      item.so_pre_total_weight += m === 0 ? so_pre_total_weight_t[m].toFixed(2).toString() : ',' + so_pre_total_weight_t[m].toFixed(2).toString();
    }
    tmpData.push(item);
  });
  return tmpData;
}


/**
 * @param {Array} arr 
 * @param {string} returnType 
 * @returns {Array,JSON}
 */
function getIndexOfArr(arr, returnType) {
  var strary = [], resultArr = [], resultJson = {}, indexOfArr = [];
  for (var i = 0; i < arr.length; i++) {
    var hasRead = false;
    for (var k = 0; k < strary.length; k++) {
      if (strary[k] == arr[i]) {
        hasRead = true;
      }
    }
    if (!hasRead) {
      console.log('arr arr', arr);
      console.log('hasRead hasRead', hasRead);
      var _index = i, indexOfArr = [];
      indexOfArr.push(parseInt(i));
      for (var j = i + 1; j < arr.length; j++) {
        if (j == parseInt(i) + parseInt(1)) {
          _index++;
        }
        if (arr[i] == arr[j]) {
          _index += "," + (parseInt(j) + 1);
          indexOfArr.push(parseInt(j));
        }
      }
      strary.push(arr[i]);
      resultJson[arr[i]] = indexOfArr;
      resultArr.push(indexOfArr);
    }
  }
  if (returnType == 'json') {
    console.log('resultJson', resultJson);
    return resultJson;
  }
  if (returnType == 'arr') {
    console.log('resultArr', resultArr);
    return resultArr;
  }
}


/**
 * @param {Array} arr 
 * @param {string} returnType 
 * @returns {Array,JSON}
 */
function getSameIndexOfArr(arr, returnType) {
  var strary = [], resultArr = [], resultJson = {}, indexOfArr = [];
  for (var i = 0; i < arr.length; i++) {
    var hasRead = false;
    for (var k = 0; k < strary.length; k++) {
      if (strary[k] == arr[i]) {
        hasRead = true;
      }
    }
    if (!hasRead) {
      var _index = i, haveSame = false, indexOfArr = [];
      indexOfArr.push(parseInt(i));
      for (var j = i + 1; j < arr.length; j++) {
        if (j == parseInt(i) + parseInt(1)) {
          _index++;
        }
        if (arr[i] == arr[j]) {
          _index += "," + (parseInt(j) + 1);
          indexOfArr.push(parseInt(j));
          haveSame = true;
        }
      }
      if (haveSame) {
        strary.push(arr[i]);
        resultJson[arr[i]] = indexOfArr;
        resultArr.push(indexOfArr);
      }
    }
  }
  if (returnType == 'json') {
    console.log('resultJson', resultJson);
    return resultJson;
  }
  if (returnType == 'arr') {
    console.log('resultArr', resultArr);
    return resultArr;
  }
}

/**
 * 
 * @param {string} str 
 * @returns {string}
 */
function dislodgeLetter(str) {
  var result;
  var reg = /[a-zA-Z]+/;  //[a-zA-Z]表示匹配字母，g表示全局匹配
  while (result = str.match(reg)) { //判断str.match(reg)是否没有字母了
    str = str.replace(result[0], ''); //替换掉字母  result[0] 是 str.match(reg)匹配到的字母
  }
  return str;
}

/**
 * 
 * @param {XMLDocument} xml 
 * @returns {JSON}
 */
function xml2json(xml) {
  return new Promise(async (resolve, reject) => {
    Parser.parseString(xml, function (err, json) {
      console.log('json', JSON.stringify(json));
      resolve(json);
    });
  })
}

/**
 * 
 * @param {JSON} json
 * @returns {XMLDocument} 
 */
function json2xml(json) {
  return new Promise(async (resolve, reject) => {
    var xml = Builder.buildObject(json);
    xml = encodeURIComponent(xml);
    xml = xml.replace(/amp;/g, "");
    // xml=xml.replace(/\#/g,"%23");
    // xml=xml.replace(/\%/g,"%25");
    // xml=xml.replace(/\&/g,"%26");
    resolve(xml)
  })
}

module.exports.handerAllboundData = handedAboundData;