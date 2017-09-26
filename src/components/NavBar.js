import React from 'react';
import { connect } from 'react-redux';
import { goToPlants, goToBoards, openModal } from '../redux/actionTypes';
// import AddPlantForm from './AddPlantForm';
// import ReactModal from 'react-modal';
// ReactModal.setAppElement('#i-am-root');

class NavBar extends React.Component {

  state = {
    activeTab: 'Plants'
  };

  /**
   * Changes the currently active tab to the one selected.
   * @param  {string} tabName The name of the tab. Right now these
   *                          are just self-documented in render().
   */
  changeTab = (tabName) => {
    if (this.state.activeTab !== tabName) {
      this.setState({ activeTab: tabName });
    }
  };

  isActiveTab = (tabName) => {
    return tabName === this.state.activeTab ? 'is-active' : '';
  };

  // handleOpenModal() {
  //   this.setState({ showModal: true });
  // }
  // handleCloseModal() {
  //   this.setState({ showModal: false });
  // }

  render() {
    return (
      <div id="nav-bar" className="tabs is-toggle is-fullwidth">
        <ul>
          <li onClick={() => { this.changeTab('Plants'); this.props.handleGoToPlants(); } } className={this.isActiveTab('Plants')}>
            <a>
              <span className="icon"><i className="fa fa-pagelines"></i></span>
              <span>Plants</span>
            </a>
          </li>
          <li onClick={() => { this.changeTab('Sensors'); this.props.handleGoToBoards(); } } className={this.isActiveTab('Sensors')}>
            <a>
              <span className="icon"><i className="fa fa-bolt"></i></span>
              <span>Boards</span>
            </a>
          </li>
          <li onClick={ () => this.props.handleOpenModal('ADD_PLANT') } className={this.isActiveTab('Add/Remove')}>
            <a>
              <span className="icon"><i className="fa fa-cogs"></i></span>
              <span>Add/Remove</span>
            </a>
          </li>
        </ul>

        {/*<ReactModal
          isOpen={ this.state.showModal }
          onAfterOpen={ this.afterOpenModal }
          contentLabel="Add Plant Window"
          onRequestClose={ this.handleCloseModal }
          className="Modal"
          overlayClassName="Overlay"
        >
          <AddPlantForm handleCloseModal={this.handleCloseModal} />
        </ReactModal>*/}
      </div>
    );
  }
}

const NavBarWithState = connect(
  null, // nav bar doesn't use store data right now
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
