var socket = io.connect('jakedev');

var gameURI = window.location.pathname;
var gameID = gameURI.substr(1);
var playerID = 0;

socket.on('connect', function () {
    socket.emit('join', gameID);
});

socket.on('assign', function (data) {
	playerID = data;
	if (playerID == 0) {
		$('#player1').addClass('active');
		console.log('[NOTICE] Game created. You are Player 1.');
	} else if (playerID == 1) {
		$('#player1').addClass('active');
		$('#player2').addClass('active');
		console.log('[NOTICE] Game joined. You are Player 2.');
	} else {
		console.log('[NOTICE] Join failed. Game is full.');
	}
});

socket.on('start', function (data) {
	$('#player2').addClass('active');
});

socket.on('forfeit', function (data) {
	$('#player' + data).removeClass('active');
	console.log('[NOTICE] Game over. Player ' + data + ' has forfeit.');
});

for(var i = 0; i < 19; i++){
	$('#board table').append('<tr></tr>');

	for(var j = 0; j < 19; j++) {
		$('#board tr').last().append('<td></td>');
		$('#board td').last().addClass('box').attr('data-row', i).attr('data-column', j);
	}
}

// Testing
// $("#board td").click(function () {
// 	var $this = $(this);
// 	var row = $this.data("row") + 1;
// 	var column = $this.data("column") + 1;
// 	console.log("Board space clicked: " + row + "x" + column);

// 	if (pente.active_player == 1) {
// 		$this.addClass('player1');
// 		pente.active_player = 2;
// 	} else {
// 		$this.addClass('player2');
// 		pente.active_player = 1;
// 	}
// });