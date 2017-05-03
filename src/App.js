import React from 'react';
import PlantList from './components/PlantList';
import { plants } from './test/testData';
// import logo from './logo.svg';
import './App.css';
// import '../node_modules/font-awesome/css/font-awesome.min.css';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <PlantList plants={plants} />
      </div>
    );
  }
}

export default App;
