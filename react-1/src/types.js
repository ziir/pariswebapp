// @flow

export type Location = 'small' | 'big' | 'unknown';
export type Day = 'jeudi' | 'vendredi' | 'samedi';
export type ConferenceData = {|
  +title: string,
  +speakers: Array<string>,
  +location: Location,
  +day: Day,
  +year: number,
  +start: string,
  +end: string,
|};
export type Agenda = $ReadOnlyArray<ConferenceData>;
