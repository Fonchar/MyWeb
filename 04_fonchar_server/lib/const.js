
const ADMIN_ROLE = 99;

//测试给出
const APPSECRET = 1234567890;
const APPTOKEN = '80AC1A3F-F949-492C-A024-7044B28C8025';
const APPKEY = 'test';
const CLIENT_CUSTOMERID = 'LG';

//固定值
const METHOD = ["putPOData", "putSALEData"];
const MESSADEID = ["PO", "SKU"];
const CLIENT_DB = "FLUXWMS";
const FORMAT = "xml";

const MESSADEID_BY_METHOD = {putPOData: 'PO', putSALEData: 'SALES'};

//http
const PUSH_METHOD = 'POST';

//http.options
const OP_HOSTNAME = '127.0.0.1';
const OP_PORT = 4000;
const OP_PATH = '/' + METHOD[0];
const OP_METHOD = PUSH_METHOD;

//http.options.header
const CONTENT_TYPE = 'application/xml';
// const CONTENT_TYPE = 'application/x-www-form-urlencode';

//远程测试
// const HTTP_OPTIONS = (METHOD) => {
//   return options = {
//     hostname: '47.103.129.72',
//     port: 19193,
//     path: '/datahub/FluxWmsLgXmlApi',
//     method: PUSH_METHOD,
//     headers: {
//       'Content-Type': CONTENT_TYPE
//     }
//   }
// };

//本地测试
const HTTP_OPTIONS = (METHOD) => {
  return options = {
    hostname: OP_HOSTNAME,
    port: OP_PORT,
    path: '/' + METHOD,
    method: PUSH_METHOD,
    headers: {
      'Content-Type': CONTENT_TYPE
    }
  }
};

//其他
const RESTYPE = {SUCCESSFUL: 1, FAILED: 2, PARTIALLY_SUCCESSFUL: 3};

const ERR_CODE = {
  SUCCESS: {code: '0000', msg: '成功'},
  ERR_CHECK_DATA: {code: 'S000', msg: '数据校验异常'},
  ERR_CHECK_SIGN: {code: 'S001', msg: '验签错误'},
  ERR_SYS: {code: 'S002', msg: '系统异常'},
  ERR_DATA: {code: 'S003', msg: '数据错误'},
  ERR_CUSTOMER_ID: {code: 'S004', msg: '货主错误'},
  ERR_HAD_UPDATE: {code: 'ED0345', msg: '记录已存在且不允许修改'},
  ERR_OTHER: {code: 'S007', msg: '其他错误'}
};

const CHECK_ERR = {
  NO_WAREHOUSE_ID: '无所属仓库',
  NO_CUSTOMER_ID: '无货主ID',
  NO_PO_TYPE: '无订单类型',
  NO_PO_STATUS: '无订单状态',
  NO_DOC_NO: '无上游来源订单号',

  NO_LINE_NO: '无行号',
  NO_DETAILS_CUSTOMER_ID: '无货主ID',
  NO_POLINE_STATUS: '无行状态',
  NO_SKU: '无产品',
  NO_SKU_DESCR_C: '无产品描述',
  NO_SKU_DESCR_E: '无产品英文描述',
  NO_ORDERED_QTY: '无订单数量',
  NO_ORDERED_QTY_EACH: '无订单数量_EA',
  NO_RECEIVED_QTY: '无收货数量',
  NO_RECEIVED_QTY_EACH: '无收货数量_EA',
  NO_TOTAL_PRICE: '无总价',
  NO_UOM: '无单位',
  NO_DEDI_01: 'EDI相关信息01(处理后的booking#)'
};
const CHECK_PO_ERR = [
  {field: 'warehouseId', msg: '所属仓库', ps: '上游默认:WHCFS'},
  {field: 'customerId', msg: '货主ID', ps: 'LIGSZX2'},
  {field: 'poType', msg: '订单类型', ps: '上游默认:PR'},
  {field: 'POSTATUS', msg: '订单状态', ps: '上游默认:99'},
  {field: 'docNo', msg: '上游来源订单号', ps: '主键，处理后的booking#'},
  {field: 'lineNo', msg: '行号', ps: ''},
  {field: 'customerId', msg: '货主ID', ps: 'LIGSZX2'},
  {field: 'PoLineStatus', msg: '行状态', ps: '上游默认传:99'},
  {field: 'sku', msg: '产品', ps: '产品编码'},
  {field: 'skuDescrC', msg: '产品描述', ps: '产品描述'},
  {field: 'orderedQty', msg: '订单数量', ps: '入仓应收箱数'},
  {field: 'orderedQty_Each', msg: '订单数量_EA', ps: '入仓应收PCS'},
  {field: 'receivedQty', msg: '收货数量', ps: '实收箱数量'},
  {field: 'receivedQty_Each', msg: '收货数量_EA', ps: '实收EA数量,如果最小基本单位为箱，该数量等于箱数量'},
  {field: 'uom', msg: '单位', ps: '单位:CS或EA'},
  {field: 'dedi01', msg: 'EDI相关信息01', ps: '处理后的booking#'}
];
const CHECK_SALA_ERR = [
  {field: 'warehouseId', msg: '仓库ID', ps: '上游默认:WHCFS'},
  {field: 'customerId', msg: '货主ID', ps: 'LIGSZX2'},
  {field: 'orderType', msg: '订单类型', ps: '上游默认:CM'},
  {field: 'orderstatus', msg: '订单状态', ps: '上游默认:99'},
  {field: 'docNo', msg: '上游订单号', ps: '上游主键,出仓作业指令单号'},
  {field: 'orderTime', msg: '订单创建时间', ps: '装柜时间'},
  {field: 'consigneeId', msg: '收货人代码', ps: '固定Ligentia'},
  {field: 'consigneeName', msg: '收货人名称', ps: '固定Ligentia'},
  {field: 'lineNo', msg: '行号', ps: '行号'},
  {field: 'LineStatus', msg: '行状态', ps: '上游默认传:99'},
  {field: 'sku', msg: '产品', ps: '产品编码'},
  {field: 'qtyOrdered', msg: '订货数', ps: '订货数'},
  {field: 'qtyOrdered_Each', msg: '订货数_EA', ps: '订货数_EA，最小基本单位为箱时，该字段等于订货数'},
  {field: 'qtyShipped', msg: '发货数', ps: '发货数'},
  {field: 'qtyShipped_Each', msg: '发货数_EA', ps: '发货数_EA，最小基本单位为箱时，该字段等于发货数'},
  {field: 'customerId', msg: '货主', ps: 'LIGSZX2'},
];


const CHECK_FIELD = [
  {field: 'warehouseId', wms: 'warehouse_id'},
  {field: 'customerId', wms: '货主ID'},
  {field: 'poType', wms: '订单类型'},
  {field: 'POSTATUS', wms: '订单状态'},
  {field: 'docNo', wms: '上游来源订单号'},
  {field: 'lineNo', wms: '行号'},
  {field: 'customerId', wms: '货主ID'},
  {field: 'PoLineStatus', wms: '行状态'},
  {field: 'sku', wms: '产品'},
  {field: 'skuDescrC', wms: '产品描述'},
  {field: 'orderedQty', wms: '订单数量'},
  {field: 'orderedQty_Each', wms: '订单数量_EA'},
  {field: 'receivedQty', wms: '收货数量'},
  {field: 'receivedQty_Each', wms: '收货数量_EA'},
  {field: 'uom', wms: '单位'},
  {field: 'dedi01', wms: 'EDI相关信息01'}
];

//数据推送
var PO_DATA = {
  warehouseId: "A001",
  customerId: "LIGSZX2",
  poType: "PR",
  poStatus: "99",
  docNo: "CM",
  poReferenceA: "原始的入仓编号",
  poReferenceB: "处理后的入仓编号",
  poReferenceC: " 处理后进仓编号，-后字符",
  expectedArriveTime1: "入仓时间",
  hedi01: "入仓应收箱数，这个booking总的 应收箱数",
  hedi02: "入仓应收CBM，这个booking总的应收CBM",
  hedi03: "入仓应收KGS，这个booking总的应收weight",
  hedi04: "入仓应收PCS",
  hedi05: " 入仓实收箱数",
  hedi06: "入仓实收CBM",
  hedi07: "入仓实收KGS",
  hedi08: "入仓实收PCS",
  Supplier_Name: "Vendor name 供应商名称",
  notes: "实际订单的货主 [null]",
  details: {
    customerId: "LIGSZX2",
    poLineStatus: "99",
    sku: "产品编码",
    skuDescrC: "产品描述",
    orderedQty: "入仓应收箱数",
    orderedQty_Each: "入仓应收PCS",
    receivedQty: "实收箱数量",
    receivedQty_Each: "实 收EA数量,如果最小基本单位为箱，该数量等于箱数量",
    totalPrice: "[null]",
    uom: "单位,’CS’或’EA’",
    totalCubic: "入仓应 收CBM,每个item入仓应收CBM",
    totalGrossWeight: "入仓应收KGS,每个item入仓应收weight",
    dedi01: "处理后的booking#",
    dedi03: "实收CBM,每个item实收CBM [null]",
    dedi04: "实收KG,每个item实收weight [null]",
    dedi05: "实收PCS,每个item实收PCS [null]",
    dedi06: "单位,’CS’或’EA’ [null]",
    dedi07: "货主PO [null]",
    userDefine1: "实收L [null]",
    userDefine2: "实收W [null]",
    userDefine3: "实收H [null]",
    userDefine4: "SKU颜色 [null]",
    userDefine5: "SKU尺码 [null]"
  }
};
var SALA_DATA = {
  warehouseId: "A001",
  customerId: "LIGSZX2",
  poType: "PR",
  poStatus: "99",
  docNo: "CM",
  poReferenceA: "原始的入仓编号",
  poReferenceB: "处理后的入仓编号",
  poReferenceC: " 处理后进仓编号，-后字符",
  expectedArriveTime1: "入仓时间",
  hedi01: "入仓应收箱数，这个booking总的 应收箱数",
  hedi02: "入仓应收CBM，这个booking总的应收CBM",
  hedi03: "入仓应收KGS，这个booking总的应收weight",
  hedi04: "入仓应收PCS",
  hedi05: " 入仓实收箱数",
  hedi06: "入仓实收CBM",
  hedi07: "入仓实收KGS",
  hedi08: "入仓实收PCS",
  Supplier_Name: "Vendor name 供应商名称",
  notes: "实际订单的货主 [null]",
  details: {
    customerId: "LIGSZX2",
    poLineStatus: "99",
    sku: "产品编码",
    skuDescrC: "产品描述",
    orderedQty: "入仓应收箱数",
    orderedQty_Each: "入仓应收PCS",
    receivedQty: "实收箱数量",
    receivedQty_Each: "实 收EA数量,如果最小基本单位为箱，该数量等于箱数量",
    totalPrice: "[null]",
    uom: "单位,’CS’或’EA’",
    totalCubic: "入仓应 收CBM,每个item入仓应收CBM",
    totalGrossWeight: "入仓应收KGS,每个item入仓应收weight",
    dedi01: "处理后的booking#",
    dedi03: "实收CBM,每个item实收CBM [null]",
    dedi04: "实收KG,每个item实收weight [null]",
    dedi05: "实收PCS,每个item实收PCS [null]",
    dedi06: "单位,’CS’或’EA’ [null]",
    dedi07: "货主PO [null]",
    userDefine1: "实收L [null]",
    userDefine2: "实收W [null]",
    userDefine3: "实收H [null]",
    userDefine4: "SKU颜色 [null]",
    userDefine5: "SKU尺码 [null]"
  }
};

//柜号转换
const CONTAINER_TYPE = [
  {id: 1, name: '20GP'},
  {id: 2, name: '20HQ'},
  {id: 3, name: '20RF'},
  {id: 4, name: '20HCR'},
  {id: 5, name: '40GP'},
  {id: 6, name: '40HQ'},
  {id: 7, name: '40RF'},
  {id: 8, name: '20HCR'},
  {id: 9, name: '45HQ'},
  {id: 10, name: '53HW'},
  {id: 11, name: '58HW'},
  {id: 12, name: '20GOH'},
  {id: 13, name: '40GOH'},
  {id: 14, name: '45GOH'}
];

const COMPANY_ID = {
  LIG: 22
};


//  入仓标志,/* 0-未确认 1-已确认 2-已废止 */
const CONFIRM_STATE = {INIT: 0, CONFIRMED: 1, ABOLISHED: 2};

//  出仓仓标志,
//  tb_shipment.seal_no和tb_shipment.container_no 为 null 表示没有出仓。
//  select *where container_no <> 'NULL' and seal_no <> 'NULL' lig_push_state = 3;

var LIG_PUSH_STATE = {
  INIT: 0,
  NEED_PUSH_INBOUND: 1,
  HAS_PUSH_INBOUND: 2,
  NEED_PUSH_OUTBOUND: 3,
  HAS_PUSH_OUTBOUND: 4,
  PUSH_ERR: 5
};

module.exports.ADMIN_ROLE = ADMIN_ROLE;

module.exports.APPSECRET = APPSECRET;
module.exports.APPTOKEN = APPTOKEN;
module.exports.APPKEY = APPKEY;
module.exports.CLIENT_CUSTOMERID = CLIENT_CUSTOMERID;

module.exports.METHOD = METHOD;
module.exports.MESSADEID = MESSADEID;
module.exports.CLIENT_DB = CLIENT_DB;
module.exports.FORMAT = FORMAT;

module.exports.MESSADEID_BY_METHOD = MESSADEID_BY_METHOD;
module.exports.PUSH_METHOD = PUSH_METHOD;

module.exports.CONTENT_TYPE = CONTENT_TYPE;

module.exports.HTTP_OPTIONS = HTTP_OPTIONS;

module.exports.RESTYPE = RESTYPE;
module.exports.ERR_CODE = ERR_CODE;
module.exports.CHECK_PO_ERR = CHECK_PO_ERR;
module.exports.CHECK_SALA_ERR = CHECK_SALA_ERR;

//数据推送模型
module.exports.PO_DATA = PO_DATA;
module.exports.SALA_DATA = SALA_DATA;

module.exports.CONFIRM_STATE = CONFIRM_STATE;

module.exports.LIG_PUSH_STATE = LIG_PUSH_STATE;
module.exports.CONTAINER_TYPE = CONTAINER_TYPE;

module.exports.COMPANY_ID = COMPANY_ID;

