// @flow

import type { Action } from './types/actions';
import type { Agenda, Day } from './types/agenda';
import type { Attending, SortCriteria } from './types/state';

export function agendaHasLoaded(
  agenda: Agenda,
  lastModified: string | null
): Action {
  return {
    type: 'AGENDA_HAS_LOADED',
    agenda,
    lastModified,
  };
}

export function changeFilterString(filterString: string): Action {
  return { type: 'CHANGE_FILTER_STRING', filterString };
}

export function changeSelectedYear(year: number): Action {
  return { type: 'CHANGE_SELECTED_YEAR', year };
}

export function changeSelectedDay(day: Day | null): Action {
  return { type: 'CHANGE_SELECTED_DAY', day };
}

export function changeSortCriteria(sortCriteria: SortCriteria): Action {
  return { type: 'CHANGE_SORT_CRITERIA', sortCriteria };
}

export function changeDisplaySelectedTalks(
  displaySelectedTalks: boolean
): Action {
  return { type: 'CHANGE_DISPLAY_SELECTED_TALKS', displaySelectedTalks };
}

export function changeAttendingInformationForIndex(
  index: number,
  attending: Attending
): Action {
  return { type: 'CHANGE_ATTENDING_INFORMATION_FOR_INDEX', index, attending };
}

export function changeAttendingInformation(
  attendingInformation: Attending[]
): Action {
  return { type: 'CHANGE_ATTENDING_INFORMATION', attendingInformation };
}
