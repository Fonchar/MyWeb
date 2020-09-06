
var logger = require('../../log/log.js').logger;

var sqlUserInfo = {
  username: 'fonchar',
  password: 'fonchar123456',
  state: 1 //0无效，1激活，2封号
}

function queryUserByName(username, callback) {
  if (sqlUserInfo.username == null || sqlUserInfo.username !== username) {
    return callback('用户不存在');
  }
  return callback(null, sqlUserInfo)
}

function checkUserStateShouldActive(state, callback) {
  if (state == 0) {
    return callback('用户未激活');
  }
  if (state == 2) {
    return callback('用户被封停');
  }
  return callback(null);

}

function checkPassword(reqpwd, password, callback) {
  if (reqpwd !== password) {
    //简化了加密对比
    return callback('密码错误');
  }
  callback(null);
}

var errCallBack = (msg)=> {
  return {state: 400, msg:msg, data: {}}
} 

function loginCheck(socketReq, callback) {
  queryUserByName(socketReq.username, function (errU, user) {
    if (errU) {
      console.log('socketReq------------------errU', errU);
      return callback(errCallBack(errU));
    }
    checkUserStateShouldActive(user.state, function (errS) {
      console.log('socketReq------------------errS', errS);
      if (errS) {
        return callback(errCallBack(errS));
      }
      checkPassword(socketReq.password, user.password, function (errP) {
        console.log('socketReq------------------errP', errP);
        if (errP) {
          return callback(errCallBack(errP));
        }
        //   mLoginPool.userCome(user); //异地登陆强制下线
        return callback(null, {username: user.username, state:user.state});
      });
    });
  });
}

module.exports.loginCheck = loginCheck;