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
|};

class App extends Component<{||}, State> {
  _timeoutId: TimeoutID | null = null;
  state = { agenda: null };

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
    const agenda = await fetchAgenda();
    if (agenda !== null) {
      this.setState({ agenda });
    }
    this._timeoutId = setTimeout(() => this.fetchData(), FETCH_INTERVAL_MS);
  }

  render() {
    const { agenda } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Paris Web App</h1>
        </header>
        {agenda ? <PresentationList agenda={agenda} /> : null}
      </div>
    );
  }
}

export default App;
