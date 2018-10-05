// @flow

import type { Agenda, Day } from './agenda';
import type { Attending, SortCriteria } from './state';

export type Action =
  | {|
      +type: 'AGENDA_HAS_LOADED',
      +agenda: Agenda,
      +lastModified: string | null,
    |}
  | {|
      +type: 'CHANGE_FILTER_STRING',
      +filterString: string,
    |}
  | {|
      +type: 'CHANGE_SELECTED_YEAR',
      +year: number,
    |}
  | {|
      +type: 'CHANGE_SELECTED_DAY',
      +day: Day | null,
    |}
  | {|
      +type: 'CHANGE_SORT_CRITERIA',
      +sortCriteria: SortCriteria,
    |}
  | {|
      +type: 'CHANGE_DISPLAY_SELECTED_TALKS',
      +displaySelectedTalks: boolean,
    |}
  | {|
      +type: 'CHANGE_ATTENDING_INFORMATION_FOR_INDEX',
      +index: number,
      +attending: Attending,
    |}
  | {|
      +type: 'CHANGE_ATTENDING_INFORMATION',
      +attendingInformation: Attending[],
    |};
