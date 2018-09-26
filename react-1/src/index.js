// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with id #root was not found.');
}

ReactDOM.render(<App />, rootElement);
registerServiceWorker();
