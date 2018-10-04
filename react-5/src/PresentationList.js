// @flow

import memoize from 'memoize-one';
import React, { Component, Fragment } from 'react';
import ListItem, { type Attending } from './ListItem';
import InputField from './InputField';
import ValueChooser from './ValueChooser';

import type { Agenda, Day } from './types';

type Props = {|
  +agenda: Agenda,
|};

type State = {|
  attending: Array<Attending>,
  filterString: string,
  selectedYear: number,
  selectedDay: Day | null,
  displaySelectedTalks: boolean,
|};

class List extends Component<Props, State> {
  attending = (() => {
    const { props } = this;
    let storedAttending = [];

    try {
      storedAttending =
        JSON.parse(window.localStorage.getItem('attending')) || [];
    } catch (err) {
      console.error('Error while parsing stored `attending` data.');
    }

    return props.agenda.map(
      (current, idx) =>
        storedAttending[idx] !== undefined ? storedAttending[idx] : false
    );
  })();

  handleSelectedYearChange = this.handleSelectedYearChange.bind(this);
  handleSelectedDayChange = this.handleSelectedDayChange.bind(this);
  handleFilterSearchChange = this.handleFilterSearchChange.bind(this);
  attendingChangeCallback = this.attendingChangeCallback.bind(this);

  availableDays: Array<Day | null> = [null, 'jeudi', 'vendredi', 'samedi'];

  state = {
    // This initial value is needed by Flow, but it will be rewritten in
    // `getDerivedStateFromProps` at the first render.
    attending: [],
    filterString: '',
    selectedYear: 2018,
    selectedDay: null,
    displaySelectedTalks: false,
  };

  getFilteredData = memoize(
    (agenda, filterString, selectedYear, selectedDay, displaySelectedTalks) => {
      return agenda
        .map((entry, idx) => ({ entry, idx }))
        .filter(
          ({ entry, idx }) =>
            entry.year === selectedYear &&
            (selectedDay === null || entry.day === selectedDay) &&
            (displaySelectedTalks === false || this.attending[idx]) &&
            (entry.title.toLowerCase().includes(filterString) ||
              entry.speakers.some(speaker =>
                speaker.toLowerCase().includes(filterString)
              ))
        );
    }
  );

  getAvailableYears = memoize(agenda =>
    [...new Set(this.props.agenda.map(entry => entry.year))].sort(
      (a, b) => b - a
    )
  );

  attendingChangeCallback(index: number, attending: Attending) {
    this.attending[index] = attending;
    window.localStorage.setItem('attending', JSON.stringify(this.attending));
  }

  handleFilterSearchChange(str: string) {
    const filterString = str.trim().toLowerCase();
    this.setState({ filterString });
  }

  handleSelectedYearChange(year: number | null) {
    if (year === null) {
      // Shouldn't happen, but this makes Flow happy
      return;
    }
    this.setState({ selectedYear: year });
  }

  handleSelectedDayChange(day: Day | null) {
    this.setState({ selectedDay: day });
  }

  handleSelectedTalkCheckbox(e: SyntheticInputEvent<HTMLInputElement>) {
    this.setState({ displaySelectedTalks: e.currentTarget.checked });
  }

  render() {
    const { agenda } = this.props;
    const {
      filterString,
      selectedYear,
      selectedDay,
      displaySelectedTalks,
    } = this.state;

    const filteredData = this.getFilteredData(
      agenda,
      filterString,
      selectedYear,
      selectedDay,
      displaySelectedTalks
    );

    const availableYears = this.getAvailableYears(agenda);

    return (
      <Fragment>
        <ValueChooser
          label="Choisissez l'année"
          values={availableYears}
          selectedValue={selectedYear}
          onChange={this.handleSelectedYearChange}
        />
        <ValueChooser
          label="Choisissez le jour"
          values={this.availableDays}
          selectedValue={selectedDay}
          onChange={this.handleSelectedDayChange}
        />
        <label>
          Afficher uniquement les talks sélectionnés{' '}
          <input
            type="checkbox"
            checked={displaySelectedTalks}
            onChange={this.handleSelectedTalkCheckbox.bind(this)}
          />
        </label>
        <InputField label="Filtrer" onChange={this.handleFilterSearchChange} />
        <section>
          {filteredData.length
            ? filteredData.map(({ entry, idx }) => (
                <ListItem
                  key={idx}
                  entry={entry}
                  index={idx}
                  attendingInitialValue={this.attending[idx]}
                  changeCallback={this.attendingChangeCallback}
                />
              ))
            : "Aucune présentation n'a été sélectionnée par les multiples filtres, essayez de les modifier."}
        </section>
      </Fragment>
    );
  }
}

export default List;
