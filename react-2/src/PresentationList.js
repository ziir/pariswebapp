// @flow

import React, { Component } from 'react';
import ListItem, { type Attending } from './ListItem';
import data from './data/agenda.json';

class List extends Component<{||}> {
  attending: Array<Attending> = data.map(() => false);

  changeCallback(index: number, attending: Attending) {
    this.attending[index] = attending;
  }

  render() {
    return (
      <section>
        {data.map((entry, idx) => (
          <ListItem
            entry={entry}
            index={idx}
            changeCallback={this.changeCallback.bind(this, idx)}
          />
        ))}
      </section>
    );
  }
}

export default List;
