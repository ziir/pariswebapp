// @flow

import { createSelector } from 'reselect';
import {
  compareByDateTime,
  compareBySpeaker,
  compareByTitle,
} from './logic/comparison-functions';

import type {
  Attending,
  State,
  ViewOptionsState,
  SortCriteria,
} from './types/state';
import type { Agenda, AgendaWithIndex, ConferenceData } from './types/agenda';

type Selector<T> = State => T;

export function getAgenda(state: State): Agenda | null {
  if (state.agenda) {
    return state.agenda.agenda;
  }
  return null;
}

export function getAgendaLastModified(state: State): string | null {
  if (state.agenda) {
    return state.agenda.lastModified;
  }
  return null;
}

export function getViewOptions(state: State): ViewOptionsState {
  return state.viewOptions;
}

export function getAttendingInformation(state: State): Attending[] {
  return state.attendingInformation;
}

export const getFilteredData: Selector<AgendaWithIndex | null> = createSelector(
  getAgenda,
  getAttendingInformation,
  getViewOptions,
  (agenda, attendingInformation, viewOptions) => {
    if (!agenda) {
      return null;
    }

    const { selectedYear, selectedDay, displaySelectedTalks } = viewOptions;
    const filterString = viewOptions.filterString.trim().toLowerCase();

    return agenda
      .map((entry, idx) => ({ entry, idx }))
      .filter(
        ({ entry, idx }) =>
          entry.year === selectedYear &&
          (selectedDay === null || entry.day === selectedDay) &&
          (displaySelectedTalks === false || attendingInformation[idx]) &&
          (entry.title.toLowerCase().includes(filterString) ||
            entry.speakers.some(speaker =>
              speaker.toLowerCase().includes(filterString)
            ))
      );
  }
);

const sortingFunctions: {
  [criteria: SortCriteria]: (ConferenceData, ConferenceData) => number,
} = {
  titre: compareByTitle,
  auteur: compareBySpeaker,
  'date et heure': compareByDateTime,
};

export const getFilteredAndSortedData: Selector<AgendaWithIndex | null> = createSelector(
  getFilteredData,
  getViewOptions,
  (filteredData, { sortCriteria }) => {
    if (!filteredData) {
      return filteredData;
    }

    const sortingFunction = sortingFunctions[sortCriteria];
    return filteredData.slice().sort(({ entry: entryA }, { entry: entryB }) => {
      if (entryA.year !== entryB.year) {
        // This shouldn't happen, but I still put it here in case we change
        // something later.
        // This put newer years before older years.
        return entryB.year - entryA.year;
      }

      return sortingFunction(entryA, entryB);
    });
  }
);

export const getAvailableYears: Selector<number[]> = createSelector(
  getAgenda,
  agenda => {
    if (agenda === null) {
      return [];
    }
    return [...new Set(agenda.map(entry => entry.year))].sort((a, b) => b - a);
  }
);
