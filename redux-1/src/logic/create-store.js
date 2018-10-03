// @flow

import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from '../reducers';

import type { Store } from '../types/store';

export default function createAppStore(): Store {
  const middlewares = [];

  if (process.env.NODE_ENV === 'development') {
    middlewares.push(
      createLogger({
        collapsed: true,
        titleFormatter: (action, time, duration) =>
          `[action]    ${action.type} (in ${duration.toFixed(2)} ms)`,
        logErrors: false,
        duration: true,
      })
    );
  }

  const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(...middlewares))
  );
  return store;
}
