import { gql } from 'react-apollo';

const BoardListQuery = gql`
  query BoardListQuery {
    boards {
      _id
      location
      type
      isRemote
      thumbnail
      sensors {
        _id
        type
        dataPin
        powerPin
      }
    }
  }
`;

export default BoardListQuery;
