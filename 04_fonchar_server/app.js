var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var config = require('./config');
var DB = config.DB;
var SOCKET_PORT = config.SOCKET_PORT;
var USER_EXPIRE = config.USER_EXPIRE;
var PROXY_PREFIX = config.PROXY_PREFIX;

var loger = require('log-helper');
var mSession = require('express-session');
var redisStore = require('connect-redis')(mSession);

var app = express();
var passport = require('passport');

//定时任务
require('./lib/controllers/scheduer/scheduer');

var session = mSession({
  // store: new redisStore({ ttl: USER_EXPIRE }),
  resave: false,
  saveUninitialized: true,
  secret: 'this is string key',
  cookie: {
    maxAge: 1000 * 60 * 30
  }
});

app.use(session);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 允许跨域
app.all('*', function(req, res, next) {
  console.log(req.headers.origin)
  console.log(req.environ)
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  // res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials","true");
  res.header("X-Powered-By",' 3.2.1')
  if(req.method === "OPTIONS") res.send(200);/*让options请求快速返回*/
  else  next();
});

app.use(PROXY_PREFIX + '/putPOData', express.static(__dirname + '/public/putPOData'));
app.use(PROXY_PREFIX + '/putSOData', express.static(__dirname + '/public/putSOData'));
// app.use('/putPOData',require('./lib/putPoData/putPoData.js'));
// app.use('*',require('./routes/routess.js'));

//路由
// var routess= require('./routes/routess.js');
// app.post('*',routess(app))

require('./routes/routess.js')(app);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handlers
// if (app.get('env') === 'development') {
//   app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

app.listen(SOCKET_PORT, function () { //在3000端口启动
  loger.info('端口启动 http://localhost:' +SOCKET_PORT);
});

module.exports = app;
