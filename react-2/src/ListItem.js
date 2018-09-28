// @flow

import React, { Component } from 'react';

export type Attending = boolean | void;
export type Location = 'small' | 'medium' | 'big';
export type Entry = {
  title: string,
  speakers: Array<string>,
  location: Location,
  day: string,
  year: number,
  start: string,
  end: string,
};

type Props = {
  index: number,
  entry: Entry,
  attendingInitialValue: Attending,
  changeCallback: (attending: Attending) => any,
};

type State = {
  attending: Attending,
};

export default class ListItem extends Component<Props, State> {
  state = { attending: this.props.attendingInitialValue };

  handleChange = (attending: Attending) => {
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
            <li key={`${props.index}-${speaker}`}>{speaker}</li>
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
          <div>
            <input
              type="radio"
              id={`${props.index}-no`}
              name={props.index}
              value="no"
              checked={state.attending === false}
              onChange={this.handleChange.bind(null, false)}
            />
            <label htmlFor={`${props.index}-no`}>No</label>
          </div>
          <div>
            <input
              type="radio"
              id={`${props.index}-maybe`}
              name={props.index}
              value="maybe"
              checked={state.attending === undefined}
              onChange={this.handleChange.bind(null, undefined)}
            />
            <label htmlFor={`${props.index}-maybe`}>Maybe</label>
          </div>
          <div>
            <input
              type="radio"
              id={`${props.index}-yes`}
              name={props.index}
              value="yes"
              checked={state.attending === true}
              onChange={this.handleChange.bind(null, true)}
            />
            <label htmlFor={`${props.index}-yes`}>Yes</label>
          </div>
        </fieldset>
      </div>
    );
  }
}
