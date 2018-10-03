// @flow

import memoize from 'memoize-one';
import React, { Component, Fragment } from 'react';
import ListItem, { type Attending } from './ListItem';
import InputField from './InputField';
import ValueChooser from './ValueChooser';

import type { Agenda, ConferenceData, Day } from './types';

function compareByDateTime(entryA: ConferenceData, entryB: ConferenceData) {
  if (entryA.date !== entryB.date) {
    if (entryA.date < entryB.date) {
      return -1;
    } else {
      return 1;
    }
  }

  if (entryA.start !== entryB.start) {
    if (entryA.start < entryB.start) {
      return -1;
    } else {
      return 1;
    }
  }

  if (entryA.location !== entryB.location) {
    if (entryA.location < entryB.location) {
      return -1;
    } else {
      return 1;
    }
  }

  return 0;
}

function compareBySpeaker(entryA: ConferenceData, entryB: ConferenceData) {
  // Using the first speaker arbitrary
  return entryA.speakers[0].localeCompare(entryB.speakers[0]);
}

function compareByTitle(entryA: ConferenceData, entryB: ConferenceData) {
  return entryA.title.localeCompare(entryB.title);
}

const sortingFunctions = {
  titre: compareByTitle,
  auteur: compareBySpeaker,
  'date et heure': compareByDateTime,
};

type SortCriteria = $Keys<typeof sortingFunctions>;

type Props = {|
  +agenda: Agenda,
|};

type State = {|
  attending: Array<Attending>,
  filterString: string,
  selectedYear: number,
  selectedDay: Day | null,
  selectedSortCriteria: SortCriteria,
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
    selectedSortCriteria: 'date et heure',
    displaySelectedTalks: false,
  };

  getFilteredData = memoize(
    (
      agenda,
      filterString,
      selectedYear,
      selectedDay,
      selectedSortCriteria,
      displaySelectedTalks
    ) => {
      const sortingFunction = sortingFunctions[selectedSortCriteria];

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
        )
        .sort(({ entry: entryA }, { entry: entryB }) => {
          if (entryA.year !== entryB.year) {
            // This shouldn't happen, but I still put it here in case we change
            // something later.
            // This put newer years before older years.
            return entryB.year - entryA.year;
          }

          return sortingFunction(entryA, entryB);
        });
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
    this.setState({ filterString: str.toLowerCase() });
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

  handleSortCriteriaChange(sortCriteria: SortCriteria | null) {
    if (sortCriteria === null) {
      // Shouldn't happen, but this makes Flow happy
      return;
    }

    this.setState({ selectedSortCriteria: sortCriteria });
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
      selectedSortCriteria,
      displaySelectedTalks,
    } = this.state;

    const filteredData = this.getFilteredData(
      agenda,
      filterString,
      selectedYear,
      selectedDay,
      selectedSortCriteria,
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
        <InputField
          label="Filtrer"
          onChange={this.handleFilterSearchChange}
          value={filterString}
        />
        <ValueChooser
          label="Trier par"
          values={['date et heure', 'auteur', 'titre']}
          selectedValue={selectedSortCriteria}
          onChange={this.handleSortCriteriaChange.bind(this)}
        />
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
