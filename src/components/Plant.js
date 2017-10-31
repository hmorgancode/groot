import React from 'react';
import { presets } from 'react-motion';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import { connect } from 'react-redux';
import { openModal } from '../redux/actionTypes';

class Plant extends React.Component {

  static propTypes = {
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    board: PropTypes.object.isRequired,
    altName: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    notes: PropTypes.string,
    sensors: PropTypes.arrayOf(PropTypes.object),
    // redux:
    isEditing: PropTypes.bool.isRequired
  }

    // return boardIds[Math.floor(Math.random() * boardIds.length)];
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      waterLevel: (Math.random() * 3).toFixed(2),
      moistureLevel: Math.floor(Math.random() * 1023),
      light: Math.floor(Math.random() * 1023)
    }

  }

  expandBox = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  handleOpenEditModal = (e) => {
    // check for null for a test
    e && e.stopPropagation();
    this.props.openEditModal(this.props._id);
  }

  render() {


    return (
      <article key={ this.props._id } className="js-plant media box" onClick={ this.expandBox }>
        <div className="media-left">
          <img
            className="image is-64x64"
            src={ this.props.thumbnail }
            alt={ this.props.thumbnail ? this.props.name : '' }>
          </img>
        </div>

        <div className={'media-content'}>
          <div className="core-content">
            <div>
              <strong>{ this.props.name }</strong>
              <br />
              { this.props.altName && <small>{`(${ this.props.altName })`}</small> }
              <br />
              { this.props.tags.length > 0 && this.props.tags.map((tag) => <span key={tag} className="tag is-success">{tag}</span>) }
              { this.props.tags.length > 0 && <br /> }
            </div>
          </div>

          <Collapse isOpened={ this.state.expanded } springConfig={ presets.stiff } >

            <div className="plant-status">
              { /* this.props.sensors.map(sensor => <div>{sensor.type}</div>) */}
              <span className="tag">Water Level - {this.state.waterLevel}cm</span>
              <progress className="progress is-link" value={`${Math.floor(this.state.waterLevel * 100 / 3)}`} max="100"></progress>
              <span className="tag">Soil Moisture - {this.state.moistureLevel}</span>
              <progress className="progress is-info" value={`${this.state.moistureLevel}`} max="1023"></progress>
              <span className="tag">Light - {this.state.light}</span>
              <progress className="progress is-warning" value={`${this.state.light}`} max="1023"></progress>
            </div>

            <div className="plant-description">
              <p>{ this.props.notes }</p>
            </div>
          </Collapse>
        </div>

        <div className="media-right">
          { this.props.isEditing &&
            <div className="js-edit-plant" onClick={this.handleOpenEditModal}>
              <button className="icon"><i className="fa fa-edit"></i></button>
            </div>
          }
          {/*<WaterLevelMeter percentage={Math.random() * 100} />*/}
        </div>
      </article>
    );
  }
}

const PlantWithState = connect(
  (state) => ({ isEditing: state.app.isEditing }),
  (dispatch) => ({
    openEditModal(_id) {
      dispatch(openModal('ADD_PLANT', _id));
    }
  })
)(Plant);

export { PlantWithState as Plant, Plant as PlantWithoutState };
