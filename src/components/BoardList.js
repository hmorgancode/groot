import React from 'react';
import { graphql } from 'react-apollo';
import Board from './Board';
import BoardsQuery from '../graphql/BoardsQuery';
import PropTypes from 'prop-types';

function BoardList ( { data: { error, loading, boards }}) {
  if (error) {
    return <p>{error}</p>;
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="list">
      { boards.map((board) => <Board key={board._id} {...board} />) }
    </div>
  );
}

BoardList.propTypes = {
  data: PropTypes.shape({
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    boards: PropTypes.arrayOf(PropTypes.object)
  }).isRequired
};

const BoardListWithData = graphql(BoardsQuery)(BoardList);

export { BoardListWithData as BoardList, BoardList as BoardListWithoutData };
