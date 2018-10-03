// @flow

import type { Agenda } from './agenda';

export type Action = {|
  type: 'AGENDA_HAS_LOADED',
  agenda: Agenda,
  lastModified: string | null,
|};
