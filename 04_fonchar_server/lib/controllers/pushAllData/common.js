var assert = require('assert');
var loger = require('log-helper');
var md5 = require('md5');
var Base64 = require('js-base64').Base64;
var xml2js = require('xml2js');
var Builder = new xml2js.Builder({renderOpts: {'pretty': false, 'indent': ' ', 'newline': '\n'}});  // json->xml (并取消美化)
var Parser = new xml2js.Parser({explicitArray: false, ignoreAttrs: true});   //xml -> json (取消强制数组化)

var mConst = require('../const.js');

var db = require('../db/db.js');
assert(db.executeSql);
assert(db.checkUniqueMultiFields);

var dbUtil = require('../db/db-util.js');
assert(dbUtil.paginationQuery);

var sqlSplitter = require('../db/sql-splitter.js');
assert(sqlSplitter.subsqlFuzzySearch);
assert(sqlSplitter.subsqlEqual);

var mTbOp = require('../db/tb-op.js');
assert(mTbOp.getSimpleTbOp);

var getReqOnData = require('../controllers/common/getReqOnData');
var getReqOnDataAsync = require('../controllers/common/getReqOnDataAsync');

var {getResponseXml} = require('../controllers/getResponseXml/getResponseXml');

var {putPoData} = require('../putPoData/putPoData');
var {putSoData} = require('../putSoData/putSoData');


async function putAllData(req, res) {
  console.log("req.body", req.body);
  let onData = await getReqOnDataAsync(req);
  let postInfo = await getPostInfo(onData);
  postInfo.data = decodeURIComponent(postInfo.data);
  console.log("postInfo", postInfo);
  let result = await checkPostData(postInfo);
  if (result) {
    let putFlage = await putDataByMethod(postInfo);
    if (putFlage) {
      res.json(putFlage);
      res.end("putDataByMethod END");
    } else {
      res.end("DATA CHECK FILED");
    }
  } else {
    res.end("DATA CHECK FILED");
  }
}

function getPostInfo(onData) {
  return new Promise((resolve, reject) => {
    let dataArr = onData.text.split("&");
    let dataJson = {};
    dataArr.forEach(buffer => dataJson[buffer.split("=")[0]] = buffer.split("=")[1]);
    resolve(dataJson)
  })
}

function checkPostData(postInfo) {
  return new Promise((resolve, reject) => {
    let result = false;
    let tmpData = mConst.APPSECRET + postInfo.data + mConst.APPSECRET;
    let calcMd5 = md5(tmpData);
    let calcBsae64 = Base64.encode(calcMd5);
    let utf8encode = encodeURIComponent(calcBsae64).toUpperCase();
    console.log("tmpData", tmpData)
    console.log("utf8encode", utf8encode)
    console.log("postInfo.sign", postInfo.sign)
    if (utf8encode === postInfo.sign) {
      console.log("mConst.METHOD.indexOf(postInfo.method)", mConst.METHOD.indexOf(postInfo.method))
      console.log("mConst.MESSADEID.indexOf(postInfo.messageid)", mConst.MESSADEID.indexOf(postInfo.messageid))
      mConst.METHOD.forEach(buffer => {
        if (buffer === postInfo.method
          && mConst.METHOD.indexOf(postInfo.method) === mConst.MESSADEID.indexOf(postInfo.messageid)) {
          result = true;
        }
      })
    } else (
      result = false
    );
    resolve(result)
  })
}

function putDataByMethod(postInfo) {
  return new Promise(async (resolve, reject) => {
    let result = false, res;
    if ("putPOData" === postInfo.method) {
      // var json= await xml2json(xml);
      // result = await putPoData(postInfo);
      var jsonData = mConst.PO_DATA_V0;
      var xml = await json2xml(jsonData);
      res = xml;
    }
    if ("putSALEData" === postInfo.method) {
    }
    resolve(res)
  })
}
//
// function pushAllData(data) {
//   console.log('push data - ' + new Date(), data)
// }
//
// function listenerPushMark() {
//   var sql = 'select * from tb_test_push_data where mark = ? or mark = ?';
//   var val = [mConst.PUSH_STATE.NEED_PUSH_INBOUND, mConst.PUSH_STATE.NEED_PUSH_OUTBOUND];
//   db.executeSql(sql, val, function (err, data) {
//     if (err) {
//       loger.error(err)
//     }
//     var inboundData=[], outboundData=[];
//     data.forEach((item, index) => {
//       if (item.mark === mConst.PUSH_STATE.NEED_PUSH_INBOUND) {
//         inboundData.push(item)
//       }
//       if (item.mark === mConst.PUSH_STATE.NEED_PUSH_OUTBOUND) {
//         outboundData.push(item)
//       }
//     });
//     console.log('inboundData', inboundData);
//     console.log('outboundData', outboundData);
//     // if (data) {
//     //   pushAllData(data)
//     // }
//   })
// }

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

module.exports.putAllData = putAllData;