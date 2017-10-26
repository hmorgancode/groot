import React from 'react';
import { connect } from 'react-redux';
import { AddPlantModal } from './AddPlantModal';
import { AddBoardModal } from './AddBoardModal';
import PropTypes from 'prop-types';

class ModalConductor extends React.Component {

  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    modalType: PropTypes.string.isRequired,
    modalTarget: PropTypes.string
  }

  render() {
    if (!this.props.isActive) {
      return null;
    }

    switch(this.props.modalType) {
      case 'ADD_PLANT':
        return <div id="js-conductor-add-plant"><AddPlantModal /></div>;
      case 'ADD_BOARD':
        return <div id="js-conductor-add-board"><AddBoardModal /></div>;
      default:
        return null;
    }

  }
}

const ModalConductorWithState = connect(
  (state) => ({ isActive: state.modal.isActive, modalType: state.modal.modalType, modalTarget: state.modal.modalTarget })
)(ModalConductor);

export { ModalConductorWithState as ModalConductor, ModalConductor as ModalConductorWithoutState };
