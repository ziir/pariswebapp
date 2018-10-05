// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import PresentationList from './PresentationList';
import fetchAgenda from './logic/fetch-agenda';
import { agendaHasLoaded } from './actions';
import { getAgenda, getAgendaLastModified } from './selectors';

import logo from './logo.svg';
import './App.css';

const FETCH_INTERVAL_MS = 5000;

type Props = {|
  +agendaHasLoaded: typeof agendaHasLoaded,
  +hasAgenda: boolean,
  +agendaLastModified: string | null,
|};

class App extends Component<Props> {
  _timeoutId: TimeoutID | null = null;

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }

  async fetchData() {
    const { agendaLastModified, agendaHasLoaded } = this.props;
    const agendaResult = await fetchAgenda(agendaLastModified);
    if (agendaResult !== null) {
      const { agenda, lastModified } = agendaResult;
      agendaHasLoaded(agenda, lastModified);
    }
    this._timeoutId = setTimeout(() => this.fetchData(), FETCH_INTERVAL_MS);
  }

  render() {
    const { hasAgenda } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="" />
          <h1 className="App-title">Paris Web App</h1>
        </header>
        <main>
          {hasAgenda ? (
            // Use `lastModified` as `key` here allows to simplify
            // remount the `PresentationList` component whenever the agenda
            // content changes. This way, `attending` initial values
            // (default or coming from the ) are computed only once in
            // PresentationList's constructor.
            <PresentationList />
          ) : null}
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hasAgenda: getAgenda(state) !== null,
  agendaLastModified: getAgendaLastModified(state),
});
const mapDispatchToProps = { agendaHasLoaded };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
