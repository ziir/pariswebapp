// @flow

import React, { Component } from 'react';

import PresentationList from './PresentationList';
import fetchAgenda from './logic/fetch-agenda';

import type { Agenda } from './types';

import logo from './logo.svg';
import './App.css';

const FETCH_INTERVAL_MS = 5000;

type State = {|
  agenda: Agenda | null,
  lastModified: string | null,
|};

class App extends Component<{||}, State> {
  _timeoutId: TimeoutID | null = null;
  state = { agenda: null, lastModified: null };

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
    const agendaResult = await fetchAgenda(this.state.lastModified);
    if (agendaResult !== null) {
      const { agenda, lastModified } = agendaResult;
      this.setState({ agenda, lastModified });
    }
    this._timeoutId = setTimeout(() => this.fetchData(), FETCH_INTERVAL_MS);
  }

  render() {
    const { agenda, lastModified } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Paris Web App</h1>
        </header>
        {agenda ? (
          // Use `lastModified` as `key` here allows to simplify
          // remount the `PresentationList` component whenever the agenda
          // content changes. This way, `attending` initial values
          // (default or coming from the ) are computed only once in
          // PresentationList's constructor.
          <PresentationList key={lastModified} agenda={agenda} />
        ) : null}
      </div>
    );
  }
}

export default App;
