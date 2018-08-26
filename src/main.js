import React from "react";
import { render } from "react-dom";
import { injectGlobal } from "react-emotion";

import App from "./app";

injectGlobal`
  *, *:before, *:after {
    box-sizing: border-box;
  }

  html, body {
    font-size: 100%;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: normal;
    font-style: normal;
    line-height: 1.4;
    background: clouds;
    padding: 0;
    margin: 0;
  }

  a {
    color: #65BD77;
    text-decoration: none;
  }


  h1, h2, h3, h4, h5, h6 {
    font-family: courgette;
    font-weight: normal;
  }
`;

render(<App />, document.getElementById("root"));
