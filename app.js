// Express
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('pente');

// Socket.io
var io = require('socket.io');

var routes = require('./routes');
var users = require('./routes/user');

var app = express();

//
var Pente = require('./pente');

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(app.router);

app.get('/', routes.index);

app.get('/game/:gametype', routes.game);
app.get('/game/:id([A-Za-z0-9]{6})', routes.join);

app.get('/quit', function (req, res) {
    res.redirect('/');
});

// app.get('/users', users.list);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if ( app.get('env') === 'development' ) {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = io.listen(app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + app.get('port'));
}));

// var options = {
//     p1Socket: 51574,
//     gametype: "teams"
// };

// var game01 = new Pente(options);
// console.log(game01);

server.set('log level', 2);
// server.sockets.on('connection', function (socket) {
//   console.log("New Player has joined the server.");
// });