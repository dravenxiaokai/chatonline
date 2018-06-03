var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var ws = require('ws');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var chatRouter = require('./routes/chat');

var app = express();
var bodyParser = require('body-parser');

var dbUrl = 'mongodb://localhost:27017/chatonline';

// mongoose.connect(dbUrl, {
//   useMongoClient: true
// })
mongoose.connect(dbUrl);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({}));
app.use(cookieParser());
app.use(session({
  secret: 'user', //密钥
  saveUninitialized: true, // don't create session until something stored 
  cookie: { maxAge: 20 * 60 * 1000 }, //cookie生存周期20*60秒
  resave: true, //如果修改了重新保存
  auto_reconnect: true, //自动重连
  store: new MongoStore({
    url: dbUrl,
    collection: 'sessions'
  })//将session内容存到sessions集合中
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/chat', chatRouter);

// var subscriptions = new Set();
// var wsServer = new ws.Server({ port: 9090 });
// wsServer.on('connection', function (websocket) {
//   subscriptions.add(websocket);
// });
// var messageCount = 0;
// setInterval(function () {
//   subscriptions.forEach(function (ws) {
//     if (ws.readyState === 1) {
//       ws.send(JSON.stringify({ messageCount: messageCount++, retCode: 0 }));
//     }
//     else {
//       subscriptions.delete(ws);
//     }
//   });
// }, 2000);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
