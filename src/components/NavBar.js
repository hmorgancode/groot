import React from 'react';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 'Plants' };
    this.changeTab = this.changeTab.bind(this);
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
          <li onClick={() => this.changeTab('Add/Remove')} className={ this.state.activeTab === 'Add/Remove' && 'is-active'}>
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

export default NavBar;
