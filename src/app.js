import React, { PureComponent } from "react";
import { hot } from "react-hot-loader";
import styled from "react-emotion";
import io from "socket.io-client";

import Board from "./board";
import Player from "./player";
import * as styles from "./styles";

class App extends PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      playerId: null,
      players: {
        1: { active: true, captures: 0, turn: false },
        2: { active: false, captures: 0, turn: false }
      },
      turn: false,
      board: [
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
      ]
    };

    const socket = (this.socket = io.connect(location.origin));
    socket.on("connect", this.onConnect);
    socket.on("assign", this.onAssign);
    socket.on("start", this.onStart);
    socket.on("notify", this.onUpdate);
    socket.on("victory", this.onVictory);
    socket.on("forfeit", this.onForfeit);
  }

  onConnect = () => {
    const gameID = location.pathname.substr(1);
    this.socket.emit("join", gameID);
  };

  onAssign = playerId => {
    const players = { ...this.state.players };
    players[playerId].active = true;
    this.setState({ playerId, players });
  };

  onStart = () => {
    const players = { ...this.state.players };
    players[1].turn = true;
    players[2].active = true;
    this.setState({
      players
    });
  };

  onSelect = (x, y) => {
    if (!this.state.turn || this.state.board[x][y] !== 0) return;

    this.socket.emit("turn", {
      row: x,
      column: y
    });
  };

  onUpdate = data => {
    const { playerId } = this.state;

    const players = { ...this.state.players };
    players[1].captures = data.captures[0];
    players[1].turn = data.turn === 0;
    players[2].captures = data.captures[1];
    players[2].turn = data.turn === 1;

    this.setState({
      turn: data.turn == playerId,
      board: data.board,
      players
    });
  };

  onVictory = data => {
    const players = { ...this.state.players };
    players[1].captures = data.captures[0];
    players[1].turn = false;
    players[2].captures = data.captures[1];
    players[2].turn = false;

    this.setState({
      turn: false,
      board: data.board,
      players
    });

    // TODO: Ask players for rematch
    alert(`Player ${data.victor} is victor!`);
  };

  onForfeit = data => {
    const players = { ...this.state.players };
    players[1].turn = false;
    players[2].turn = false;
    players[data].active = false;
    this.setState({
      turn: false,
      players
    });

    const playAgain = confirm(
      `Game over. Player ${data} has forfeit. Play again?`
    );
    if (playAgain) {
      location.reload();
    }
  };

  render() {
    const { board, turn, players, playerId } = this.state;
    const waiting = !players[1].active || !players[2].active;

    return (
      <Root>
        <Header>Cinco</Header>
        <Main>
          <PlayerInfo>
            <Player id={1} name={getPlayerName(1, playerId)} {...players[1]} />
            <VersusLabel>vs</VersusLabel>
            <Player id={2} name={getPlayerName(2, playerId)} {...players[2]} />
          </PlayerInfo>
          <Board
            waiting={waiting}
            board={board}
            turn={turn}
            onSelect={this.onSelect}
          />
        </Main>
      </Root>
    );
  }
}

const getPlayerName = (id, pid) => {
  const you = id === pid ? " (you)" : "";
  return `Player ${id}${you}`;
};

const Root = styled.div`
  min-height: 100vh;
`;

const Main = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  height: 50px;
  color: ${styles.colors.clouds};
  font-size: 30px;
  font-family: Courgette, cursive;
  font-weight: normal;
  line-height: 50px;
  text-align: center;
  background: ${styles.colors.midnightBlue};
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`;

const VersusLabel = styled.div`
  margin: 0 30px;
  font-size: 140%;
  font-style: italic;
`;

export default hot(module)(App);
