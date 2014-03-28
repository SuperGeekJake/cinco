/**
 * Expose `Pente`.
 */
module.exports = Pente;

/**
 * Initialize a new `Pente` game with the given `options`.
 *
 * Options:
 *
 *   - `defaultEngine` the default template engine name
 *   - `engines` template engine require() cache
 *   - `root` root path for view lookup
 *
 * @param {String} name
 * @param {Object} options
 * @api private
 */
function Pente(ID, players) {
    this.ID = ID;
    this.players = players || [];
    
    // A board space can be either 0 (unclaimed) or 1 - 4 (players)
    this.board = [
    	// columns 1 - 9
		[0, 0, 0, 0, 0, 0, 0, 0, 0], // row 1
		[0, 0, 0, 0, 0, 0, 0, 0, 0], // row 2
		[0, 0, 0, 0, 0, 0, 0, 0, 0], // row 3
		[0, 0, 0, 0, 0, 0, 0, 0, 0], // row 4
		[0, 0, 0, 0, 0, 0, 0, 0, 0], // row 5
		[0, 0, 0, 0, 0, 0, 0, 0, 0], // row 6
		[0, 0, 0, 0, 0, 0, 0, 0, 0], // row 7
		[0, 0, 0, 0, 0, 0, 0, 0, 0], // row 8
		[0, 0, 0, 0, 0, 0, 0, 0, 0]  // row 9
    ];
}

Pente.prototype.runGame = function () {
	// Set player 1 to play first
	var current = 0;
	// Set up victory variables
	var p1Victory = false;
	var p2Victory = false;

	do {
		// Tell player to make his move
		// Recieve move and verify
		// Check for 4-in-a-rows, captures, and victory.
		// Broadcast board, score, and victory updates.
	} while (!p1Victory || !p2Victory); // No one has won
}

Pente.prototype.checkVictory = function (pid) {

}