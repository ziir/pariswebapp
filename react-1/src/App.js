// @flow

import React, { Component } from 'react';

import PresentationList from './PresentationList';

import logo from './logo.svg';
import './App.css';

class App extends Component<{||}> {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Paris Web App</h1>
        </header>
        <PresentationList />
      </div>
    );
  }
}

export default App;
