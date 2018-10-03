// @flow

import { combineReducers } from 'redux';
import type { State, AgendaState } from './types/state';
import type { Action } from './types/actions';

type Reducer<State> = (State | void, Action) => State;

function agenda(
  state: AgendaState | null = null,
  action: Action
): AgendaState | null {
  switch (action.type) {
    case 'AGENDA_HAS_LOADED':
      return {
        agenda: action.agenda,
        lastModified: action.lastModified,
      };
    default:
      return state;
  }
}

const rootReducer: Reducer<State> = combineReducers({ agenda });
export default rootReducer;
