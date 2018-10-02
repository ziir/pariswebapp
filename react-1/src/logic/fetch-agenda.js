// @flow

import type { Agenda, Day } from '../types';

export default async function fetchAgenda(): Promise<Agenda | null> {
  try {
    const fetchResponse = await fetch('agenda.json');
    if (!fetchResponse.ok) {
      throw new Error(
        `Got an error HTTP Response with status ${fetchResponse.status}`
      );
    }
    const result = await fetchResponse.json();
    return processAgenda(result);
  } catch (e) {
    console.error('Got an error while fetching the agenda.', e);
    return null;
  }
}

type SourceAgenda = Array<{|
  +title: string,
  +date: string,
  +year: string,
  +day: Day,
  +start: string,
  +duration: string,
  +type: 'Conférences' | 'Ateliers',
  +speakers: string[],
  +themes: string[],
|}>;

function timeAdd(startTime: string, duration: number): string {
  const [hour, minutes] = startTime.split(':');
  const endTotalMinutes = parseInt(hour) * 60 + parseInt(minutes) + duration;
  const endHour = Math.floor(endTotalMinutes / 60);
  const endMinutes = endTotalMinutes % 60;
  return `${endHour}:${endMinutes < 10 ? '0' + endMinutes : endMinutes}`;
}

function processAgenda(sourceAgenda: SourceAgenda): Agenda {
  return sourceAgenda.map(sourceEntry => ({
    title: sourceEntry.title,
    speakers: sourceEntry.speakers,
    location: 'unknown',
    day: sourceEntry.day,
    year: parseInt(sourceEntry.year),
    start: sourceEntry.start,
    end: timeAdd(sourceEntry.start, parseInt(sourceEntry.duration)),
  }));
}
