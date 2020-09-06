const CONFIG = {
  //日志配置
  LOG: {
    FILE_NAME: 'Fonchar',
    FILE_SIZE: 30 * 1024 * 1024,
    CONSOLE_FLAG:'FF'
  }
}

var DB = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'fonchar',
  connectionLimit: 100
};

var PAGESIZE = 20

var DEFAULT_PASSWORD = '888888';

module.exports.CONFIG = CONFIG;
module.exports.DB = DB;
module.exports.PAGESIZE = PAGESIZE;
module.exports.DEFAULT_PASSWORD = DEFAULT_PASSWORD;