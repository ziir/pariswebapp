// @flow

import type { State } from './types/state';
import type { Agenda } from './types/agenda';

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
