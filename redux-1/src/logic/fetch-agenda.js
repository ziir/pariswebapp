// @flow

import type { Agenda, Day } from '../types/agenda';

const AGENDA_URL = 'https://www.paris-web.fr/flux-SJW.json';

export default async function fetchAgenda(
  previousLastModified: string | null
): Promise<{ agenda: Agenda, lastModified: string | null } | null> {
  try {
    const fetchResponse = await fetch(AGENDA_URL);
    if (!fetchResponse.ok) {
      throw new Error(
        `Got an error HTTP Response with status ${fetchResponse.status}`
      );
    }

    let lastModified;
    try {
      lastModified = fetchResponse.headers.get('Last-Modified');
    } catch (e) {
      lastModified = new Date().toUTCString();
      console.error('Unable to retrieve Last-Modified response header.', e);
    }

    if (lastModified && lastModified === previousLastModified) {
      return null;
    }

    const result = await fetchResponse.json();
    return { agenda: processAgenda(result), lastModified };
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
  +location: string,
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

function parseSourceDuration(source: string): number {
  const cleanedSource = source
    .replace(/<.*?>/g, '')
    .replace(/ /g, '')
    .replace(/mn$/, '');

  const [h, m] = cleanedSource.split('h');
  if (m === undefined) {
    // Case where we have only 1 value in minutes
    return parseInt(h);
  } else {
    // Case where we have 2 values, the first is how many hours, the second is
    // how many minutes.
    return parseInt(h) * 60 + parseInt(m);
  }
}

function processAgenda(sourceAgenda: SourceAgenda): Agenda {
  return sourceAgenda.map(sourceEntry => {
    const duration = parseSourceDuration(sourceEntry.duration);
    return {
      title: sourceEntry.title,
      speakers: sourceEntry.speakers,
      location: sourceEntry.location,
      date: sourceEntry.date,
      day: sourceEntry.day,
      year: parseInt(sourceEntry.year),
      start: sourceEntry.start,
      end: timeAdd(sourceEntry.start, duration),
    };
  });
}
