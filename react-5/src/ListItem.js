// @flow

import React from 'react';
import classNames from 'classnames';
import type { ConferenceData } from './types';

export type Attending = boolean | null;

type Props = {|
  +index: number,
  +entry: ConferenceData,
  +attendingInitialValue: Attending,
  +changeCallback: (index: number, attending: Attending) => any,
  +className: string,
|};

type State = {
  attending: Attending,
};

export default class ListItem extends React.PureComponent<Props, State> {
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
    this.props.changeCallback(this.props.index, attending);
  };

  render() {
    const { props, state } = this;
    const className = classNames(props.className, {
      'state-attending-yes': state.attending,
      'state-attending-maybe': state.attending === null,
      'state-attending-no': state.attending === false,
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
