// @flow

import React from 'react';

export type Attending = boolean | null;
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
  +entry: ConferenceData,
  +attendingInitialValue: Attending,
  +changeCallback: (attending: Attending) => any,
|};

type State = {
  attending: Attending,
};

const attendingValueMap = {
  yes: true,
  maybe: null,
  no: false,
};

export default class ListItem extends React.Component<Props, State> {
  state = { attending: this.props.attendingInitialValue };

  handleChange = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    let attending;

    switch (evt.currentTarget.value) {
      case 'yes':
        attending = true;
        break;
      case 'no':
        attending = false;
        break;
      case 'maybe':
      default:
        attending = null;
    }

    this.setState({ attending });
    this.props.changeCallback(attending);
  };

  render() {
    const { props, state } = this;

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
              checked={state.attending === false}
              onChange={this.handleChange}
            />
            No
          </label>
          <label>
            <input
              type="radio"
              id={`${props.index}-maybe`}
              name={props.index}
              value="maybe"
              checked={state.attending === null}
              onChange={this.handleChange}
            />
            Maybe
          </label>
          <label>
            <input
              type="radio"
              id={`${props.index}-yes`}
              name={props.index}
              value="yes"
              checked={state.attending === true}
              onChange={this.handleChange}
            />
            Yes
          </label>
        </fieldset>
      </div>
    );
  }
}
