import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';

/**
 * A Collapse component that only functions when the component has mounted.
 * (When adding a new Plant via Apollo, there was an issue where
 * Collapse (via react-motion) would be calling setState before mount.)
 */
class MountOnlyCollapse extends React.Component {
  static propTypes = {
    isOpened: PropTypes.bool,
    springConfig: PropTypes.object
  }

  state = {
    enableCollapse: false
  }

  componentDidMount() {
    this.setState({ enableCollapse: true });
  }

  render() {
    if (this.state.enableCollapse) {
      return (
        <Collapse isOpened={this.props.isOpened} springConfig={this.props.springConfig}>
          {this.props.children}
        </Collapse>
      );
    }

    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

export default MountOnlyCollapse;
