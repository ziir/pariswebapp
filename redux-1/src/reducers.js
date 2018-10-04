// @flow

import { combineReducers } from 'redux';
import type {
  State,
  AgendaState,
  Attending,
  ViewOptionsState,
  SortCriteria,
} from './types/state';
import type { Day } from './types/agenda';
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

function filterString(state: string = '', action: Action): string {
  switch (action.type) {
    case 'CHANGE_FILTER_STRING':
      return action.filterString;
    default:
      return state;
  }
}

function selectedYear(state: number = 2018, action: Action): number {
  switch (action.type) {
    case 'CHANGE_SELECTED_YEAR':
      return action.year;
    default:
      return state;
  }
}

function selectedDay(state: Day | null = null, action: Action): Day | null {
  switch (action.type) {
    case 'CHANGE_SELECTED_DAY':
      return action.day;
    default:
      return state;
  }
}

function sortCriteria(
  state: SortCriteria = 'date et heure',
  action: Action
): SortCriteria {
  switch (action.type) {
    case 'CHANGE_SORT_CRITERIA':
      return action.sortCriteria;
    default:
      return state;
  }
}

function displaySelectedTalks(state: boolean = false, action: Action): boolean {
  switch (action.type) {
    case 'CHANGE_DISPLAY_SELECTED_TALKS':
      return action.displaySelectedTalks;
    default:
      return state;
  }
}

function attendingInformation(
  state: Attending[] = [],
  action: Action
): Attending[] {
  switch (action.type) {
    case 'AGENDA_HAS_LOADED':
      return action.agenda.map(() => false);
    case 'CHANGE_ATTENDING_INFORMATION': {
      const newValue = state.slice();
      newValue[action.index] = action.attending;
      return newValue;
    }
    default:
      return state;
  }
}

const viewOptionsReducer: Reducer<ViewOptionsState> = combineReducers({
  filterString,
  selectedYear,
  selectedDay,
  sortCriteria,
  displaySelectedTalks,
});

const rootReducer: Reducer<State> = combineReducers({
  agenda,
  viewOptions: viewOptionsReducer,
  attendingInformation,
});
export default rootReducer;
