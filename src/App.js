import React from 'react';
import { connect } from 'react-redux';
import NavBar from './components/NavBar';
import ModalConductor from './components/ModalConductor';
import PlantList from './components/PlantList';
// import AddPlantForm from './components/AddPlantForm';
import BoardList from './components/BoardList';
// import logo from './logo.svg';
import './App.css';

class AppWithoutState extends React.Component {

  isActivePage = (page) => {
    return (page === this.props.activePage) ? '' : 'hidden';
  }

  render() {
    return (
      <div className="app">
        <div id="content">
          <div className={this.isActivePage('PLANTS')}>
            <PlantList />
          </div>
          <div className={this.isActivePage('BOARDS')}>
            <BoardList />
          </div>
        </div>
        <NavBar />
        <ModalConductor />
      </div>
    );
  }
}

const App = connect(
  (state) => ({ activePage: state.app.activePage })
)(AppWithoutState);

// switch these to App and AppWithState later, react devtools go by the name you give connect
export { AppWithoutState, App };
