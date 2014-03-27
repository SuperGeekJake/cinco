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
function Pente(options) {
	options = options || {};
	this.gametype = options.gametype || "versus";
	this.player1 = options.p1Socket;

	var haystack = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var id = '';
	var length = 6;

	for (var i = 0; i < length; i++) {
        id += haystack.charAt(Math.floor(Math.random() * 62));
    }

    this.ID = id;
    this.board = [
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