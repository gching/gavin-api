var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var device = require('express-device');
//var mongoose = require('mongoose');
//var expressSession = require('express-session');

// Setup cloudinary with it's configuration in root/config
// If it is not there, console warn saying theres an error!
var cloudinary = require('cloudinary');
var cloudinary_config = require('./config/cloudinary_config');
if (!cloudinary_config){
  console.warn("Cloudinary config not defined!");
} else {
  cloudinary.config(cloudinary_config);
}




/*
var DB = require('./config/DB');
var mongo_config = require('./config/mongo_config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
*/

var routes = require('./routes/index');
//var users = require('./routes/users');
//var chapters = require('./routes/chapters');



var app = express();

// DB stuff specifcally Mongo
/** Remove mongo stuff till blog is completed **
mongoose.connect("mongodb://localhost/gavins_blog", mongo_config);

var chaptersSchema = mongoose.Schema({
  title: String,
  body: String,
  photo: String,
  date: { type: Date, default: Date.now }
});

var Chapter = mongoose.model("Chapter", chaptersSchema);

DB.setDB(Chapter);
*/

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(device.capture());
//app.use(expressSession({secret: 'mySecretKey'}));
//app.use(passport.initialize());
//app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));


// PreRequest Handler
preRequestHandler(app);

app.use('/', routes);
//app.use('/chapters', chapters);


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


/**
  #preRequestHandler
  Helps setup Cloudinary to be accessed in view templates and setups the device
  information to be accessed as well.
  We also set in transforms for Cloudinary and depending on the device, we set
  the width the picture should be fetched at, as well as quality.
  @param{app} - Express app
*/
function preRequestHandler(app){

  // Enable requests to gain helpers for detecting what the device of the request
  // is.
  device.enableDeviceHelpers(app);

  app.use(function(req, res, next){
    if (!cloudinary_config){
      throw new Error("Missing Cloudinary configuration");
    } else {

      // Expose cloudinary
      res.locals.cloudinary = cloudinary;

      // Setup the transform objects for Cloudinary
      // We basically scale the image down to the device's resolution.
      // Phone has w600, Tablet has w992, and Desktop has w1920 (default)
      // We also have a card width for images that are carded.
      var pic_width;
      var card_width;
      var card_width_2;
      if (res.locals.is_mobile){
        pic_width = card_width = card_width_2 = 600;
      } else if (res.locals.is_tablet){
        pic_width = card_width = card_width_2 = 992;
      } else { // Desktop and others.
        pic_width = 1920;
        card_width = 640;
        card_width_2 = 960;
      }
      // Setup the main transform that most images uses for fetching as well
      // as commonly used tranfroms.
      res.locals.trans = {

        // Expose transform of fetch: auto and flag: progressive
        // Pretty much used for everything other then specific images
        common: {
          fetch_format: "auto",
          flags: "progressive",
          width: pic_width,
          crop: "scale",
          quality: 40
        },

        // Expose transform for card pictures that just have a smaller width.
        // Mainly for cards split in a row of 3
        common_card: {
          fetch_format: "auto",
          flags: "progressive",
          width: card_width,
          crop: "scale",
          quality: 50

        },

        // Expose a transform for card pictures that split the grid in 2
        common_card_2: {
          fetch_format: "auto",
          flags: "progressive",
          width: card_width_2,
          crop: "scale",
          quality: 40

        },

        // Expose common transform and setting width to 100 - For logos
        common_logo_w: {
          width: 100,
          crop: "scale",
          fetch_format: "auto",
          flags: "progressive",
          quality: 80

        },

        // Expose common transform and setting height to 100 - For logos
        common_logo_h: {
          height: 100,
          crop: "scale",
          fetch_format: "auto",
          flags: "progressive",
          quality: 80

        },


        // Expose a special transform for specifically lossy converting PNG to JPEG
        common_lossy:{
          fetch_format: "auto",
          flags: ["progressive", "lossy"],
          quality: 75

        }
      };


      next();
    }
  });
}

module.exports = app;
