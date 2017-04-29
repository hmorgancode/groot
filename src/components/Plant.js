import React from 'react';
import WaterMeter from './WaterMeter';
import Truncate from 'react-truncate';

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
      <article key={plant.id} className="media box {this.state.expanded && 'expanded'}" onClick={this.expandBox.bind(this)}>
        <div className="media-left">
          <img className="image is-64x64" src={plant.thumbnail} alt={plant.name}></img>
        </div>
        <div className="media-content">
          <strong>{plant.name}</strong>
          <br />

          <div>
            <small>{`(${plant.altName})`}</small>
            <br />
          </div>
          <WaterMeter plant={plant} />

          { this.state.expanded && plant.tags.length > 0 && plant.tags.map((tag) => <span key={tag} className="tag is-success">{tag}</span>) }
          { this.state.expanded && plant.tags.length > 0 && <br />}

          {/* Just cut off any instruction set that gets too long. */}
          { this.state.expanded &&
            <div className="plant-description">
              <Truncate lines={4} ellipsis={''}>
                <p>{plant.instructions}</p>
              </Truncate>
            </div>
          }


        </div>
      </article>
    );
  }
}

export default Plant;
