var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var DB = require('./config/DB');
var mongo_config = require('./config/mongo_config');

var routes = require('./routes/index');
var users = require('./routes/users');
var chapters = require('./routes/chapters');



var app = express();

// DB stuff specifcally Mongo
mongoose.connect("mongodb://localhost/gavins_blog", mongo_config);

var chaptersSchema = mongoose.Schema({
  title: String,
  body: String,
  photo: String,
  date: { type: Date, default: Date.now }
});

var Chapter = mongoose.model("Chapter", chaptersSchema);

DB.setDB(Chapter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/chapters', chapters);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(err);
        console.log(err.stack);
        res.send({
            message: err.message,
            error: {}
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    console.log(err.stack);
    res.send({
        message: err.message,
        error: {}
    });
});


module.exports = app;
