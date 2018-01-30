import React from 'react';
import { gql, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Sensor extends React.Component {
  static propTypes = {
    _id: PropTypes.string,
    type: PropTypes.string,
    dataPin: PropTypes.number,
    powerPin: PropTypes.number,
    createSensor: PropTypes.func.isRequired,
    updateSensor: PropTypes.func.isRequired,
    deleteSensor: PropTypes.func.isRequired,
  };

  static defaultProps = {
    _id: null,
    type: '',
    dataPin: null,
    powerPin: null,
  };

  state = {
    _id: this.props._id,
    type: this.props.type,
    dataPin: this.props.dataPin,
    powerPin: this.props.powerPin,
    confirmingDelete: false,
  }

  componentWillReceiveProps(nextProps) {
    const { _id, type, dataPin, powerPin } = nextProps;
    this.setState({ _id, type, dataPin, powerPin });
  }

  handleCreateSensor = () => {
    this.props.createSensor();
  }

  handleUpdateSensor = () => {
    this.props.updateSensor();
  }

  handleDeleteSensor = () => {
    if (!this.state.confirmingDelete) {
      this.setState({ confirmingDelete: true });
      return;
    }
    // this.setState({ confirmingDelete: false }); // necessary?
    this.props.deleteSensor();
  }

  isEditMode = () => {
    return this.props._id != null;
  }

  sensorHasNewInfo = () => {
    const sensorInfo = ['type', 'dataPin', 'powerPin'];
    const memberHasChanged = (member) => this.props[member] !== this.state[member];
    return sensorInfo.some(memberHasChanged);
  }

  sensorHasValidInput = () => {
    const isValidType = this.state.type.length > 0;
    const isValidDataPin = this.state.dataPin >= 0;
    const isValidPowerPin = this.state.powerPin >= 0;
    return isValidType && isValidDataPin && isValidPowerPin;
  }

  renderCreateSensorButton = () => {
    if (this.isEditMode() || !this.sensorHasValidInput()) {
      return null;
    }
    return (
      <button className="button is-primary js-create-sensor" onClick={this.handleCreateSensor}>
        Create
      </button>
    );
  }

  renderUpdateSensorButton = () => {
    if (this.isEditMode() && this.sensorHasValidInput() && this.sensorHasNewInfo()) {
      return (
        <button className="button is-primary js-update-sensor" onClick={this.handleUpdateSensor}>
          Update
        </button>
      );
    }
    return null;
  }

  renderDeleteSensorButton = () => {
    if (!this.isEditMode()) {
      return null;
    }
    return (
      <button className="button is-danger js-delete-sensor" onClick={this.handleDeleteSensor}>
        {this.state.confirmingDelete ? 'Confirm Deletion' : 'Delete'}
      </button>
    );
  }

  render() {
    return (
      <div className="sensor">
        <div className="control is-grouped">
          <label className="label">Type</label>
          <input
            required
            type="text"
            className="input js-type"
            placeholder="Moisture, Water Level, etc..."
            value={ this.state.type }
            onChange={ (e) => { this.setState({ type: e.target.value }) } } />

          <label className="label">Data Pin</label>
          <input
            type="number"
            className="input js-data-pin"
            value={ this.state.dataPin }
            onChange={ (e) => { this.setState({ dataPin: e.target.value }) } } />

          <label className="label">Power Pin</label>
          <input
            type="number"
            className="input js-power-pin"
            value={ this.state.powerPin }
            onChange={ (e) => { this.setState({ powerPin: e.target.value }) } } />

          {this.renderCreateSensorButton()}
          {this.renderUpdateSensorButton()}
          {this.renderDeleteSensorButton()}
        </div>
      </div>
    );
  }
}



export { Sensor as SensorWithoutState, Sensor as SensorWithState };
