var socket = io.connect('jakedev');

/* Client Side Game Class */
var pente = function() {
	this.grid_size = 19;
	this.active_player = 1;
}

for(var i = 0; i < pente.grid_size; i++){
	$('#board table').append('<tr></tr>');

	for(var j = 0; j < pente.grid_size; j++) {
		$('#board tr').last().append('<td></td>');
		$('#board td').last().addClass('box').attr('data-row', i).attr('data-column', j);
	}
}

// Testing
$("#board td").click(function () {
	var $this = $(this);
	var row = $this.data("row") + 1;
	var column = $this.data("column") + 1;
	console.log("Board space clicked: " + row + "x" + column);

	if (pente.active_player == 1) {
		$this.addClass('player1');
		pente.active_player = 2;
	} else {
		$this.addClass('player2');
		pente.active_player = 1;
	}
});