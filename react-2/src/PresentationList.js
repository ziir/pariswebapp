// @flow

import React, { Component } from 'react';
import ListItem, { type Attending } from './ListItem';
import data from './data/agenda.json';

class List extends Component<{||}> {
  attending: Array<Attending> = this.getAttendingInitialValues();

  getAttendingInitialValues() {
    try {
      return JSON.parse(window.localStorage.getItem('attending'));
    } catch (err) {
      return data.map(() => false);
    }
  }

  changeCallback(index: number, attending: Attending) {
    this.attending[index] = attending;
    window.localStorage.setItem('attending', JSON.stringify(this.attending));
  }

  render() {
    return (
      <section>
        {data.map((entry, idx) => (
          <ListItem
            entry={entry}
            index={idx}
            changeCallback={this.changeCallback.bind(this, idx)}
            attendingInitialValue={this.attending[idx]}
          />
        ))}
      </section>
    );
  }
}

export default List;
