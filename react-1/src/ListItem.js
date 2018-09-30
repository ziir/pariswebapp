// @flow

import React from 'react';

export type Attending = boolean | void;
export type Location = 'small' | 'big' | 'unknown';
export type Day = 'thursday' | 'friday' | 'saturday';
export type ConferenceData = {|
  +title: string,
  +speakers: Array<string>,
  +location: Location,
  +day: Day,
  +year: number,
  +start: string,
  +end: string,
|};

type Props = {|
  +index: number,
  +attending: Attending,
  +entry: ConferenceData,
  +handleChange: (attending: Attending) => any,
|};

function ListItem(props: Props) {
  return (
    <div>
      <h3>{props.entry.title}</h3>
      <ul>
        {props.entry.speakers.map(speaker => (
          <li>{speaker}</li>
        ))}
      </ul>
      <p>
        This presentation will take place:
        <br />- on{' '}
        <em>
          {props.entry.day} {props.entry.start} - {props.entry.end}
        </em>
        <br />- in room <strong>{props.entry.location}</strong>
      </p>
      <fieldset>
        <legend>Attend?</legend>
        <label>
          <input
            type="radio"
            id={`${props.index}-no`}
            name={props.index}
            value="no"
            checked={props.attending === false}
            onChange={props.handleChange.bind(null, false)}
          />
          No
        </label>
        <label>
          <input
            type="radio"
            id={`${props.index}-maybe`}
            name={props.index}
            value="maybe"
            checked={props.attending === undefined}
            onChange={props.handleChange.bind(null, undefined)}
          />
          Maybe
        </label>
        <label>
          <input
            type="radio"
            id={`${props.index}-yes`}
            name={props.index}
            value="yes"
            checked={props.attending === true}
            onChange={props.handleChange.bind(null, true)}
          />
          Yes
        </label>
      </fieldset>
    </div>
  );
}

export default ListItem;
