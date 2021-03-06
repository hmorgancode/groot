import React from 'react';
import { connect } from 'react-redux';
import { goToPlants, goToBoards, openModal, toggleEditMode } from '../redux/actionTypes';
import PropTypes from 'prop-types';

class NavBar extends React.Component {

  static propTypes = {
    activePage: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
    handleOpenModal: PropTypes.func.isRequired,
    handleGoToPlants: PropTypes.func.isRequired,
    handleGoToBoards: PropTypes.func.isRequired,
    toggleEditMode: PropTypes.func.isRequired
  }

  isActiveTab = (tabName) => {
    return tabName === this.props.activePage ? 'is-active' : '';
  }

  openModalByContext = () => {
    // @TODO: move ADD_PLANT and ADD_BOARD strings to action creators?
    // as-is you've got them here and in ModalConductor, communicating via
    // redux, which feels weird.
    // (same with 'PLANTS' and 'BOARDS' down below)
    switch (this.props.activePage) {
      case 'PLANTS':
        this.props.handleOpenModal('ADD_PLANT');
        return;
      case 'BOARDS':
        this.props.handleOpenModal('ADD_BOARD');
        return;
      default:
        return;
    }
  }

  render() {
    return (
      <div id="nav-bar">
      <div className="tabs is-toggle is-fullwidth">
        <ul>
          <li id="js-nav-plants" onClick={() => { this.props.handleGoToPlants(); } } className={this.isActiveTab('PLANTS')}>
            <a>
              <span className="icon"><i className="fa fa-pagelines"></i></span>
              <span>Plants</span>
            </a>
          </li>
          <li id="js-nav-boards" onClick={() => { this.props.handleGoToBoards(); } } className={this.isActiveTab('BOARDS')}>
            <a>
              <span className="icon"><i className="fa fa-bolt"></i></span>
              <span>Boards</span>
            </a>
          </li>
          <li id="js-nav-edit" className={`${this.props.isEditing ? 'editing' : ''}`} onClick={ this.props.toggleEditMode } >
            <a>
              <span className="icon"><i className="fa fa-cogs"></i></span>
              <span>Add/Remove</span>
            </a>
          </li>
        </ul>
      </div>
      { this.props.isEditing &&
      <div className="add-item-button" onClick={this.openModalByContext} >
        <a className="button is-success">
          <span className="icon"><i className="fa fa-plus"></i></span>
          <span>Add</span>
        </a>
      </div>
      }
      </div>
    );
  }
}

const NavBarWithState = connect(
  (state) => ({ activePage: state.app.activePage, isEditing: state.app.isEditing }),
  (dispatch) => ({
    handleOpenModal(modalType) {
      dispatch(openModal(modalType));
    },
    handleGoToPlants() {
      dispatch(goToPlants());
    },
    handleGoToBoards() {
      dispatch(goToBoards());
    },
    toggleEditMode() {
      dispatch(toggleEditMode());
    }
  })
)(NavBar);

export { NavBarWithState as NavBar, NavBar as NavBarWithoutState };
