/* Libraries
   ========================================================================== */

var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('pente');
var io = require('socket.io');
var Pente = require('./pente');
var _ = require('underscore');

var app = express();
var games = {};


/* App Variables
   ========================================================================== */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('title', 'Pente');


/* Settings
   ========================================================================== */

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(app.router);

/* Error Handlers */

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

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});


/* Functions
   ========================================================================== */

function generateID(length) {
	var haystack = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var ID = '';
	do {
		for(var i = 0; i < length; i++) {
			ID += haystack.charAt(Math.floor(Math.random() * 62));
		}
	} while (ID === games.ID);

	return ID;
};


/* Routes
   ========================================================================== */

app.get('/', function (req, res) {
	var gameID = generateID(6);
	res.redirect(gameID);
});

app.get('/:ID([A-Za-z0-9]{6})', function (req, res) {
	res.render('index', {
		title: app.get('title'),
		game: true,
		ID: req.params.ID
	});
});

app.get('/quit', function (req, res) {
	res.redirect('/');
});


/* Run App
   ========================================================================== */

var server = io.listen(app.listen(app.get('port'), function() {
	debug('Express server listening on port ' + app.get('port'));
}));


/* Sockets
   ========================================================================== */

server.set('log level', 2);

server.sockets.on('connection', function (socket) {
	socket.on('join', function (data) {
		// Setup Game ID
		socket.game = data;
		// Join game room whether as a player or observer
		socket.join(socket.game);
		// If game is already created
		if (games[socket.game]) {
			var game = games[socket.game];

			// If there's a spot open, add you as a player
			if (game.players.length == 1) {
				game.players.push(socket);
				socket.pid = 2;
				socket.emit('assign', socket.pid);
				// Notify room of second player
				socket.broadcast.to(socket.game).emit('start');
				// Send turn request
				server.sockets.to(socket.game).emit('notify', {
					board: game['board'],
					captures: game['captures'],
					turn: game['turn']
				});
			} else {
				socket.pid = 0;
				socket.emit('assign', socket.pid);
			}

		} else {
			var game = new Pente(socket.game, [socket]);
			games[socket.game] = game;
			socket.pid = 1;
			socket.emit('assign', socket.pid);
		}
	});

	socket.on('disconnect', function () {
		if (socket.pid != 0) {
			delete games[socket.game];
			socket.broadcast.to(socket.game).emit('forfeit', socket.pid);
		}
	});

	// Player has made move
	socket.on('turn', function (data) {
		var game = games[socket.game];

		// Check if player's turn
		if (game['turn'] == socket.pid) {
			// Check if move is illegal
			if (game['board'][data.row][data.column] == 0) {
				// Update board
				game['board'][data.row][data.column] = socket.pid;

				// Check for Victory
				if (game.checkVictory()) {
					// Delete game and notify room of player's victory
					delete games[socket.game];
					server.sockets.to(socket.game).emit('victory', {
						board: game['board'],
						captures: game['captures'],
						victor: game['turn']
					});
				} else {
					// Change player turn
					game['turn'] = (game['turn'] == 1) ? 2 : 1;
					// Send game update
					server.sockets.to(socket.game).emit('notify', {
						board: game['board'],
						captures: game['captures'],
						turn: game['turn']
					});
				}
			} else {
				// Notify the user to try again
				server.sockets.to(socket.game).emit('notify', {
					board: game['board'],
					captures: game['captures'],
					turn: game['turn']
				});
			}
		}
	});
});