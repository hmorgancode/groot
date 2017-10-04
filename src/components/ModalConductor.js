import React from 'react';
import { connect } from 'react-redux';
import { AddPlantModal } from './AddPlantModal';

class ModalConductor extends React.Component {

  render() {
    if (!this.props.isActive) {
      return null;
    }

    switch(this.props.modalType) {
      case 'ADD_PLANT':
        return <AddPlantModal />;

      default:
        return null;
    }

  }
}

const ModalConductorWithState = connect(
  (state) => ({ isActive: state.modal.isActive, modalType: state.modal.modalType })
)(ModalConductor);

export default ModalConductorWithState;
