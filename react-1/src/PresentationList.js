// @flow

import React, { Component, Fragment } from 'react';
import ListItem, { type Attending } from './ListItem';
import InputField from './InputField';
import data from './data/agenda.json';

type State = {|
  attending: Array<Attending>,
  filterString: string,
|};

class List extends Component<{||}, State> {
  state = {
    attending: data.map((entry, idx) => false),
    filterString: '',
  };

  handleAttendingChange(index: number, attending: Attending) {
    this.state.attending[index] = attending;
    this.setState({ attending: this.state.attending });
  }

  handleFilterSearchChange(str: string) {
    this.setState({ filterString: str.toLowerCase() });
  }

  render() {
    const { filterString } = this.state;
    const filteredData = data.filter(
      entry =>
        entry.title.toLowerCase().includes(filterString) ||
        entry.speakers.some(speaker =>
          speaker.toLowerCase().includes(filterString)
        )
    );

    return (
      <Fragment>
        <InputField
          label="Filtrer"
          onChange={this.handleFilterSearchChange.bind(this)}
          value={filterString}
        />
        <section>
          {filteredData.map((entry, idx) => (
            <ListItem
              entry={entry}
              index={idx}
              attending={this.state.attending[idx]}
              handleChange={this.handleAttendingChange.bind(this, idx)}
            />
          ))}
        </section>
      </Fragment>
    );
  }
}

export default List;
