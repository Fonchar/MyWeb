var assert = require('assert');

var Limiter = require('ratelimiter');

const formidable = require('formidable');
const path = require('path');

var ms = require('ms');

var url = require('url');
assert(url.parse);

var fs = require('fs');
var mPath = require('path');

var logger = require('../log/log.js').logger;

var redis = require('redis');
var redisCli = redis.createClient();

var routesUser = require('./users.js');
var routesComm = require('./comm.js');
var routesArticle = require('./article.js');
// var routesTestResource = require('./routes-test-resource.js');

// var mUtil = require('./routes-util');
// var getCliEnv = mUtil.getCliEnv;
// assert(getCliEnv);

var urlPathBuffer = ['/', '/index', '/login']; // 所有 url path，用于判断path是否为合法，非法则返回404

var pathList = ['/404', '/error', '/', '/logout', '/func-config'];

function isPathAuthOk(req) {
  var path = req.url;

  for (var j = 0; j < pathList.length; j++) {
    var onePath = pathList[j];
    if (path == onePath) {
      return true;
    }
  }
  return false;
}

function getViewPath() {
  var relativePath = '../views';
  return mPath.resolve(__dirname, relativePath);
}

function initUrlPathBuffer(callback) {
  try {
    var strPath = getViewPath();
    var filesInPath = fs.readdirSync(strPath);
    for (var i = 0; i < filesInPath.length; i++) {
      var fileI = filesInPath[i];
      var tail = fileI.indexOf('.jade');
      if (tail <= 0) {
        continue;
      }
      if (fileI == '404.jade') {
        continue;
      }
      var path = '/' + fileI.substr(0, tail);
      urlPathBuffer.push(path);
    }
    logger.info('System init (5) routes init');
    return callback();
  } catch (e) {
    logger.error(e);
    return callback();
  }
}

function isPathValid(path) {
  if (path == '/logout') {
    return true;
  }
  for (var i = 0; i < urlPathBuffer.length; i++) {
    if (urlPathBuffer[i] == path) {
      return true;
    }
  }
  return false;
}

function antiAttack(req, res, next) {
  var id = req.connection.remoteAddress; // ip address
  var limiter = new Limiter({ id: id, db: redisCli, max: 20, duration: ms('20s') });
  limiter.get(function (err, limit) {
    if (err) {
      logger.warn(err);
      return next(err);
    }
    res.set('X-RateLimit-Limit', limit.total);
    res.set('X-RateLimit-Remaining', limit.remaining - 1);
    res.set('X-RateLimit-Reset', limit.reset);
    // all good
    logger.info('rate limit remaining %s/%s %s', limit.remaining - 1, limit.total, id);
    if (limit.remaining) {
      return next();
    }
    // not good
    var delta = limit.reset * 1000 - Date.now() | 0;
    var after = limit.reset - Date.now() / 1000 | 0;
    res.set('Retry-After', after);
    res.status(429).send('Rate limit exceeded, retry in ' + ms(delta, { long: true }));
  });
}

function url4Tourist(req) {
  var path = getPath(req);
  return path == '/admin' || path == '/' || path == '/signup';
}

function getPath(req) {
  var wholeUrl = req.url;
  return url.parse(wholeUrl).pathname;
}

function redirectCheck(req, res, next) {
  if (!isPathValid(req.url)) {
    return res.render('404');
  }
  if (url4Tourist(req)) {
    return next();
  }
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  if (!isPathAuthOk(req)) {
    return res.redirect('/func-config');
  }
  return next();
}

function routesCommon(app) {
  // 访问权限校验
  app.get('*', antiAttack, redirectCheck);
}

function routesFuncs(app) {
  app.get('/index', function (req, res, next) {
    res.render('index');
  });
  app.get('/', function (req, res, next) {
    res.json({ name: 'jack', age: 19 });
    res.end();
  });
}

function routes404(app) {
  app.all('*', function (req, res) {
    res.render('404');
  });
}

module.exports = function (app, passport) {
  // routesCommon(app);
  // routesUser(app, passport);
  routesUser(app, 'passport');
  //   routesTestResource(app);
  routesComm(app);
  routesArticle(app);
  routesFuncs(app);
  routes404(app); // 404 是垫底的，必须放最后
};

module.exports.initUrlPathBuffer = initUrlPathBuffer;

function requiresOk() {
  return true;
}
module.exports.requiresOk = requiresOk;