// @flow

import React, { Component } from 'react';

import PresentationList, { type Agenda } from './PresentationList';

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
    try {
      const fetchResponse = await fetch('/agenda.json');
      if (!fetchResponse.ok) {
        throw new Error(
          `Got an error HTTP Response with status ${fetchResponse.status}`
        );
      }
      const result = await fetchResponse.json();

      let lastModified;
      try {
        lastModified = fetchResponse.headers.get('Last-Modified');
      } catch (e) {
        lastModified = new Date().toUTCString();
        console.error('Unable to retrieve Last-Modified response header.', e);
      }
      if (!lastModified || lastModified !== this.state.lastModified) {
        this.setState({ agenda: result, lastModified });
      }
    } catch (e) {
      console.error('Got an error while fetching the agenda.', e);
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
