// @flow

import type { Action } from './types/actions';
import type { Agenda } from './types/agenda';

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
