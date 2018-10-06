// @flow

import React from 'react';
import classNames from 'classnames';
import type { ConferenceData } from './types';

export type Attending = boolean | null;

type Props = {|
  +index: number,
  +attending: Attending,
  +entry: ConferenceData,
  +handleChange: (attending: Attending) => any,
  className: string,
|};

function ListItem(props: Props) {
  const className = classNames(props.className, {
    'state-attending-yes': props.attending,
    'state-attending-maybe': props.attending === null,
    'state-attending-no': props.attending === false,
  });

  return (
    <div className={className}>
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
            checked={props.attending === null}
            onChange={props.handleChange.bind(null, null)}
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
