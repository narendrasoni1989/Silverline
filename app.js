var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');
var mongoose = require("mongoose");
var passport = require('passport');
var multipart = require('connect-multiparty');
var jwt = require('express-jwt'); 
var app = express();
var fs = require('fs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(multipart({
    uploadDir: config.tmp
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use(express.static(path.join(__dirname, 'client/src')));
app.use('/vendor',express.static(path.join(__dirname, 'client/vendor')));
app.use('/src',express.static(path.join(__dirname, 'client/src')));
app.use('/app',express.static(path.join(__dirname, 'client/src/app')));
app.use('/common',express.static(path.join(__dirname, 'client/src/common')));
app.use('/assets',express.static(path.join(__dirname, 'client/src/assets')));
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
require('./app/auth/passport')(passport); 

var cert = fs.readFileSync('key.pem');

app.use(jwt({ secret: cert}).unless({path: ['/auth/signup',
                                            '/auth/login',
                                            '/auth/upload'
                                           ]})); // API end point in path are public 

/*app.use(function(err, req, res, next){
    if (err.constructor.name === 'UnauthorizedError') {
        console.log(" ##### Err "+err);
    }
});
*/

require('./config/routes')(app);
require('./config/express')(app);

module.exports = app;