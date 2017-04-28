import React from 'react';
import WaterMeter from './WaterMeter';
import Truncate from 'react-truncate';

class Plant extends React.Component {


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
      <article key={plant.id} className="media box">
        <div className="media-left">
          <img className="image is-64x64" src={plant.thumbnail} alt={plant.name}></img>
        </div>
        <div className="media-content">
          <strong>{plant.name}</strong>
          {plant.tags.map((tag) => <span key={tag} className="tag is-success">{tag}</span>)}
          <br />

          <small>{`(${plant.altName})`}</small>
          <br />

          {/* Just cut off any instruction set that gets too long. */}
          <div className="plant-description">
            <Truncate lines={2} ellipsis={''}>
              <p>{plant.instructions}</p>
            </Truncate>
          </div>

          <WaterMeter plant={plant} />

        </div>
      </article>
    );
  }
}

export default Plant;
