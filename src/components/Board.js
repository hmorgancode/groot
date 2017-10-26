import React from 'react';
import { Collapse } from 'react-collapse';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

  handleOpenEditModal = (e) => {
    e && e.stopPropagation();
    this.props.openEditModal(this.props._id);
  }

  render() {
    return (
      <article key={ this.props._id } className="js-board media box" onClick={ this.expandBox }>
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

        <div className="media-right">
          { this.props.isEditing &&
            <div className="js-edit-board" onClick={this.handleOpenEditModal}>
              <button className="icon"><i className="fa fa-edit"></i></button>
            </div>
          }
        </div>
      </article>
    );
  }
}

const BoardWithState = connect(
  (state) => ({ isEditing: state.app.isEditing })
)(Board);


export { Board as BoardWithoutState, BoardWithState as Board };
