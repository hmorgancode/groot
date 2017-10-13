import React from 'react';
import { ModalWithoutState, Modal } from './Modal';
import axios from 'axios';
import BoardsQuery from '../graphql/BoardsQuery';
import { gql, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { closeModal } from '../redux/actionTypes';

function createAddBoardModal(Modal) {
  /**
   * A modal for adding Boards (arduino or another microcontroller
   * that serves as a hub for plants and their sensors)
   */
  return class AddBoardModal extends React.Component {
    state = {
      // Required:
      location: '',
      // Optional:
      type: '',
      isRemote: false,
      imageName: '',
      imageData: null
    }

    // Shim so that we can provide a substitute during unit testing.
    static defaultProps = {
      axios: axios
      // we also shim in mutate during testing, but that's provided by Apollo
    }

    handleSelectImage = (e) => {
      let data = new FormData();
      data.append('thumbnail', e.target.files[0]);
      this.setState({
        imageName: e.target.files[0].name,
        imageData: data
      });
    }

    // Upload the image (if provided) and submit the board's data
    handleFormSubmit = async (e) => {
      if (this.state.location === '') {
        return;
      }

      let uploadedImageName = '';
      if (this.state.imageData) {
        try {
          const res = await this.props.axios.post('http://localhost:3000/image_upload', this.state.imageData);
          uploadedImageName = res.data;
        } catch (error) {
          this.setState({ error });
          console.error('An error occurred while uploading the thumbnail image.');
          return;
        }
      }

      this.props.mutate({
        variables: {
          location: this.state.location,
          type: this.state.type,
          isRemote: this.state.isRemote,
          thumbnail: uploadedImageName
        },
        update: (store, { data: { createBoard } })=> {
          const data = store.readQuery({ query: BoardsQuery });
          data.boards.push(createBoard);
          store.writeQuery({ query: BoardsQuery, data });
        }
      });

      this.props.handleCloseModal();
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

const addBoardMutation = gql`
  mutation addBoard(
    $location: String!,
    $type: String,
    $isRemote: Boolean,
    $thumbnail: String
    ) {
    createBoard(
      location: $location,
      type: $type,
      isRemote: $isRemote,
      thumbnail: $thumbnail
      ) {
        _id
        location
        type
        isRemote
        thumbnail
      }
  }
`;

let AddBoardModal = createAddBoardModal(Modal);
AddBoardModal = compose(
  graphql(addBoardMutation),
  connect(
    null, // not mapping state to any props in this component
    (dispatch) => ({
      handleCloseModal() {
        dispatch(closeModal());
      }
    })
  )
)(AddBoardModal);

const AddBoardModalWithoutState = createAddBoardModal(ModalWithoutState);

export { AddBoardModalWithoutState, AddBoardModal };
