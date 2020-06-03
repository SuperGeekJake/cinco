import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';

import App from './App';
import { SessionProvider } from './session';
import * as serviceWorker from './serviceWorker';

// Initialize default app
firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
});

if (process.env.NODE_ENV !== 'production') {
  window.firebase = firebase
}

ReactDOM.render(
  <React.StrictMode>
    <SessionProvider>
      <BrowserRouter>
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
