import React from 'react';
import { connect } from 'react-redux';
import NavBar from './components/NavBar';
import ModalConductor from './components/ModalConductor';
import PlantList from './components/PlantList';
// import AddPlantForm from './components/AddPlantForm';
import BoardList from './components/BoardList';
// import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        { this.props.activePage === 'PLANTS' &&
          <div id="content">
            <PlantList />
          </div>
        }
        { this.props.activePage === 'BOARDS' &&
          <div id="content">
            <BoardList />
          </div>
        }
        <NavBar />
        <ModalConductor />
      </div>
    );
  }
}

const AppWithState = connect(
  (state) => ({ activePage: state.app.activePage })
)(App);

export { App as AppWithoutState, AppWithState };
