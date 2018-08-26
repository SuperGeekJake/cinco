import React, { PureComponent } from "react";
import styled from "react-emotion";

import Point from "./point";
import * as styles from "./styles";

export default class Board extends PureComponent {
  render() {
    const { board, onSelect, waiting } = this.props;
    return (
      <Root>
        <RootContainer>
          {board.map((row, x) => (
            <Row key={x}>
              {row.map((column, y) => (
                <Cell key={y}>
                  <Point value={column} x={x} y={y} onSelect={onSelect} />
                </Cell>
              ))}
            </Row>
          ))}
          {waiting && <Overlay>Waiting on players to join...</Overlay>}
        </RootContainer>
      </Root>
    );
  }
}

const Root = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
`;

const RootContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Overlay = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 60px;
  padding: 0 20px;
  color: #ffffffd6;
  font-size: 140%;
  background-color: #34495e;
  border-radius: 30px;
  transform: translate(-50%, -50%);
`;

const Row = styled.div`
  height: ${styles.cellSize};
`;

const Cell = styled.div`
  position: relative;
  width: ${styles.cellSize};
  padding-bottom: ${styles.cellSize};
  float: left;
`;
