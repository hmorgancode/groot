import { gql } from 'react-apollo';

const PlantsQuery = gql`
  query PlantsQuery {
    plants {
      _id
      name
      altName
      thumbnail
      tags
      notes
      board {
        _id
        location
      }
      sensors {
        _id
        type
        # data
      }
    }
  }
`;

export default PlantsQuery;
