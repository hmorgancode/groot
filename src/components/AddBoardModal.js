import React from 'react';
import { ModalWithoutState, Modal } from './Modal';

function createAddBoardModal(Modal) {
  /**
   * A modal for adding Boards (arduino or another microcontroller
   * that serves as a hub for plants and their sensors)
   */
  return class AddBoardModal extends React.Component {
    state = {
      location: '',
      type: '',
      isRemote: false,
      imageName: '',
      imageData: null
    }

    render() {
      return (
        <Modal title="Add Board"
        body={
          <div className="modal-form">
            <div className="control">
              <label className="label">Location</label>
              <input required type="text" className="input js-location"
                     placeholder="Location" value={ this.state.location }
                     onChange={ (e) => { this.setState({ location: e.target.value }) } } />
            </div>

            <div className="control">
              <label className="label">Type</label>
              <input type="text" className="input js-type"
                     placeholder="Moisture, Water Level, etc..." value={ this.state.type }
                     onChange={ (e) => { this.setState({ type: e.target.value }) } } />
            </div>

            <div className="control">
              <label className="checkbox"></label>
              <input type="checkbox" className="js-is-remote"
                     checked={ this.state.isRemote }
                     onChange={ (e) => { this.setState({ isRemote: e.target.checked }) } } />
              { /* </label> 50% sure this isn't necessary */ }
             </div>

            <div className="control">
              <label className="label">Picture</label>
              <label htmlFor="add-board-image" className="button is-info label">
                <p className="fa fa-picture-o"></p>
              </label>
              { !this.state.requestInProgress &&
                <input id="add-board-image" accept="image/*" className="file-input" type="file"
                       onChange={ this.handleSelectImage }/>
              }
            </div>
          </div>
        }

        foot={
          <div className="control is-grouped">
            <p className="control">
              <button className="button is-primary js-submit-form" onClick={this.handleFormSubmit}>Submit</button>
            </p>
            <p className="control">
              <button className="button js-cancel-button" onClick={this.props.handleCloseModal}>Cancel</button>
            </p>
          </div>
        }
        />
      );
    }
  }
}

const AddBoardModal = createAddBoardModal(Modal);
const AddBoardModalWithoutState = createAddBoardModal(ModalWithoutState);

export { AddBoardModalWithoutState, AddBoardModal };
