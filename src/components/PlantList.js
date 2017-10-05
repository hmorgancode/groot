import React from 'react';
import { graphql } from 'react-apollo';
// import { connect } from 'react-redux';
import Plant from './Plant';
import PlantsQuery from '../graphql/PlantsQuery';
// import PropTypes from 'prop-types';


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

const PlantListWithData = graphql(PlantsQuery)(PlantList);

// const PlantListWithDataAndState = connect(
//   (state) => ({ modalIsActive: state.modal.isActive })
// )(PlantListWithData);

export default PlantListWithData;
