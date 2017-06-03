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
        <div className="nav-bar tabs is-toggle is-fullwidth">
          <ul>
            <a>
              <li className="is-active">
                <span>One</span>
              </li>
            </a>
            <a>
              <li>
                <span>Two</span>
              </li>
            </a>
            <a>
              <li>
                <span>Three</span>
              </li>
            </a>
            <a>
              <li>
                <span>Four</span>
              </li>
            </a>
          </ul>
        </div>
      </div>
    );
  }
}
        // <PlantList plants={plants} />

export default App;
