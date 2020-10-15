import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Global } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import 'normalize.css';

import App from './App';
import { SessionProvider } from './session';
import * as serviceWorker from './serviceWorker';
import { theme, globalStyles } from './styles';
import './firebase';

ReactDOM.render(
  <React.StrictMode>
    <SessionProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Global styles={globalStyles} />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </SessionProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
