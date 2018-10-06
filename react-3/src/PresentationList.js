// @flow

import memoize from 'memoize-one';
import React, { Component, Fragment } from 'react';
import ListItem, { type Attending } from './ListItem';
import InputField from './InputField';
import ValueChooser from './ValueChooser';

import type { Agenda, ConferenceData, Day } from './types';
import './PresentationList.css';

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
  handleSortCriteriaChange = this.handleSortCriteriaChange.bind(this);

  availableDays: Array<Day | null> = [null, 'jeudi', 'vendredi', 'samedi'];
  availableSortCriterias: Array<SortCriteria> = [
    'date et heure',
    'auteur',
    'titre',
  ];

  state = {
    filterString: '',
    selectedYear: 2018,
    selectedDay: null,
    selectedSortCriteria: 'date et heure',
    displaySelectedTalks: false,
  };

  getFilteredData = memoize(
    (agenda, filterString, selectedYear, selectedDay, displaySelectedTalks) =>
      agenda
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
  );

  getSortedData = memoize((filteredData, selectedSortCriteria) => {
    const sortingFunction = sortingFunctions[selectedSortCriteria];
    return filteredData.slice().sort(({ entry: entryA }, { entry: entryB }) => {
      if (entryA.year !== entryB.year) {
        // This shouldn't happen, but I still put it here in case we change
        // something later.
        // This put newer years before older years.
        return entryB.year - entryA.year;
      }

      return sortingFunction(entryA, entryB);
    });
  });

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
      displaySelectedTalks
    );

    const availableYears = this.getAvailableYears(agenda);

    const sortedData = this.getSortedData(filteredData, selectedSortCriteria);

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
          onChange={this.handleFilterSearchChange.bind(this)}
          value={filterString}
        />
        <ValueChooser
          label="Trier par"
          values={this.availableSortCriterias}
          selectedValue={selectedSortCriteria}
          onChange={this.handleSortCriteriaChange}
        />
        <section>
          {sortedData.length
            ? sortedData.map(({ entry, idx }) => (
                <ListItem
                  className="PresentationList-Item"
                  entry={entry}
                  index={idx}
                  attendingInitialValue={this.attending[idx]}
                  changeCallback={this.attendingChangeCallback.bind(this, idx)}
                />
              ))
            : "Aucune présentation n'a été sélectionnée par les multiples filtres, essayez de les modifier."}
        </section>
      </Fragment>
    );
  }
}

export default List;
