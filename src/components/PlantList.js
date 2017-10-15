import React from 'react';
import { graphql } from 'react-apollo';
import Plant from './Plant';
import PlantsQuery from '../graphql/PlantsQuery';
import PropTypes from 'prop-types';


function PlantList({ data: { error, loading, plants }}) {
  if (error) {
    return <p>{error}</p>;
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="list">
      { plants && plants.map((plant) => <Plant key={plant._id} {...plant} />) }
    </div>
  );
}

PlantList.propTypes = {
  data: PropTypes.shape({
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    plants: PropTypes.arrayOf(PropTypes.object).isRequired
  })
};

const PlantListWithData = graphql(PlantsQuery)(PlantList);

export default PlantListWithData;
