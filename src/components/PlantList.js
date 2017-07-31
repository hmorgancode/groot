import React from 'react';
import { gql, graphql } from 'react-apollo';
// import { connect } from 'react-redux';
import Plant from './Plant';
// import PropTypes from 'prop-types';


class PlantList extends React.Component {
  render() {
    if (this.props.data.error) {
      return <p>{this.props.data.error}</p>;
    }
    if (this.props.data.loading) {
      return <p>Loading...</p>;
    }
    return (
      <div className="list">
        { this.props.data.plants.map((plant) => <Plant key={plant._id} {...plant} />) }
      </div>
    );
  }
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
