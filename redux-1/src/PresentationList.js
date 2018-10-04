// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ListItem from './ListItem';
import InputField from './InputField';
import ValueChooser from './ValueChooser';
import LocalStorageManager from './LocalStorageManager';
import {
  changeFilterString,
  changeSelectedDay,
  changeSelectedYear,
  changeSortCriteria,
  changeDisplaySelectedTalks,
} from './actions';
import {
  getViewOptions,
  getFilteredAndSortedData,
  getAvailableYears,
} from './selectors';

import type { AgendaWithIndex, Day } from './types/agenda';
import type { SortCriteria } from './types/state';

type Props = {|
  +agenda: AgendaWithIndex,
  +availableYears: number[],
  +filterString: string,
  +displaySelectedTalks: boolean,
  +changeSelectedYear: typeof changeSelectedYear,
  +changeSortCriteria: typeof changeSortCriteria,
  +changeDisplaySelectedTalks: typeof changeDisplaySelectedTalks,
  +changeFilterString: typeof changeFilterString,
|};

const YearValueChooser = connect(state => ({
  label: `Choisissez l'année`,
  values: getAvailableYears(state),
  selectedValue: getViewOptions(state).selectedYear,
}))(ValueChooser);

const DayValueChooser = connect(
  state => ({
    label: 'Choisissez le jour',
    values: [null, 'jeudi', 'vendredi', 'samedi'],
    selectedValue: getViewOptions(state).selectedDay,
  }),
  { onChange: changeSelectedDay }
)(ValueChooser);

const SortValueChooser = connect(state => ({
  label: 'Trier par',
  values: ['date et heure', 'auteur', 'titre'],
  selectedValue: getViewOptions(state).sortCriteria,
}))(ValueChooser);

class List extends Component<Props> {
  handleSelectedYearChange = this.handleSelectedYearChange.bind(this);
  handleFilterSearchChange = this.handleFilterSearchChange.bind(this);
  handleSortCriteriaChange = this.handleSortCriteriaChange.bind(this);

  availableDays: Array<Day | null> = [null, 'jeudi', 'vendredi', 'samedi'];

  handleFilterSearchChange(str: string) {
    this.props.changeFilterString(str);
  }

  handleSelectedYearChange(year: number | null) {
    if (year === null) {
      // Shouldn't happen, but this makes Flow happy
      return;
    }
    this.props.changeSelectedYear(year);
  }

  handleSortCriteriaChange(sortCriteria: SortCriteria | null) {
    const { changeSortCriteria } = this.props;
    if (sortCriteria === null) {
      // Shouldn't happen, but this makes Flow happy
      return;
    }

    changeSortCriteria(sortCriteria);
  }

  handleSelectedTalkCheckbox(e: SyntheticInputEvent<HTMLInputElement>) {
    const { changeDisplaySelectedTalks } = this.props;
    changeDisplaySelectedTalks(e.currentTarget.checked);
  }

  render() {
    const { agenda, filterString, displaySelectedTalks } = this.props;

    return (
      <Fragment>
        <LocalStorageManager />
        <YearValueChooser onChange={this.handleSelectedYearChange} />
        <DayValueChooser />
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
        <SortValueChooser onChange={this.handleSortCriteriaChange} />
        <section>
          {agenda.length
            ? agenda.map(({ idx }) => <ListItem key={idx} index={idx} />)
            : "Aucune présentation n'a été sélectionnée par les multiples filtres, essayez de les modifier."}
        </section>
      </Fragment>
    );
  }
}

export default connect(
  state => ({
    agenda: getFilteredAndSortedData(state),
    availableYears: getAvailableYears(state),
    filterString: getViewOptions(state).filterString,
    displaySelectedTalks: getViewOptions(state).displaySelectedTalks,
  }),
  {
    changeSortCriteria,
    changeSelectedYear,
    changeDisplaySelectedTalks,
    changeFilterString,
  }
)(List);
