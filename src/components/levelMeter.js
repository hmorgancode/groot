import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';

/**
 * Base component for water- and moisture-level graphics.
 * Represents a meter from 0 to 100% by showing 0-64px of
 * an "empty" meter image on top of a "full" meter image.
 *
 * @param {string} emptyImageUrl URL of the "empty" graphic
 * @param {string} fullImageUrl  URL of the "full" graphic
 */
function levelMeter (emptyImageUrl, fullImageUrl) {
  return class extends React.Component {
    render () {
      // currently just hardcoded- consider making this responsive later
      const maxHeight = 64;
      // Get percentage of max height in pixels
      const emptyImageHeight = Math.ceil((100 - this.props.percentage) / 100 * maxHeight);

      return (
        <div>
          <img src={fullImageUrl} role="presentation" className="image is-64x64"></img>
          <Collapse isOpened={true} fixedHeight={emptyImageHeight} className="level-meter-image">
              <img src={emptyImageUrl} role="presentation" className="image is-64x64"></img>
          </Collapse>
        </div>
      );
    }
  }
}

levelMeter.propTypes = {
  percentage: PropTypes.number.isRequired // 0 to 100
};

export default levelMeter;
