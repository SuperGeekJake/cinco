/**
 * Expose `Cinco`.
 */
module.exports = Cinco;

/**
 * Initialize a new `Cinco` game with the given `options`.
 * @param {String} ID
 * @param {Array} players
 */
function Cinco(ID, players) {
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

Cinco.prototype.checkVictory = function () {
	if (this.captures[this.turn - 1] > 4) return true;

	for (var row = 0; row < 19; row++) {
		for (var column = 0; column < 19; column++) {
			if (this.board[row][column] == this.turn) {
				return this.checkDirections(row, column);
			}
		}
	}

	return false;
}

Cinco.prototype.checkDirections = function (row, column) {
	if (this.checkHorizontal([row,column])) return true;
	if (this.checkVertical([row,column])) return true;
	if (this.checkLeftDiagonal([row,column])) return true;
	if (this.checkRightDiagonal([row,column])) return true;
};

Cinco.prototype.checkHorizontal = function (startPoint) {
	// Info: startPoint = [row, column]

	var columnEnd = startPoint[1] + 4; //total of 5 spaces
	// Are there not enough spaces to the right to make Cinco?
	if (columnEnd > 19) {
		return false;
	}

	var row = startPoint[0];
	var columnStart = startPoint[1];

	// Check the next 4 spaces
	for (var i = 1; i < 5; i++) {
		if (this.board[row][columnStart + i] != this.turn) {
			return false;
		}
	}

	return true;
};

Cinco.prototype.checkVertical = function (startPoint) {
	// Info: startPoint = [row, column]

	var rowEnd = startPoint[0] + 4; //total of 5 spaces
	// Are there not enough spaces to the right to make Cinco?
	if (rowEnd > 19) {
		return false;
	}

	var rowStart = startPoint[0];
	var column = startPoint[1];

	// Check the next 4 spaces
	for (var i = 1; i < 5; i++) {
		if (this.board[rowStart + i][column] != this.turn) {
			return false;
		}
	}

	return true;
};

Cinco.prototype.checkLeftDiagonal = function (startPoint) {
	// Info: startPoint = [row, column]
	
	var rowStart = startPoint[0];
	var columnStart = startPoint[1];

	var rowEnd = startPoint[0] + 4; //total of 5 spaces
	var columnEnd = startPoint[1] + 4; //total of 5 spaces
	// Are there not enough spaces to the right to make Cinco?
	if (rowEnd > 19 || columnEnd > 19) {
		return false;
	}

	// Check the next 4 spaces
	for (var i = 1; i < 5; i++) {
		if (this.board[rowStart + i][columnStart + i] != this.turn) {
			return false;
		}
	}

	return true;
};

Cinco.prototype.checkRightDiagonal = function (startPoint) {
	// Info: startPoint = [row, column]
	
	var rowStart = startPoint[0];
	var columnStart = startPoint[1];

	var rowEnd = startPoint[0] - 4; //total of 5 spaces
	var columnEnd = startPoint[1] + 4; //total of 5 spaces
	// Are there not enough spaces to the right to make Cinco?
	if (rowEnd < 0 || columnEnd > 19) {
		return false;
	}

	// Check the next 4 spaces
	for (var i = 1; i < 5; i++) {
		if (this.board[rowStart - i][columnStart + i] != this.turn) {
			return false;
		}
	}

	return true;
};

Cinco.prototype.checkCaptures = function (position) {
	var captures = 0;
	var row = position[0];
	var column = position[1];
	var opponent = (this.turn == 1) ? 2 : 1;

	// Check Top
	if (row - 3 > -1) {
		if (
				this.board[row - 1][column] == opponent &&
				this.board[row - 2][column] == opponent &&
				this.board[row - 3][column] == this.turn
			) {
			captures++;
			this.board[row - 1][column] = 0;
			this.board[row - 2][column] = 0;
		}
	}

	// Check Bottom
	if (row + 3 < 19) {
		if (
				this.board[row + 1][column] == opponent &&
				this.board[row + 2][column] == opponent &&
				this.board[row + 3][column] == this.turn
			) {
			captures++;
			this.board[row + 1][column] = 0;
			this.board[row + 2][column] = 0;
		}
	}

	// Check Left
	if (column - 3 > -1) {
		if (
				this.board[row][column - 1] == opponent &&
				this.board[row][column - 2] == opponent &&
				this.board[row][column - 3] == this.turn
			) {
			captures++;
			this.board[row][column - 1] = 0;
			this.board[row][column - 2] = 0;
		}
	}

	// Check Right
	if (column + 3 < 19) {
		if (
				this.board[row][column + 1] == opponent &&
				this.board[row][column + 2] == opponent &&
				this.board[row][column + 3] == this.turn
			) {
			captures++;
			this.board[row][column + 1] = 0;
			this.board[row][column + 2] = 0;
		}
	}

	// Check Top Left Diagonal
	if (row - 3 > -1 && column - 3 > -1) {
		if (
				this.board[row - 1][column - 1] == opponent &&
				this.board[row - 2][column - 2] == opponent &&
				this.board[row - 3][column - 3] == this.turn
			) {
			captures++;
			this.board[row - 1][column - 1] = 0;
			this.board[row - 2][column - 2] = 0;
		}
	}

	// Check Top Right Diagonal
	if (row - 3 > -1 && column + 3 < 19) {
		if (
				this.board[row - 1][column + 1] == opponent &&
				this.board[row - 2][column + 2] == opponent &&
				this.board[row - 3][column + 3] == this.turn
			) {
			captures++;
			this.board[row - 1][column + 1] = 0;
			this.board[row - 2][column + 2] = 0;
		}
	}

	// Check Bottom Left Diagonal
	if (row + 3 < 19 && column - 3 > -1) {
		if (
				this.board[row + 1][column - 1] == opponent &&
				this.board[row + 2][column - 2] == opponent &&
				this.board[row + 3][column - 3] == this.turn
			) {
			captures++;
			this.board[row + 1][column - 1] = 0;
			this.board[row + 2][column - 2] = 0;
		}
	}

	// Check Bottom Right Diagonal
	if (row + 3 < 19 && column + 3 < 19) {
		if (
				this.board[row + 1][column + 1] == opponent &&
				this.board[row + 2][column + 2] == opponent &&
				this.board[row + 3][column + 3] == this.turn
			) {
			captures++;
			this.board[row + 1][column + 1] = 0;
			this.board[row + 2][column + 2] = 0;
		}
	}

	return captures;
}