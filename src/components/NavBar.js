import React from 'react';
import { connect } from 'react-redux';
import { goToPlants, goToBoards, openModal, toggleEditMode } from '../redux/actionTypes';

class NavBar extends React.Component {

  isActiveTab = (tabName) => {
    return tabName === this.props.activePage ? 'is-active' : '';
  }

  // openModalByContext = () => {
  //   // @TODO: move ADD_PLANT and ADD_BOARD strings to action creators?
  //   // as-is you've got them here and in ModalConductor, communicating via
  //   // redux, which feels weird.
  //   // (same with 'PLANTS' and 'BOARDS' down below)
  //   switch (this.props.activePage) {
  //     case 'PLANTS':
  //       this.props.handleOpenModal('ADD_PLANT');
  //       return;
  //     case 'BOARDS':
  //       this.props.handleOpenModal('ADD_BOARD');
  //       return;
  //     default:
  //       return;
  //   }
  // }

  render() {
    return (
      <div id="nav-bar" className="tabs is-toggle is-fullwidth">
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
          <li id="js-nav-edit" onClick={ this.props.toggleEditMode } className={this.props.isEditing ? 'editing' : ''} >
            <a>
              <span className="icon"><i className="fa fa-cogs"></i></span>
              <span>Add/Remove</span>
            </a>
          </li>
        </ul>
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
