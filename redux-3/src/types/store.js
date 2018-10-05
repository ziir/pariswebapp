// @flow

import type { Store as ReduxStore } from 'redux'; // eslint-disable-line import/named
import type { Action as ActionsRef } from './actions';
import type { State as StateRef } from './state';

// Re-export these here so they are easily available from wherever and avoids
// circular dependencies.
export type Action = ActionsRef;
export type State = StateRef;

type PlainDispatch = (action: Action) => Action;
export type Dispatch = PlainDispatch;
export type Store = ReduxStore<State, Action, Dispatch>;
