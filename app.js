var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');
var mongoose = require("mongoose");
var passport = require('passport');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/files',express.static(path.join(__dirname,'uploads')));


var connect = function(){
    var options = {
        server: {
            socketOptions:{
                keepAlive : 1
            }
        }
    };
    console.log('info', 'connected to mongo db with config url : '+config.db);
    mongoose.connect(config.db,options);
};
connect();
mongoose.connection.on('error',console.log);
mongoose.connection.on('disconnected',connect);
require('./app/auth/passport')(passport); //settting up passport config


require('./config/routes')(app);
require('./config/express')(app);


module.exports = app;
