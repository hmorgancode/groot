import React from 'react';
import WaterLevelMeter from './WaterLevelMeter';
import { presets } from 'react-motion';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import { connect } from 'react-redux';

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

  state = {
    expanded: false
  };

  expandBox = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    return (
      <article key={ this.props._id } className="js-plant media box" onClick={ this.expandBox }>
        <div className="media-left">
          <img
            className="image is-64x64"
            src={ this.props.thumbnail }
            alt={ this.props.name }>
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
            { /* For now- just cut off any instruction set that gets too long. */ }
            <div className="plant-description">
              <p>{ this.props.notes }</p>
            </div>
          </Collapse>
        </div>

        <div className="media-right">
          <WaterLevelMeter percentage={Math.random() * 100} />
          {/* placeholder for <WaterMeter plant={plant} /> */ }
        </div>


      </article>
    );
  }
}

const PlantWithState = connect(
  (state) => ({ isEditing: state.app.isEditing })
)(Plant);

export { PlantWithState as Plant, Plant as PlantWithoutState };
