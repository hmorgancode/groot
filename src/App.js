import React from 'react';
import NavBar from './components/NavBar';
import PlantList from './components/PlantList';
import { plants } from './test/testData';
// import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <div id="content">
          <PlantList plants={plants} />
        </div>
        <NavBar />
      </div>
    );
  }
}

export default App;
