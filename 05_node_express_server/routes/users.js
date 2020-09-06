var assert = require('assert');

var logger = require('../log/log.js').logger;
assert(logger);

var loginCheck = require('../lib/passport/user-simple.js').loginCheck;

// var mUserPassport = require('../lib/controllers/user/user-passport.js');
// assert(mUserPassport.FLASH_MSG_LOGIN);

function login(app, passport){
  var passportStrategy = {
    successRedirect : '/index',
    failureRedirect : '/',
    failureFlash : true
  };
  // app.get('/', function(req, res) {
  //   if(req.user && req.user.state == mUser.STATE.ACTIVE){
  //     res.redirect('/func-config');
  //   }else{
  //     res.render('login', {message: req.flash(mUserPassport.FLASH_MSG_LOGIN)});
  //   }
  // });
  // app.post('/login', passport.authenticate('local-login', passportStrategy), function(req, res){
  //   if(req.body.remember) {
  //     req.session.cookie.maxAge = 1000 * 60 * 3;
  //   } else {
  //     req.session.cookie.expires = false;
  //   }
  // });
  app.post('/login', function(req, res){
    loginCheck(req.body, function(err, user) {
      console.log('------------------err', err);
      if (err) {
        res.send(err);
      }else{
        res.send({state: 200, msg:'ok', data: user});
      }
      res.end();
    })
  });
}

function logout(app){
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
}

module.exports = function(app, passport){
  login(app, passport);
  logout(app);
};

function requiresOk(){
  return true;
}
module.exports.requiresOk = requiresOk;