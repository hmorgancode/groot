import React from 'react';
import { gql, graphql } from 'react-apollo';
// import { connect } from 'react-redux';
import Plant from './Plant';
// import PropTypes from 'prop-types';


function PlantList({ data: { error, loading, plants } }) {
  if (error) {
    return <p>{error}</p>;
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="list">
      { plants.map((plant) => <Plant key={plant._id} {...plant} />) }
    </div>
  );
}

// PlantList.propTypes = {
  // plants: PropTypes.arrayOf(PropTypes.object)
// };

const plantListQuery = gql`
  query PlantListQuery {
    plants {
      _id
      name
      altName
      thumbnail
      tags
      notes
      board {
        location
      }
      sensors {
        type
        # data
      }
    }
  }
`;

const PlantListWithData = graphql(plantListQuery)(PlantList);

// const PlantListWithDataAndState = connect(
//   (state) => ({ modalIsActive: state.modal.isActive })
// )(PlantListWithData);

export default PlantListWithData;
