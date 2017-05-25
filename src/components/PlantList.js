import React from 'react';
import Plant from './Plant';
import PropTypes from 'prop-types';

class PlantList extends React.Component {
  render() {
    return (
      <div className="plant-list">
        { this.props.plants.map((plant) => <Plant key={plant.id} plant={plant} />) }
      </div>
    );
  }
}

PlantList.propTypes = {
  plants: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default PlantList;
