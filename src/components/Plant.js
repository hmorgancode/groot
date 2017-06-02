import React from 'react';
import WaterLevelMeter from './WaterLevelMeter';
import Truncate from 'react-truncate';
import { Collapse } from 'react-collapse';
import PropTypes from 'prop-types';

class Plant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {expanded: false};
  }

  expandBox() {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    const plant = this.props.plant;
    // Move this to a Tag component and pass tags and guideMode
    // let guideModeTags = '', standardModeTags = '';
    // if (this.props.guideMode) {
    //   guideModeTags = plant.tags.map((tag) => <span key={tag} className="tag is-success">{tag}</span>);
    // } else {
    //   standardModeTags = plant.tags.map((tag) => <span key={tag} className="tag is-success">{tag}</span>);
    // }
    return (
      <article key={plant.id} className="media box" onClick={this.expandBox.bind(this)}>
        <div className="media-left">
          <img className="image is-64x64" src={plant.thumbnail} alt={plant.name}></img>
        </div>

        <div className={'media-content'}>
          <div className="core-content">
            <div>
              <strong>{plant.name}</strong>
              <br />
              <small>{`(${plant.altName})`}</small>
              <br />
              {  plant.tags.length > 0 && plant.tags.map((tag) => <span key={tag} className="tag is-success">{tag}</span>)  }
              {  plant.tags.length > 0 && <br />  }
            </div>
          </div>
          <Collapse isOpened={this.state.expanded}>
            { /* For now- just cut off any instruction set that gets too long. */ }
            <div className="plant-description">
              <Truncate lines={4} ellipsis={''}>
                <p>{plant.instructions}</p>
              </Truncate>
            </div>
          </Collapse>
        </div>

        <div className="media-right">
          <WaterLevelMeter percentage={60} />
          {/* placeholder for <WaterMeter plant={plant} /> */ }
        </div>


      </article>
    );
  }
}

Plant.propTypes = {
  plant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    altName: PropTypes.string,
    thumbnail: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    instructions: PropTypes.string
  })
};

export default Plant;
