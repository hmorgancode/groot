import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="columns">
  <div className="column is-three-quarters">
    <p className="notification is-info">
      <code className="html">is-three-quarters</code>
    </p>
  </div>
  <div className="column">
    <p className="notification is-warning">Auto</p>
  </div>
  <div className="column">
    <p className="notification is-danger">Auto</p>
  </div>
</div>

<div className="columns">
  <div className="column is-two-thirds">
    <p className="notification is-info">
      <code className="html">is-two-thirds</code>
    </p>
  </div>
  <div className="column">
    <p className="notification is-warning">Auto</p>
  </div>
  <div className="column">
    <p className="notification is-danger">Auto</p>
  </div>
</div>

<div className="columns">
  <div className="column is-half">
    <p className="notification is-info">
      <code className="html">is-half</code>
    </p>
  </div>
  <div className="column">
    <p className="notification is-warning">Auto</p>
  </div>
  <div className="column">
    <p className="notification is-danger">Auto</p>
  </div>
</div>

<div className="columns">
  <div className="column is-one-third">
    <p className="notification is-info">
      <code className="html">is-one-third</code>
    </p>
  </div>
  <div className="column">
    <p className="notification is-success">Auto</p>
  </div>
  <div className="column">
    <p className="notification is-warning">Auto</p>
  </div>
</div>

<div className="columns">
  <div className="column is-one-quarter">
    <p className="notification is-info">
      <code className="html">is-one-quarter</code>
    </p>
  </div>
  <div className="column">
    <p className="notification is-success">Auto</p>
  </div>
</div>
      </div>
    );
  }
}

export default App;
