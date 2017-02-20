import React from 'react';
import Plant from './Plant'

class PlantList extends React.Component {
  render() {
    return (
      <div className="plant-list">
        { this.props.plants.map((plant) => <Plant key={plant.id} plant={plant} />) }
      </div>
    );
  }
}

export default PlantList;
