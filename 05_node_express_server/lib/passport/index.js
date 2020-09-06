var assert = require('assert');

var LocalStrategy = require('passport-local').Strategy;

var mUser = require('./user-simple.js');
assert(mUser.loginCheck);

var mSession = require('./session.js');
assert(mSession.kickLoginSession);

var FLASH_MSG_LOGIN = 'loginMessage';
var STRATEGY_OPTIONS = { usernameField: 'name', passwordField: 'password', passReqToCallback: true };

function getLocalStrategyLogin() {
  return new LocalStrategy(STRATEGY_OPTIONS, handleLogin);
}

function pushFieldsToSession(user, callback) {
  callback(null, user);
}

function justSameWithSession(user, callback) {
  return callback(null, user);
}

function flashErr(req, errCode, callback) {
  req.flash(FLASH_MSG_LOGIN, errCode);
  callback(null, false);
}

function handleLogin(req, name, password, callback) {
  mUser.loginCheck({ name: name, password: password }, function (err, user) {
    if (err) {
      return flashErr(req, err.code, callback);
    }
    mSession.kickLoginSession(name, function (errK) {
      if (errK) {
        req.flash(FLASH_MSG_LOGIN, errK.code);
        return callback(null, false);
      }
      callback(null, user);
    });
  });
}

function initPassport(passport) {
  passport.serializeUser(pushFieldsToSession);
  passport.deserializeUser(justSameWithSession);
  passport.use('local-login', getLocalStrategyLogin());
}

module.exports.initPassport = initPassport;
module.exports.FLASH_MSG_LOGIN = FLASH_MSG_LOGIN;

function requiresOk() {
  return true;
}
module.exports.requiresOk = requiresOk;