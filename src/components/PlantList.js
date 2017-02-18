import React, { Component } from 'react';

const demoPlants = [
  {
    name: 'Drosera Venusta',
    altName: 'Elegant Sundew',
    thumbnail: 'http://cdn3.volusion.com/x9tky.hjnm9/v/vspfiles/photos/DRO-VEN-2T.jpg',
    instructions: 'Add 1-2cm water to its tray.',
    vitality: 'Vigorous'
  },
  {
    name: 'Nepenthes Campanulata',
    altName: 'Bell-Shaped Pitcher Plant',
    thumbnail: 'http://cdn3.volusion.com/x9tky.hjnm9/v/vspfiles/photos/NEP-CAM-2T.jpg',
    instructions: `Keep soil damp, but do not leave it sitting in water. Mist lightly
                   if possible, and refill humidifier in winter- this lil' guy is
                   humidity-sensitive.`,
    vitality: 'Sensitive'
  },
  {
    name: 'Spider Plant',
    altName: 'Spider Plant',
    thumbnail: 'https://maxpull-gdvuch3veo.netdna-ssl.com/wp-content/uploads/2016/05/spider-plant-fertilizer.jpg',
    instructions: 'Water it a bit? (This thing is really hard to kill, so do whatever.)',
    vitality: 'Vigorous'
  }
];

class PlantList extends Component {
  constructor() {
    super();

    this.renderPlant = this.renderPlant.bind(this);
  }

  renderPlant(props) {
    return (
        <article key={props.name} className="media box">
          <div className="media-left">
            <img className="image is-128x128" src={props.thumbnail} alt={props.name}></img>
          </div>
          <div className="media-content content">
            <div className="columns is-mobile">
                <div className="column is-half">
                  <strong>{props.name}</strong><br />
                  <small>{`(${props.altName})`}</small>
                </div>
                <div className="column is-half">
                </div>
            </div>
          </div>
        </article>
    );
  }

  render() {
    const plants = [...demoPlants];
    return (
      <div className="plant-list">
        { plants.map(this.renderPlant) }
      </div>
    );
  }
}

export default PlantList;
