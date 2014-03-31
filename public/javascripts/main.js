var socket = io.connect('jakedev');

var gameURI = window.location.pathname;
var gameID = gameURI.substr(1);
var playerID;
var turn = false;
var board = [
	// columns 1 - 19
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 01
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 02
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 03
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 04
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 05
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 06
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 07
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 08
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 09
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 10
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 11
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 12
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 13
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 14
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 15
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 16
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 17
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 18
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  // row 19
];

socket.on('connect', function () {
	socket.emit('join', gameID);
});

socket.on('assign', function (data) {
	playerID = data;
	if (playerID == 1) {
		$('#player1').addClass('active');
		console.log('[NOTICE] Game created. You are Player 1.');
	} else if (playerID == 2) {
		$('#player1').addClass('active');
		$('#player2').addClass('active');
		console.log('[NOTICE] Game joined. You are Player 2.');
	} else {
		$('#player1').addClass('active');
		$('#player2').addClass('active');
		console.log('[NOTICE] Join failed. Game is full.');
	}
});

/**
 * Sent to everyone except Player 2 to notify of Player 2 joining
 */
socket.on('start', function () {
	$('#player2').addClass('active');
	console.log('Player 2 has joined. Game is ready.');
	// Notify players game is ready for play.
});

/**
 * Processes game update from server
 * @param {Object} data Contains the baord, turn, and captures.
 */
socket.on('notify', function (data) {
	// Display whose turn it is
	var notTurn = (data.turn == 1) ? 2 : 1;
	$('#player' + notTurn).removeClass('current');
	$('#player' + data.turn).addClass('current');


	// If player's turn, active the board
	if (data.turn == playerID) {
		turn = true;
		$('#board table').addClass('active');
	}

	// Update board
	for (var i = 0; i < 19; i++) {
		for (var j = 0; j < 19; j++) {
			if (data.board[i][j] != board[i][j]) {
				var target = $('#board td[data-row="' + i + '"][data-column="' + j + '"]');
				target.removeClass();
				target.addClass('active p' + data.board[i][j]);
			}
		}
	}

	// Save updated board
	board = data.board;

	// Update capture scores
	$('#p1-captures').text(data.captures[0]);
	$('#p2-captures').text(data.captures[1]);
});

socket.on('forfeit', function (data) {
	var player = data;
	$('.player-info').removeClass('current');
	$('#player' + player).removeClass('active');
	$('#board td').removeClass();
	console.log('[NOTICE] Game over. Player ' + player + ' has forfeit.');
});

socket.on('reset', function (data) {
	$('#board td').removeClass();
});

// Create game board
for(var i = 0; i < 19; i++){
	$('#board table').append('<tr></tr>');

	for(var j = 0; j < 19; j++) {
		$('#board tr').last().append('<td></td>');
		$('#board td').last().addClass('box').attr('data-row', i).attr('data-column', j);
	}
}

// Get board clicks
$('#board td').click(function () {
	if (turn && !$(this).hasClass('active')) {
		turn = false;
		$('#board table').removeClass('active');

		socket.emit('turn', {
			row: $(this).data('row'),
			column: $(this).data('column')
		});
	}
});