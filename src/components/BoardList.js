import React from 'react';
import { graphql } from 'react-apollo';
import Board from './Board';
import BoardsQuery from '../graphql/BoardsQuery';
// import PropTypes from 'prop-types';


class BoardList extends React.Component {
  render() {
    if (this.props.data.error) {
      return <p>{this.props.data.error}</p>;
    }
    if (this.props.data.loading) {
      return <p>Loading...</p>;
    }
    return (
      <div className="list">
        { this.props.data.boards.map((board) => <Board key={board._id} {...board} />) }
      </div>
    );
  }
}

// BoardList.propTypes = {
  // Boards: PropTypes.arrayOf(PropTypes.object)
// };

const BoardListWithData = graphql(BoardsQuery)(BoardList);

export default BoardListWithData;
