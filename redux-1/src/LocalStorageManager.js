// @flow

import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getAttendingInformation } from './selectors';
import { changeAttendingInformation } from './actions';

import type { Attending } from './types/state';

type Props = {|
  +attendingInformation: Attending[],
  +changeAttendingInformation: typeof changeAttendingInformation,
|};

class LocalStorageManager extends PureComponent<Props> {
  componentDidMount() {
    const { changeAttendingInformation } = this.props;

    try {
      const storedAttending = JSON.parse(
        window.localStorage.getItem('attending')
      );
      if (storedAttending) {
        changeAttendingInformation(storedAttending);
      }
    } catch (err) {
      console.error('Error while parsing stored `attending` data.');
    }
  }

  componentDidUpdate() {
    const { attendingInformation } = this.props;

    window.localStorage.setItem(
      'attending',
      JSON.stringify(attendingInformation)
    );
  }

  render() {
    return null;
  }
}

export default connect(
  state => ({
    attendingInformation: getAttendingInformation(state),
  }),
  { changeAttendingInformation }
)(LocalStorageManager);
