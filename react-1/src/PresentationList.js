// @flow

import React, { Component } from 'react';
import ListItem, { type Attending } from './ListItem';
import data from './data/agenda.json';

type State = {
  attending: Array<Attending>,
};
class List extends Component<any, State> {
  state = { attending: data.map((entry, idx) => 'no') };

  handleChange(index: number) {
    return (value: Attending) => (
      evt: SyntheticInputEvent<HTMLInputElement>
    ) => {
      this.state.attending[index] = value;
      this.setState({ attending: this.state.attending });
    };
  }

  render() {
    return (
      <section>
        {data.map((entry, idx) => (
          <ListItem
            entry={entry}
            index={idx}
            value={this.state.attending[idx]}
            handleChange={this.handleChange.bind(this)(idx)}
          />
        ))}
      </section>
    );
  }
}

export default List;
