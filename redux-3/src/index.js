// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './logic/create-store';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with id #root was not found.');
}

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
registerServiceWorker();
