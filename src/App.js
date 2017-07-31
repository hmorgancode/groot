import React from 'react';
import NavBar from './components/NavBar';
import ModalConductor from './components/ModalConductor';
import PlantList from './components/PlantList';
// import AddPlantForm from './components/AddPlantForm';
// import BoardList from './components/BoardList';
// import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <div id="content">
          <PlantList />
        </div>
        <NavBar />
        <ModalConductor />
      </div>
    );
  }
}

export default App;
