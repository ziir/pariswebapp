// @flow

import React, { Component } from 'react';

import PresentationList, { type Agenda } from './PresentationList';

import logo from './logo.svg';
import './App.css';

const FETCH_INTERVAL_MS = 5000;

type State = {|
  agenda: Agenda | null,
|};

class App extends Component<{||}, State> {
  _timeoutId: TimeoutID | null = null;
  _LastModified: string | null;
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
    try {
      const fetchResponse = await fetch('/agenda.json');
      if (!fetchResponse.ok) {
        throw new Error(
          `Got an error HTTP Response with status ${fetchResponse.status}`
        );
      }
      const result = await fetchResponse.json();

      let LastModified;
      try {
        LastModified = fetchResponse.headers.get('Last-Modified');
      } catch (e) {
        LastModified = null;
        console.error('Unable to retrieve Last-Modified response header.', e);
      }
      if (!LastModified || LastModified !== this._LastModified) {
        this.setState({ agenda: result });
        this._LastModified = LastModified;
      }
    } catch (e) {
      console.error('Got an error while fetching the agenda.', e);
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
