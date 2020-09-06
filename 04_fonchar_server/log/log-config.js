var path = require('path');

function getCommonLogPath(){
  var relativePath = '/data/fwa.log';
  return path.resolve(__dirname + relativePath);
}

function getErrLogPath(){
  var relativePath = '/data/errors.log';
  return path.resolve(__dirname + relativePath);
}

var config = {
  appenders: [
    {
      type: 'console',
      category: [ 'FWA', 'console' ]
    },
    {
      type: 'file',
      filename: getCommonLogPath(),
      maxLogSize: 15 * 1024 * 1024, // 15 MB
      backups: 100,
      category: [ 'FWA', 'console' ]
    },
    {
      type: 'logLevelFilter',
      level: 'WARN',
      appender:
      {
        type: 'file',
        filename: getErrLogPath()
      }
    }
  ],
  replaceConsole: true
};

module.exports.config = config;