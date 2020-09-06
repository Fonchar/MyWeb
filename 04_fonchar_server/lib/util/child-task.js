const cp = require('child_process');

const {codes ,wrapSSErr} = require('../err');

//当同时监听 'exit' 和 'error' 事件时，则需要防止意外地多次调用处理函数
const parentProcess = (parentMassge, scriptPath) => {
  return new Promise((res, rej) => {
    const child = cp.fork(scriptPath, []);
    let invoked = false;
    child.send(parentMassge);
    child.on('error', err => {
        if(invoked) {
          return;
        }
        invoked = true;
        if(err){
          rej(wrapSSErr('ERROR: Child process execution error', codes.CHILD_PROCESS_ERROR));
        }
    });
    child.on('exit', code => {
        if(invoked){
          return;
        }
        invoked = true;
        if(code != 0){
          rej(wrapSSErr('ERROR: Child process exit error', codes.CHILD_PROCESS_EXIT));
        }
    });
    child.on('message', childMessage => {
        res(childMessage);
    });
  });
};

//子进程接受父进程传递的消息
const childProcess = (callback) => {
  process.on('message', message => {
    return callback(message);
  });
};

//结束进程 并返回结果
const endProcess = (result) => {
  process.send(result);
  process.exit(0);
};

module.exports = {
  parentProcess,
  childProcess,
  endProcess,
};