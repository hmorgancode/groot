import React from 'react';
import { gql, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Sensor extends React.Component {
  static propTypes = {
    _id: PropTypes.string,
    type: PropTypes.string,
    dataPin: PropTypes.number,
    powerPin: PropTypes.number,
  };

  static defaultProps = {
    _id: null,
    type: '',
    dataPin: null,
    powerPin: null,
  };

  render() {
    return <div></div>;
  }
}



export { Sensor as SensorWithoutState, Sensor as SensorWithState };
