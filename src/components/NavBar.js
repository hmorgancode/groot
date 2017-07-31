import React from 'react';
import { connect } from 'react-redux';
import { openModal } from '../redux/actionTypes';
// import AddPlantForm from './AddPlantForm';
// import ReactModal from 'react-modal';
// ReactModal.setAppElement('#i-am-root');

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'Plants',
      // showModal: false
    };
    this.changeTab = this.changeTab.bind(this);
    // this.handleOpenModal = this.handleOpenModal.bind(this);
    // this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  /**
   * Changes the currently active tab to the one selected.
   * @param  {string} tabName The name of the tab. Right now these
   *                          are just self-documented in render().
   */
  changeTab(tabName) {
    if (this.state.activeTab !== tabName) {
      this.setState({ activeTab: tabName });
    }
  }

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
          <li onClick={() => this.changeTab('Plants')} className={this.state.activeTab === 'Plants' && 'is-active'}>
            <a>
              <span className="icon"><i className="fa fa-pagelines"></i></span>
              <span>Plants</span>
            </a>
          </li>
          <li onClick={() => this.changeTab('Sensors')} className={ this.state.activeTab === 'Sensors' && 'is-active'}>
            <a>
              <span className="icon"><i className="fa fa-bolt"></i></span>
              <span>Sensors</span>
            </a>
          </li>
          <li onClick={ () => this.props.handleOpenModal('ADD_PLANT') } className={ this.state.activeTab === 'Add/Remove' && 'is-active'}>
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
    }
  })
)(NavBar);

export default NavBarWithState;
