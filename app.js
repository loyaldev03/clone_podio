var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var https = require('https');


var mongoose = require('mongoose');
var passport = require('passport');

mongoose.connect('mongodb://localhost/news');
require('./models/Users');
require('./models/Workspaces');
require('./models/Appps');
require('./models/Items');
require('./models/Fields');
require('./models/Values');
require('./models/Properties');
require('./config/passport');

var index = require('./routes/index');
var statistics_api = require('./routes/statistics_api');
var authenticate_api = require('./routes/authenticate_api');
var workspace_api = require('./routes/workspace_api');
var appp_api = require('./routes/appp_api');
var item_api = require('./routes/item_api');
var social_login = require('./routes/social_login');
var field_api = require('./routes/field_api');
var property_api = require('./routes/property_api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'SECRET'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', index);
app.use('/api/v1/', statistics_api);
app.use('/api/v1/', authenticate_api);
app.use('/api/v1/', workspace_api);
app.use('/api/v1/', appp_api);
app.use('/api/v1/', item_api);
app.use('/api/v1/', field_api);
app.use('/api/v1/', property_api);
app.use('/', social_login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;

