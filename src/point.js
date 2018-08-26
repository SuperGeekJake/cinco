import React, { PureComponent } from "react";
import styled from "react-emotion";
import PropTypes from 'prop-types'

import * as styles from "./styles";

export default class Point extends PureComponent {
  static propTypes = {
    value: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  getColor() {
    const { value } = this.props;
    switch (value) {
      case 0:
        return null;
      case 1:
        return styles.p1Color;
      case 2:
        return styles.p2Color;
    }
  }

  onClick = () => {
    const { x, y } = this.props;
    this.props.onSelect(x, y);
  };

  render() {
    const color = this.getColor();
    return <Root color={color} onClick={this.onClick} />;
  }
}

const Root = styled.div`
  position: absolute;
  top: 10%;
  left: 10%;
  bottom: 10%;
  right: 10%;
  background-color: ${props => props.color || '#34495e12'};
  /* border: 1px solid ${props => props.color || styles.colors.wetAsphalt}; */
`;
