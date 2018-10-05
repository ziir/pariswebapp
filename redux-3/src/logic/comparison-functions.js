// @flow

import type { ConferenceData } from '../types/agenda';

export function compareByDateTime(
  entryA: ConferenceData,
  entryB: ConferenceData
) {
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

export function compareBySpeaker(
  entryA: ConferenceData,
  entryB: ConferenceData
) {
  // Using the first speaker arbitrary
  return entryA.speakers[0].localeCompare(entryB.speakers[0]);
}

export function compareByTitle(entryA: ConferenceData, entryB: ConferenceData) {
  return entryA.title.localeCompare(entryB.title);
}
