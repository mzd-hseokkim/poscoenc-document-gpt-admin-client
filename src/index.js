import 'react-app-polyfill/stable';
import 'core-js';
import React from 'react';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RecoilRoot } from 'recoil';

import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <RecoilRoot>
    <Provider store={store}>
      <App />
    </Provider>
  </RecoilRoot>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
