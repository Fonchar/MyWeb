var DB = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'fonchar',
    connectionLimit: 100
};

var SOCKET_PORT = 3000;

var USER_EXPIRE = 60 * 20; // 20 min

const PROXY_PREFIX = '';

const REQ_FEILDS = [
    "method", "client_customerid", "client_db", "messageid", "apptoken", "appkey",
    "sign", "timestamp", "format", "data"];

module.exports.DB = DB;
module.exports.SOCKET_PORT = SOCKET_PORT;
module.exports.USER_EXPIRE = USER_EXPIRE;
module.exports.PROXY_PREFIX = PROXY_PREFIX;