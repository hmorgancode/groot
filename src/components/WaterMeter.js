import React from 'react';

class WaterMeter extends React.Component {
  render() {
    const plant = this.props.plant;
    return (
      <nav className="level">
            <meter className="meter is-info"
                      value={plant.soilMoisture || plant.waterLevel} max="1">
              {plant.waterLevel ? 'Water Level' : 'Soil Moisture'}
            </meter>
        </nav>
    );
  }
}

export default WaterMeter;
