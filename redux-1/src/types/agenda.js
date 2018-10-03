// @flow

export type Day = 'jeudi' | 'vendredi' | 'samedi';
export type ConferenceData = {|
  +title: string,
  +speakers: Array<string>,
  +location: string,
  +date: string,
  +day: Day,
  +year: number,
  +start: string,
  +end: string,
|};
export type Agenda = $ReadOnlyArray<ConferenceData>;
