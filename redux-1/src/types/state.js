// @flow

import type { Day, Agenda } from './agenda';

export type Attending = boolean | null; // null means "maybe"
export type State = {|
  +agenda: AgendaState | null,
  +viewOptions: ViewOptionsState,
  +attendingInformation: Attending[],
|};

export type AgendaState = {|
  +agenda: Agenda,
  +lastModified: string | null,
|};

export type SortCriteria = 'titre' | 'auteur' | 'date et heure';

export type ViewOptionsState = {|
  +filterString: string,
  +selectedYear: number,
  +selectedDay: Day | null,
  +sortCriteria: SortCriteria,
  +displaySelectedTalks: boolean,
|};
