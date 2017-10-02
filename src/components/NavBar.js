import React from 'react';
import { connect } from 'react-redux';
import { goToPlants, goToBoards, openModal } from '../redux/actionTypes';

class NavBar extends React.Component {

  isActiveTab = (tabName) => {
    return tabName === this.props.activePage ? 'is-active' : '';
  }

  render() {
    return (
      <div className="tabs is-toggle is-fullwidth">
        <ul>
          <li onClick={() => { this.props.handleGoToPlants(); } } className={this.isActiveTab('PLANTS')}>
            <a>
              <span className="icon"><i className="fa fa-pagelines"></i></span>
              <span>Plants</span>
            </a>
          </li>
          <li onClick={() => { this.props.handleGoToBoards(); } } className={this.isActiveTab('BOARDS')}>
            <a>
              <span className="icon"><i className="fa fa-bolt"></i></span>
              <span>Boards</span>
            </a>
          </li>
          <li onClick={ () => this.props.handleOpenModal('ADD_PLANT') }>
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
  (state) => ({ activePage: state.app.activePage }),
  (dispatch) => ({
    handleOpenModal(modalType) {
      dispatch(openModal(modalType));
    },
    handleGoToPlants() {
      dispatch(goToPlants());
    },
    handleGoToBoards() {
      dispatch(goToBoards());
    }
  })
)(NavBar);

export default NavBarWithState;
