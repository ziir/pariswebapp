// @flow

import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { getAttendingInformation, getAgenda } from './selectors';
import { changeAttendingInformationForIndex } from './actions';
import { ensureExists } from './utils/flow';

import type { ConferenceData } from './types/agenda';
import type { Attending } from './types/state';

type Props = {|
  +index: number,
  +entry: ConferenceData,
  +attending: Attending,
  +changeAttendingInformationForIndex: typeof changeAttendingInformationForIndex,
  +className: string,
|};

class ListItem extends React.PureComponent<Props> {
  handleChange = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    const { changeAttendingInformationForIndex, index } = this.props;

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

    changeAttendingInformationForIndex(index, attending);
  };

  render() {
    const { className, entry, index, attending } = this.props;
    const mergedClassName = classNames(className, {
      'state-attending-yes': attending,
      'state-attending-maybe': attending === null,
      'state-attending-no': attending === false,
    });

    return (
      <div className={mergedClassName}>
        <h3>{entry.title}</h3>
        <ul>
          {entry.speakers.map(speaker => (
            <li>{speaker}</li>
          ))}
        </ul>
        <p>
          This presentation will take place:
          <br />- on{' '}
          <em>
            {entry.day} {entry.start} - {entry.end}
          </em>
          <br />- in room <strong>{entry.location}</strong>
        </p>
        <fieldset>
          <legend>Attend?</legend>
          <label>
            <input
              type="radio"
              id={`${index}-no`}
              name={index}
              value="no"
              checked={attending === false}
              onChange={this.handleChange}
            />
            No
          </label>
          <label>
            <input
              type="radio"
              id={`${index}-maybe`}
              name={index}
              value="maybe"
              checked={attending === null}
              onChange={this.handleChange}
            />
            Maybe
          </label>
          <label>
            <input
              type="radio"
              id={`${index}-yes`}
              name={index}
              value="yes"
              checked={attending === true}
              onChange={this.handleChange}
            />
            Yes
          </label>
        </fieldset>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  attending: getAttendingInformation(state)[props.index],
  entry: ensureExists(getAgenda(state))[props.index],
});
const mapDispatchToProps = { changeAttendingInformationForIndex };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListItem);
