// @flow

import { createStore } from 'redux';
import reducers from '../reducers';

import type { Store } from '../types/store';

export default function createAppStore(): Store {
  return createStore(reducers);
}
