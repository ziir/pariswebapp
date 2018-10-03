// @flow

import type { Agenda } from './agenda';

export type State = {|
  +agenda: AgendaState | null,
|};

export type AgendaState = {|
  +agenda: Agenda,
  +lastModified: string | null,
|};
