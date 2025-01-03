var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const diamondsRouter = require('./routes/diamonds');
const jewelriesRouter = require('./routes/jewelries');

var app = express();

// 连接到 MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
    origin: 'http://localhost:9090', // 允许前端域名
    credentials: true, // 允许携带凭证
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(logger('dev'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/diamonds', diamondsRouter);
app.use('/jewelries', jewelriesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // 设置本地变量，仅在开发环境提供错误信息
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 返回 JSON 格式的错误信息
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status,
      stack: req.app.get('env') === 'development' ? err.stack : undefined
    }
  });
});

module.exports = app;
