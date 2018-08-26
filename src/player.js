import React, { PureComponent } from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";

import * as styles from "./styles";

export default class Player extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    captures: PropTypes.number.isRequired,
    active: PropTypes.bool.isRequired,
    turn: PropTypes.bool.isRequired
  };

  render() {
    const { id, name, captures, active, turn } = this.props;
    const color = id === 1 ? styles.p1Color : styles.p2Color;
    return (
      <Root active={active} turn={turn}>
        <Name>{name}</Name>
        <div>
          <CaptureLabel>Captures</CaptureLabel>
          <CaptureScore color={color}>{captures}</CaptureScore>
        </div>
      </Root>
    );
  }
}

const Root = styled.div`
  opacity: ${props => props.active ? 1 : 0.5};
  text-align: center;
  background-color: ${props => props.turn && "rgba(255,255,255,0.3)"};
`;

const Name = styled.h3`
  font-family: ${styles.fonts.courgette};
`;

const CaptureLabel = styled.div`
  font-size: 80%;
`;

const CaptureScore = styled.div`
  width: 50px;
  height: 50px;
  margin: 5px auto 15px;
  font-size: 24px;
  line-height: 50px;
  color: #fff;
  text-align: center;
  background-color: ${props => props.color};
`;
