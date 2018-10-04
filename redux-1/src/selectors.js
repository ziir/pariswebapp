// @flow

import type { State, ViewOptionsState, SortCriteria } from './types/state';
import type { Agenda, AgendaWithIndex, ConferenceData } from './types/agenda';

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

export function getFilteredData(state: State): AgendaWithIndex | null {
  const agenda = getAgenda(state);
  if (!agenda) {
    return null;
  }

  const {
    filterString,
    selectedYear,
    selectedDay,
    displaySelectedTalks,
  } = getViewOptions(state);

  return agenda
    .map((entry, idx) => ({ entry, idx }))
    .filter(
      ({ entry, idx }) =>
        entry.year === selectedYear &&
        (selectedDay === null || entry.day === selectedDay) &&
        (displaySelectedTalks === false || this.attending[idx]) &&
        (entry.title.toLowerCase().includes(filterString) ||
          entry.speakers.some(speaker =>
            speaker.toLowerCase().includes(filterString)
          ))
    );
}

function compareByDateTime(entryA: ConferenceData, entryB: ConferenceData) {
  if (entryA.date !== entryB.date) {
    if (entryA.date < entryB.date) {
      return -1;
    } else {
      return 1;
    }
  }

  if (entryA.start !== entryB.start) {
    if (entryA.start < entryB.start) {
      return -1;
    } else {
      return 1;
    }
  }

  if (entryA.location !== entryB.location) {
    if (entryA.location < entryB.location) {
      return -1;
    } else {
      return 1;
    }
  }

  return 0;
}

function compareBySpeaker(entryA: ConferenceData, entryB: ConferenceData) {
  // Using the first speaker arbitrary
  return entryA.speakers[0].localeCompare(entryB.speakers[0]);
}

function compareByTitle(entryA: ConferenceData, entryB: ConferenceData) {
  return entryA.title.localeCompare(entryB.title);
}

const sortingFunctions: {
  [criteria: SortCriteria]: (ConferenceData, ConferenceData) => number,
} = {
  titre: compareByTitle,
  auteur: compareBySpeaker,
  'date et heure': compareByDateTime,
};

export function getFilteredAndSortedData(state: State): AgendaWithIndex | null {
  const filteredData = getFilteredData(state);
  if (!filteredData) {
    return null;
  }

  const sortCriteria = getViewOptions(state).sortCriteria;
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

export function getAvailableYears(state: State): number[] {
  const agenda = getAgenda(state);
  if (agenda === null) {
    return [];
  }
  return [...new Set(agenda.map(entry => entry.year))].sort((a, b) => b - a);
}
