var assert = require('assert');

var log4js = require("log4js");
var bcrypt = require('bcrypt-nodejs');
assert(bcrypt.hashSync);
assert(bcrypt.compareSync);

var db = require('../db/db.js');
assert(db.excuteSql);
assert(db.checkUniqueMultiFields);

var sqlSplitter = require('../db/sql-splitter');
assert(sqlSplitter.subsqlFuzzySearch);
assert(sqlSplitter.subsqlEqual);

var dbUtil = require('../db/db-util.js');
assert(dbUtil.paginationQuery);

var mTbOp = require('../db/tb-op.js');
assert(mTbOp.getSimpleTbOp);

var logger = require('../../log/log.js');
assert(logger.info);
assert(logger.warn);

var mErr = require('../../err.js');
var errCodes = mErr.codes;
assert(errCodes);
var wrapSSErr = mErr.wrapSSErr;
assert(wrapSSErr);

var mLoginPool = require('../worker-login-pool.js');
assert(mLoginPool.userCome);

var randomInt = require('random-js')();
assert(randomInt);

var mConf = require('../../config/index.js');
assert(mConf.DEFAULT_PASSWORD);


var mEmail = require('../../util/email-util-v2.js');
assert(mEmail.sendEmailsVerify);
assert(mEmail.sendEmailsReConfig);

var STATE = {ACTIVE: 0, INACTIVE: 1, DELETED: 4};

var TABLE_NAME = 'tb_user';
var FIELDS_CREATE = ['name', 'real_name', 'password', 'signup_date', 'email','role', 'memo'];
var FIELDS_UPDATE = ['name', 'real_name', 'role', 'memo','email', 'state'];
var FIELDS_CHANGE_PW = ['password'];
var FIELDS_DELETE = ['state'];

function checkPassword(pw, pwEncrypted, callback){
  try{
    if(!bcrypt.compareSync(pw, pwEncrypted)){
      return callback(wrapSSErr('Password error', errCodes.PASSWORD_INVALID));
    }
    return callback();
  }catch(e){
    logger.error(e);
    return callback(wrapSSErr('Bcrypt error', errCodes.BCRYPT_USE));
  }
}

function makeEncryptedPassword(password, callback){
  var encryptedPassword;
  try{
    encryptedPassword = bcrypt.hashSync(password, null, null);
    return callback(null, encryptedPassword);
  }catch(e){
    return callback(wrapSSErr(e, errCodes.BCRYPT_MAKE));
  }
}

function createUser(socketReq, callback){
  userNameUniqueCheck(socketReq.name, function(errC){
    if(errC){
      return callback(errC);
    }
    checkEmail(socketReq.email,function(err,data){
      if(err){
        return callback(err);
      }
      makeEncryptedPassword(mConf.DEFAULT_PASSWORD, function(errE, encryptedPassword){
        if(errE){
          return callback(errE);
        }
        socketReq.password = encryptedPassword;
        socketReq.signup_date = new Date();
        var tbOp = mTbOp.getSimpleTbOp(TABLE_NAME, FIELDS_CREATE);
        tbOp.add(socketReq, callback);
      });
    });
   
  });
}

function changePassword(socketReq, callback){
  var userId = socketReq.id? socketReq.id: socketReq.user_id;
  var tbOpShow = mTbOp.getSimpleTbOp(TABLE_NAME, FIELDS_CREATE);
  tbOpShow.show({id: userId}, function(errS, user){
    if(errS){
      return callback(errS);
    }
    checkPassword(socketReq.password, user.password, function(errP){
      if(errP){
        return callback(errP);
      }
      makeEncryptedPassword(socketReq.new_password, function(errE, encryptedPassword){
        if(errE){
          return callback(errE);
        }
        var tbOpUpdate = mTbOp.getSimpleTbOp(TABLE_NAME, FIELDS_CHANGE_PW);
        tbOpUpdate.update({id: userId, password: encryptedPassword}, callback);
      });
    });
  });
}

function queryAllUsers(socketReq, callback){
  var sql = ['select * from tb_user where state <> ?',
             sqlSplitter.subsqlFuzzySearch(socketReq, 'name'),
             sqlSplitter.subsqlFuzzySearch(socketReq, 'real_name'),
             sqlSplitter.subsqlEqual(socketReq, 'role')].join(' ');
  dbUtil.paginationQuery(socketReq, sql, [STATE.DELETED], callback);
}

function deleteUser(socketReq, callback){
  var tbOp = mTbOp.getSimpleTbOp(TABLE_NAME, FIELDS_DELETE);
  tbOp.update({id: socketReq.id, state: STATE.DELETED}, callback);
}

function updateUser(socketReq, callback){
  checkEmail(socketReq.email,function(err,data){
    if(err){
      return callback(err);
    }
    userNameUniqueCheck(socketReq.name, function(errC){
      if(errC){
        return callback(errC);
      }
      var tbOp = mTbOp.getSimpleTbOp(TABLE_NAME, FIELDS_UPDATE);
      tbOp.update(socketReq, callback);
    }, socketReq.id);
  });
}

function userNameUniqueCheck(name, callback, selfId){
  var conf = {table_name: 'tb_user',
              fields: [{name: 'name',  value: name},
                       {name: 'state', value: STATE.ACTIVE}],
              self_id: selfId, err_code: errCodes.USER_NAME_UNIQUE};
  db.checkUniqueMultiFields(conf, callback);
}

function queryUserByName(name, callback){
  var sql = 'select id, name, password, email,state, role from tb_user where name = ? and state = ?';
  db.excuteSql(sql, [name, STATE.ACTIVE], function(err, rows){
    if(err){
      return callback(err);
    }
    if(!rows.length){
      return callback(wrapSSErr('User invalid', errCodes.USER_INVALID));
    }
    callback(null, rows[0]);
  });
}

function checkUserStateShouldActive(state, callback){
  if(state != STATE.ACTIVE){
    return callback(wrapSSErr('Inactive state user', errCodes.USER_INACTIVE));
  }
  return callback();
}

function loginCheck(socketReq, callback){
  queryUserByName(socketReq.name, function(errU, user){
    if(errU){
      return callback(errU);
    }
    checkUserStateShouldActive(user.state, function(errS){
      if(errS){
        return callback(errS);
      }
      checkPassword(socketReq.password, user.password, function(errP){
        if(errP){
          return callback(errP);
        }
        mLoginPool.userCome(user);
        return callback(null, user);
      });
    });
  });
}

function forgetPassword(socketReq, callback){
  queryUserByName(socketReq.name, function(errU, userInfo){
    if(errU){
      return callback(errU);
    }
    makeTmpPassword(function(errP, pwInfo){
      if(errP){
        return callback(errP);
      }
      updatePw(userInfo.id, pwInfo.encrypted, function(errS){
        if(errS){
          return callback(errS);
        }
        if(userInfo.email==null){
          return callback(wrapSSErr('email not exit', errCodes.EMAIL_NO_EXIT));
        }
        sendEmailForTmpPassword(userInfo.email, pwInfo.pw, function(errE){
          if(errE){
            return callback(errE);
          }
          callback(null, {});
        });
      });
    });
  });
}

function makeTmpPassword(callback){
  try{
    var pw = String(randomInt.integer(100000, 999999));
    console.info(pw);
    var encrypted = bcrypt.hashSync(pw, null, null);
    return callback(null, {pw: pw, encrypted: encrypted});
  }catch(e){
    return callback(e);
  }
}

function updatePw(userId, encryptedPassword, callback){
  var sql = 'update tb_user set password = ? where id = ?';
  db.excuteSql(sql, [encryptedPassword, userId], callback);
}

function sendEmailForTmpPassword(oneEmail, pw, callback){
  var email={};
  email.send_to=oneEmail;
  email.subject= '系统安全邮件';
  email.body=['<p>您好：</p><p>请使用如下临时密码登录系统，并及时修改密码。</p>',
              '<p>临时密码：' + pw + '</p>'].join('');
  mEmail.sendEmail(email);
  callback(null, {});
}

function checkEmail(email,callback){
  var sReg = /[_a-zA-Z\d\-\.]+@[_a-zA-Z\d\-]+(\.[_a-zA-Z\d\-]+)+$/;
  if ( ! sReg.test(email) ){
  return callback(wrapSSErr('email format error', errCodes.EMAIL_FORMAT_ERROR));;
  }
  return callback(null,email);
  }

module.exports.forgetPassword = forgetPassword;
module.exports.queryAllUsers = queryAllUsers;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.STATE = STATE;

module.exports.changePassword = changePassword;

module.exports.loginCheck = loginCheck;

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;