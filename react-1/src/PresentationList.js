// @flow

import React, { Component, Fragment } from 'react';
import ListItem, { type Attending, type ConferenceData } from './ListItem';
import InputField from './InputField';
import ValueChooser from './ValueChooser';

export type Agenda = $ReadOnlyArray<ConferenceData>;

type Props = {|
  +agenda: Agenda,
|};

type State = {|
  attending: Array<Attending>,
  filterString: string,
  selectedYear: number,
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
    selectedYear: 2018,
  };

  handleAttendingChange(index: number, attending: Attending) {
    this.state.attending[index] = attending;
    this.setState({ attending: this.state.attending });
  }

  handleFilterSearchChange(str: string) {
    this.setState({ filterString: str.toLowerCase() });
  }

  handleSelectedYearChange(year: number) {
    this.setState({ selectedYear: year });
  }

  render() {
    const { agenda } = this.props;
    const { filterString, selectedYear } = this.state;

    const availableYears = [...new Set(agenda.map(entry => entry.year))].sort(
      (a, b) => b - a
    );

    const filteredData = agenda
      .map((entry, idx) => ({ entry, idx }))
      .filter(
        ({ entry }) =>
          entry.year === selectedYear &&
          (entry.title.toLowerCase().includes(filterString) ||
            entry.speakers.some(speaker =>
              speaker.toLowerCase().includes(filterString)
            ))
      );

    return (
      <Fragment>
        <ValueChooser
          label="Choisissez l'année"
          values={availableYears}
          selectedValue={selectedYear}
          onChange={this.handleSelectedYearChange.bind(this)}
        />
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
