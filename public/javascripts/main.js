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

socket.on('start', function (data) {
	$('#player2').addClass('active');
});

socket.on('notify', function (data) {
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
				target.addClass('p' + data.board[i][j]);
			}
		}
	}

	// Save updated board
	board = data.board;
});

socket.on('forfeit', function (data) {
	var player = data + 1;
	$('#player' + player).removeClass('active');
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
	if (turn) {
		turn = false;
		$('#board table').removeClass('active');

		socket.emit('turn', {
			row: $(this).data('row'),
			column: $(this).data('column')
		});
	}
});