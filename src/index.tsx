import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Global, css } from '@emotion/core';
import 'normalize.css';

import App from './App';
import { SessionProvider } from './session';
import * as serviceWorker from './serviceWorker';
import './firebase';

const globalStyles = css`
  *, *:before, *:after {
    box-sizing: inherit;
  }

  html, body {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: #f6f6f6;
  }

  #root {
    display: flex;
    width: 100%;
    min-height: 100%;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <SessionProvider>
      <BrowserRouter>
        <Global styles={globalStyles} />
        <App />
      </BrowserRouter>
    </SessionProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
