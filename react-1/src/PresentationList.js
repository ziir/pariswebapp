// @flow

import React, { Component } from 'react';
import ListItem, { type Attending } from './ListItem';
import data from './data/agenda.json';

type State = {
  attending: Array<Attending>,
};
class List extends Component<{||}, State> {
  state = { attending: data.map((entry, idx) => false) };

  handleChange(index: number, attending: Attending) {
    this.state.attending[index] = attending;
    this.setState({ attending: this.state.attending });
  }

  render() {
    return (
      <section>
        {data.map((entry, idx) => (
          <ListItem
            entry={entry}
            index={idx}
            attending={this.state.attending[idx]}
            handleChange={this.handleChange.bind(this, idx)}
          />
        ))}
      </section>
    );
  }
}

export default List;
