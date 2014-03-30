/**
 * Expose `Pente`.
 */
module.exports = Pente;

/**
 * Initialize a new `Pente` game with the given `options`.
 * @param {String} ID
 * @param {Array} players
 */
function Pente(ID, players) {
	this.ID = ID;
	this.players = players || [];
	this.turn = 1;
	this.captures = [0,0];
	
	// A board space can be either 0 (unclaimed) or 1 - 2 (players)
	this.board = [
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
}

// COPIED FROM CONNECT 4, MAY NEED TWEAKING
Pente.prototype.getPairs = function (row, column, step) {
	l = [];

	for (var i = 0; i < 5; i++) {
		l.push([row, column]);
		row += step[0];
		column += step[1];
	}

	return l;
};

// COPIED FROM CONNECT 4, WILL NEED TWEAKING
Pente.prototype.checkHorizontal = function (row, startColumn, callback) {
	for (var i = 1; i < 19; i++) {
		var count = 0;
		var column = startColumn + 1 - i;
		var columnEnd = startColumn + 5 - i;

		if (columnEnd > 17 || column < 0) {
			continue;
		}

		var pairs = getPairs(row, column, [0,1]);

		for (var j = column; j < columnEnd + 1; j++) {
			count += games[room]['board'][row][j];
		}

		if (count == 5) {
			callback(1, pairs);
		} else if (count == -5) {
			callback(2, pairs);
		}
	}
};