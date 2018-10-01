// @flow

import React, { Component } from 'react';

import PresentationList, { type Agenda } from './PresentationList';

import logo from './logo.svg';
import './App.css';

const FETCH_INTERVAL_MS = 5000;

type SourceAgenda = Array<{|
  +title: string,
  +date: string,
  +year: string,
  +day: 'thursday' | 'friday' | 'saturday',
  +start: string,
  +duration: string,
  +type: 'Conférences' | 'Ateliers',
  +speakers: string[],
  +themes: string[],
|}>;

function timeAdd(startTime: string, duration: number): string {
  const [hour, minutes] = startTime.split(':');
  const endTotalMinutes = parseInt(hour) * 60 + parseInt(minutes) + duration;
  const endHour = Math.floor(endTotalMinutes / 60);
  const endMinutes = endTotalMinutes % 60;
  return `${endHour}:${endMinutes < 10 ? '0' + endMinutes : endMinutes}`;
}

function processAgenda(sourceAgenda): Agenda {
  return sourceAgenda.map(sourceEntry => ({
    title: sourceEntry.title,
    speakers: sourceEntry.speakers,
    location: 'unknown',
    day: sourceEntry.day,
    year: parseInt(sourceEntry.year),
    start: sourceEntry.start,
    end: timeAdd(sourceEntry.start, parseInt(sourceEntry.duration)),
  }));
}

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
    try {
      const fetchResponse = await fetch('/agenda.json');
      if (!fetchResponse.ok) {
        throw new Error(
          `Got an error HTTP Response with status ${fetchResponse.status}`
        );
      }
      const result = await fetchResponse.json();
      const agenda = processAgenda(result);
      this.setState({ agenda });
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
