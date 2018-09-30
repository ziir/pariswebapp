// @flow

import React, { Component, Fragment } from 'react';
import ListItem, { type Attending, type ConferenceData } from './ListItem';
import InputField from './InputField';

export type Agenda = $ReadOnlyArray<ConferenceData>;

type Props = {|
  +agenda: Agenda,
|};

type State = {|
  attending: Array<Attending>,
  filterString: string,
|};

class List extends Component<Props, State> {
  static getDerivedStateFromProps(
    { agenda }: Props,
    { attending }: State
  ): $Shape<State> | null {
    if (agenda.length > attending.length) {
      const newAttending = attending.slice();
      for (var i = attending.length; i < agenda.length; i++) {
        newAttending.push(false);
      }
      return {
        attending: newAttending,
      };
    }

    return null;
  }

  state = {
    // This initial value is needed by Flow, but it will be rewritten in
    // `getDerivedStateFromProps` at the first render.
    attending: [],
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
    const { agenda } = this.props;
    const { filterString } = this.state;
    const filteredData = agenda
      .map((entry, idx) => ({ entry, idx }))
      .filter(
        ({ entry }) =>
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
          {filteredData.map(({ entry, idx }) => (
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
