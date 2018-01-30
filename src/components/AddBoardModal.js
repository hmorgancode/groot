import React from 'react';
import { ModalWithoutState, Modal } from './Modal';
import axios from 'axios';
import BoardsQuery from '../graphql/BoardsQuery';
import { gql, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { closeModal } from '../redux/actionTypes';
import PropTypes from 'prop-types';
import { SensorWithState as Sensor } from './Sensor';

function createAddBoardModal(Modal) {
  /**
   * A modal for adding Boards (arduino or another microcontroller
   * that serves as a hub for plants and their sensors)
   */
  return class AddBoardModal extends React.Component {

    static propTypes = {
      createBoard: PropTypes.func.isRequired,
      updateBoard: PropTypes.func.isRequired,
      deleteBoard: PropTypes.func.isRequired,
      handleCloseModal: PropTypes.func.isRequired,
      axios: PropTypes.func.isRequired,
      // ID of the board to populate the form with (if this isn't a new board)
      target: PropTypes.string,
      boardsData: PropTypes.shape({
        boards: PropTypes.array.isRequired
      }).isRequired,
    }

    // Shim so that we can provide a substitute during unit testing.
    static defaultProps = {
      axios: axios
      // we also shim in mutate during testing, but that's provided by Apollo
    }

    // Set default state depending on whether or not the form should
    // be populated with an existing board's data
    constructor(props) {
      super(props);
      this.state = {
        requestInProgress: false,
        confirmingDelete: false,
        // Required:
        location: '',
        // Optional:
        type: '',
        isRemote: false,
        imageName: '',
        imageData: null,
        uploadedImageName: '',
      }
      if (!props.target) {
        return;
      }
      // Populate using the existing board's data:
      const targetBoard = props.boardsData.boards.find((board) => board._id === props.target);
      this.state = {
        ...this.state,
        location: targetBoard.location,
        type: targetBoard.type,
        isRemote: targetBoard.isRemote,
        sensors: targetBoard.sensors,
      }
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
    handleFormSubmit = async () => {
      if (this.state.location === '') {
        return;
      }

      // @TODO add progress indicator at some point
      this.setState({ requestInProgress: true });

      if (this.state.imageData) {
        await this.handleUploadImage();
      }

      if (this.props.target) {
        await this.handleUpdateBoard();
      } else {
        await this.handleCreateBoard();
      }

      this.setState({ requestInProgress: false });
      this.props.handleCloseModal();
    }

    handleUploadImage = async (e) => {
      try {
        const res = await this.props.axios.post('http://localhost:3000/image_upload', this.state.imageData);
        this.setState({ uploadedImageName: res.data });
      } catch (error) {
        this.setState({ error });
        console.error('An error occurred while uploading the thumbnail image.');
      }
    }

    // Upload the image (if provided) and submit the board's data
    handleCreateBoard = async (e) => {
      await this.props.createBoard({
        variables: {
          location: this.state.location,
          type: this.state.type,
          isRemote: this.state.isRemote,
          thumbnail: this.state.uploadedImageName
        },
        update: (store, { data: { createBoard } })=> {
          const data = store.readQuery({ query: BoardsQuery });
          data.boards.push(createBoard);
          store.writeQuery({ query: BoardsQuery, data });
        }
      });
    }

    handleUpdateBoard = async () => {
      await this.props.updateBoard({
        variables: {
          _id: this.props.target,
          location: this.state.location,
          type: this.state.type,
          isRemote: this.state.isRemote,
          thumbnail: this.state.uploadedImageName
        }
      });
    }

    handleDeleteBoard = () => {
      if (!this.state.confirmingDelete) {
        this.setState({ confirmingDelete: true });
        return;
      }
      this.props.deleteBoard({
        variables: {
          _id: this.props.target
        },
        update: (store, { data: { deleteBoard } }) => {
          const data = store.readQuery({ query: BoardsQuery });
          const removeIndex = data.boards.findIndex((board) => board._id === deleteBoard._id);
          data.boards.splice(removeIndex, 1);
          store.writeQuery({ query: BoardsQuery, data });
        }
      });
      this.setState({ confirmingDelete: false });
      this.props.handleCloseModal();
    }

    renderSensorList = () => (
      <div className="control js-sensors-list">
        <label className="label">Create a New Sensor</label>
        <Sensor />
        <label className="label">Sensors</label>
        {this.state.sensors.map((sensor) => <Sensor {...sensor} />)}
      </div>
    )

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
                     placeholder="Arduino Mega, Uno, Nano, etc..." value={ this.state.type }
                     onChange={ (e) => { this.setState({ type: e.target.value }) } } />
            </div>

            <div className="control">
              <label className="checkbox">Is remote:</label>
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

            {this.props.target && this.renderSensorList()}

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
            { this.props.target &&
              <p className="control">
                <button className="button is-danger js-delete-button" onClick={this.handleDeleteBoard}>
                  {this.state.confirmingDelete ? 'Confirm Deletion' : 'Delete'}
                </button>
              </p>
            }
          </div>
        }
        />
      );
    }
  }
}


const createBoardMutation = gql`
  mutation createBoard(
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
        sensors {
          _id
          type
          dataPin
          powerPin
        }
      }
  }
`;


const updateBoardMutation = gql`
  mutation updateBoard(
    $_id: ID!,
    $location: String!,
    $type: String,
    $isRemote: Boolean,
    $thumbnail: String,
    $sensors: [ID!]
    ) {
    updateBoard(
      _id: $_id,
      location: $location,
      type: $type,
      isRemote: $isRemote,
      thumbnail: $thumbnail,
      sensors: $sensors
      ) {
        _id
        location
        type
        isRemote
        thumbnail
        sensors {
          _id
          type
          dataPin
          powerPin
        }
      }
  }
`;

const deleteBoardMutation = gql`
  mutation deleteBoard(
    $_id: ID!
  ) {
    deleteBoard (
      _id: $_id
    ) {
      _id
    }
  }
`;

let AddBoardModal = createAddBoardModal(Modal);
AddBoardModal = compose(
  graphql(BoardsQuery, { name: 'boardsData' }),
  graphql(createBoardMutation, { name: 'createBoard'}),
  graphql(updateBoardMutation, { name: 'updateBoard'}),
  graphql(deleteBoardMutation, { name: 'deleteBoard'}),
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
