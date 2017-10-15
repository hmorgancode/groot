import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../redux/actionTypes';
import PropTypes from 'prop-types';
/**
 * HOC for modals. For modal use, see ModalConductor
 */
class Modal extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    body: PropTypes.element,
    foot: PropTypes.element,
    handleCloseModal: PropTypes.func.isRequired
  }

  render() {
    const { title, body, foot } = this.props;
    return (
      <div className="modal is-active">
      <div className="modal-background js-modal-background" onClick={ this.props.handleCloseModal }></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title js-modal-title">{title}</p>
        </header>

        <div className="modal-card-body">
          { body }
        </div>

        <div className="modal-card-foot">
          { foot }
        </div>
        <button className="modal-close js-close-modal" onClick={this.props.handleCloseModal}></button>
      </div>
      </div>
    );
  }
}

const ModalWithState = connect(
  null, // not mapping state to any props in this component
  (dispatch) => ({
    handleCloseModal() {
      dispatch(closeModal());
    }
  })
)(Modal);

export { Modal as ModalWithoutState, ModalWithState as Modal };
