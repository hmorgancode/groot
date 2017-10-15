import React from 'react';
// import { gql, graphql } from 'react-apollo';
// import Truncate from 'react-truncate';
import { Collapse } from 'react-collapse';
import PropTypes from 'prop-types';

class Board extends React.Component {

  static propTypes = {
    _id: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    sensors: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  state = {
    expanded: false
  }

  expandBox = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    return (
      <article key={ this.props._id } className="media box" onClick={ this.expandBox }>
        <div className="media-left">
          <img
            className="image is-64x64"
            src={ this.props.thumbnail || `${process.env.PUBLIC_URL}/ard.png` }
            alt={ this.props.location }>
          </img>
        </div>

        <div className={'media-content'}>
          <div className="core-content">
            <div>
              <strong>{ this.props.location }</strong>
            </div>
          </div>
          <Collapse isOpened={ this.state.expanded }>
            { this.props.sensors.map((sensor) => <li key={sensor._id}>{`Pin ${sensor.dataPin} - ${sensor.type}`}</li>) }
          </Collapse>
        </div>
      </article>
    );
  }
}

export default Board;
