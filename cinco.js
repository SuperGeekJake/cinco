/**
 * Initialize a new `Cinco` game with the given `options`.
 * @param {String} ID
 * @param {Array} players
 */
module.exports = class Cinco {
  constructor(ID, players) {
    this.ID = ID;
    this.players = players || [];
    this.turn = 1;
    this.captures = [0, 0];

    // A board space can be either 0 (unclaimed) or 1 - 2 (players)
    // 19 columns, 19 rows
    this.board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
  }

  checkVictory() {
    if (this.captures[this.turn - 1] > 4) return true;

    for (let row = 0; row < 19; row++) {
      for (let column = 0; column < 19; column++) {
        if (this.board[row][column] == this.turn) {
          return this.checkDirections(row, column);
        }
      }
    }

    return false;
  }

  checkDirections(row, column) {
    if (this.checkHorizontal([row, column])) return true;
    if (this.checkVertical([row, column])) return true;
    if (this.checkLeftDiagonal([row, column])) return true;
    if (this.checkRightDiagonal([row, column])) return true;
  }

  checkHorizontal(startPoint) {
    // Info: startPoint = [row, column]
    const columnEnd = startPoint[1] + 4; //total of 5 spaces
    // Are there not enough spaces to the right to make Cinco?
    if (columnEnd > 19) {
      return false;
    }

    const row = startPoint[0];
    const columnStart = startPoint[1];

    // Check the next 4 spaces
    for (let i = 1; i < 5; i++) {
      if (this.board[row][columnStart + i] != this.turn) {
        return false;
      }
    }

    return true;
  }

  checkVertical(startPoint) {
    // Info: startPoint = [row, column]
    const rowEnd = startPoint[0] + 4; //total of 5 spaces
    // Are there not enough spaces to the right to make Cinco?
    if (rowEnd > 19) {
      return false;
    }

    const rowStart = startPoint[0];
    const column = startPoint[1];

    // Check the next 4 spaces
    for (let i = 1; i < 5; i++) {
      if (this.board[rowStart + i][column] != this.turn) {
        return false;
      }
    }

    return true;
  }

  checkLeftDiagonal(startPoint) {
    // Info: startPoint = [row, column]
    const rowStart = startPoint[0];
    const columnStart = startPoint[1];

    const rowEnd = startPoint[0] + 4; //total of 5 spaces
    const columnEnd = startPoint[1] + 4; //total of 5 spaces
    // Are there not enough spaces to the right to make Cinco?
    if (rowEnd > 19 || columnEnd > 19) {
      return false;
    }

    // Check the next 4 spaces
    for (let i = 1; i < 5; i++) {
      if (this.board[rowStart + i][columnStart + i] != this.turn) {
        return false;
      }
    }

    return true;
  }

  checkRightDiagonal(startPoint) {
    // Info: startPoint = [row, column]
    const rowStart = startPoint[0];
    const columnStart = startPoint[1];

    const rowEnd = startPoint[0] - 4; //total of 5 spaces
    const columnEnd = startPoint[1] + 4; //total of 5 spaces
    // Are there not enough spaces to the right to make Cinco?
    if (rowEnd < 0 || columnEnd > 19) {
      return false;
    }

    // Check the next 4 spaces
    for (let i = 1; i < 5; i++) {
      if (this.board[rowStart - i][columnStart + i] != this.turn) {
        return false;
      }
    }

    return true;
  }

  checkCaptures(position) {
    let captures = 0;
    const row = position[0];
    const column = position[1];
    const opponent = this.turn == 1 ? 2 : 1;

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
}
