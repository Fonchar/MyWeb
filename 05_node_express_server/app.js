var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

var logger = require('./log/log.js').logger;
var httpLogger = require('./log/log.js').httpLogger;

var mSession = require('express-session');
var RedisStore = require('connect-redis')(mSession);
// var session = mSession({
//   store: new RedisStore({ttl: 60 * 10}), // 60 seconds = 1 minitues
//   secret: 'gohereXtherZ-M.oanywhere',
//   resave: false,
//   saveUninitialized: true
// });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var PORT = 4000;
var httpServer = require('http').createServer(app);

var passport = require('passport');
var flash = require('connect-flash');

var mPassport = require('./lib/passport/index.js');
mPassport.initPassport(passport);

// app.use(session);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

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
  if(req.method === "OPTIONS") res.send({state: 200});/*让options请求快速返回*/
  else  next();
});

// app.use(httpLogger);

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// required for passport
// app.use(passport.initialize());
// persistent login sessions
// app.use(passport.session());
// use connect-flash for flash messages stored in session

// load our routes and pass in our app and fully configured passport
require('./routes/routes.js')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

httpServer.listen(PORT, function(){
  logger.info('Http listening port: ' + PORT);
});

module.exports = app;
