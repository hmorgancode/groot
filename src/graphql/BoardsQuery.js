import { gql } from 'react-apollo';

const BoardListQuery = gql`
  query BoardListQuery {
    boards {
      _id
      location
      thumbnail
      sensors {
        _id
        dataPin
        type
      }
    }
  }
`;

export default BoardListQuery;
