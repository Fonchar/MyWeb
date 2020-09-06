var assert = require('assert');

var url = require('url');
assert(url.parse);

var routesAll = require('./routes-all.js');

var mUtil = require('./routes-util');
var logReq = mUtil.logReq;
assert(logReq);
var getCliEnv = mUtil.getCliEnv;
assert(getCliEnv);


var urlPathBuffer = ['/', '/putPOData']; // 所有 url path，用于判断path是否为合法，非法则返回404

function isPathValid(path) {
  let key = false;
  for (var i = 0; i < urlPathBuffer.length; i++) {
    if (urlPathBuffer[i] == path) {
      key = true;
    }
  }
  return key;
}

//路径防火墙
function antiAttack(req, res, next) {
  // logReq(req);
  if (isPathValid(req.url)) {
    return next();
  } else {
    res.end("404 - 访问不存在")
  }
}

//权限校验
function redirectCheck(req, res, next) {
  if (!req.session || !req.session.user || !req.session.user.id) {
    return res.redirect('/login');
  } else {
    return next();
  }
}

function routesCommon(app) {
  app.all('*', antiAttack, redirectCheck);
}

function routesRequets(app) {
  app.all('*', doRequets);
}

function doRequets(req, res, next) {
  if (!req.session || !req.session.user || !req.session.user.id) {
    return res.redirect('/login');
  } else {
    return next();
  }
}

function routes404(app) {
  app.all('*', function (req, res) {
    res.render('404');
  });
}

module.exports = function (app) {
  routesCommon(app);
  routesRequets(app);
  routes404(app);
};
