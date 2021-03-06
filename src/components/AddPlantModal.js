import React from 'react';
import { gql, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { closeModal } from '../redux/actionTypes'
import axios from 'axios';
import PlantsQuery from '../graphql/PlantsQuery';
import { ModalWithoutState, Modal } from './Modal';
import PropTypes from 'prop-types';

function createAddPlantModal(Modal) {
  return class AddPlantModal extends React.Component {

    static propTypes = {
      createPlant: PropTypes.func.isRequired,
      updatePlant: PropTypes.func.isRequired,
      deletePlant: PropTypes.func.isRequired,
      handleCloseModal: PropTypes.func.isRequired,
      axios: PropTypes.func.isRequired,
      // ID of the plant to populate the form with (if this isn't a new plant)
      target: PropTypes.string,
      plantsData: PropTypes.shape({
        plants: PropTypes.array.isRequired
      }).isRequired,
      boardsData: PropTypes.shape({
        boards: PropTypes.array.isRequired
      }).isRequired,
    }

    // Shim so that we can provide a substitute during unit testing.
    static defaultProps = {
      axios: axios
      // we also shim in createPlant during testing, but that's provided by Apollo
    }

    // Set default state depending on whether or not the form should
    // be populated with an existing plant's data
    constructor(props) {
      super(props);
      if (!props.target) {
        this.state = {
          requestInProgress: false,
          confirmingDelete: false,
          // Required:
          name: '',
          selectedBoardId: null,
          // Optional:
          altName: '',
          imageData: null,
          imageName: '',
          uploadedImageName: '',
          notes: '',
          selectedSensors: {}
        }
        return;
      }
      // Populate using the existing plant's data:
      const targetPlant = props.plantsData.plants.find((plant) => plant._id === props.target);
      // targetPlant.sensors.map returns an array, so you'll be unfolding the keys 0, 1, etc
      // you'll need to unfold an object instead
      // ...how do you get an object? reduce?
      const selectedSensors = targetPlant.sensors.reduce((obj, sensor) => { obj[sensor._id] = true; return obj; }, {});
      this.state = {
        requestInProgress: false,
        confirmingDelete: false,
        name: targetPlant.name,
        selectedBoardId: targetPlant.board._id,
        altName: targetPlant.altName,
        imageData: null,
        imageName: '',
        uploadedImageName: targetPlant.thumbnail,
        notes: targetPlant.notes,
        selectedSensors
      }
    }

    // Upload the image (if provided) and submit the plant's data
    handleFormSubmit = async () => {
      if (this.state.name === '' || this.state.selectedBoardId == null) {
        return;
      }

      this.setState({ requestInProgress: true });

      if (this.state.imageData) {
        await this.handleUploadImage();
      }

      if (this.props.target) {
        await this.handleUpdatePlant();
      } else {
        await this.handleCreatePlant();
      }

      this.setState({ requestInProgress: false });
      this.props.handleCloseModal();
    }

    handleUploadImage = async () => {
      try {
        const res = await this.props.axios.post('http://localhost:3000/image_upload', this.state.imageData);
        this.setState({ uploadedImageName: res.data });
      } catch (error) {
        this.setState({ error });
        console.error('An error occurred while uploading the thumbnail image.');
      }
    }

    handleCreatePlant = async () => {
      const selectedBoard = this.getSelectedBoard();
      // do graphQL mutation!
      // await? for now just call this async function then close immediately
      this.props.createPlant({
        variables: {
          name: this.state.name,
          altName: this.state.altName,
          thumbnail: this.state.uploadedImageName,
          notes: this.state.notes,
          board: selectedBoard._id,
          sensors: Object.entries(this.state.selectedSensors).map(([key, value]) => key)
        },
        // @TODO figure out why enabling optimistic response was causing a single warning from
        // react-motion. After the optimistic update things were okay, but the immediate
        // followup actual update caused the warning (setState called while component unmounted)
        // probably a solid reason if you dig through the source sometime
        // optimisticResponse: {
        //   __typename: 'Mutation',
        //   createPlant: {
        //     __typename: 'Plant',
        //     // temp id, server decides real one.
        //     // consider making a uuid here in case of multiple optimistic updates.
        //     _id: (Math.random() * 100).toString(),
        //     name: this.state.name,
        //     altName: this.state.altName,
        //     thumbnail: uploadedImageName,
        //     notes: this.state.notes,
        //     tags: [],
        //     board: { __typename: 'Board', location: selectedBoard.location, _id: selectedBoard._id },
        //     sensors: selectedBoard.sensors.filter((sensor) => this.state.selectedSensors[sensor._id])
        //       .map((sensor) => ({ __typename: 'Sensor', type: sensor.type, _id: sensor._id }))
        //   }
        // },
        update: (store, { data: { createPlant } }) => {
          const data = store.readQuery({ query: PlantsQuery });
          // debugger;
          data.plants.push(createPlant);
          store.writeQuery({ query: PlantsQuery, data });
          // const foo = store.readQuery({ query: getPlantsQuery });
          // debugger;
        }
      });
    }

    handleUpdatePlant = () => {
      this.props.updatePlant({
        variables: {
          _id: this.props.target,
          name: this.state.name,
          altName: this.state.altName,
          thumbnail: this.state.uploadedImageName,
          notes: this.state.notes,
          board: this.getSelectedBoard()._id,
          sensors: Object.entries(this.state.selectedSensors).map(([key, value]) => key)
        }
        // no need to include a manual update- apollo can tell we're updating a
        // Plant with a specific ID that's present in our store.
      });
    }

    handleDeletePlant = () => {
      if (!this.state.confirmingDelete) {
        this.setState({ confirmingDelete: true });
        return;
      }
      this.props.deletePlant({
        variables: {
          _id: this.props.target
        },
        update: (store, { data: { deletePlant } }) => {
          const data = store.readQuery({ query: PlantsQuery });
          const removeIndex = data.plants.findIndex((plant) => plant._id === deletePlant._id);
          data.plants.splice(removeIndex, 1);
          store.writeQuery({ query: PlantsQuery, data });
        }
      });
      this.setState({ confirmingDelete: false });
      this.props.handleCloseModal();
    }

    getSelectedBoard = () => {
      return this.props.boardsData.boards.find((board) => board._id === this.state.selectedBoardId);
    }

    handleSelectImage = (e) => {
      let data = new FormData();
      data.append('thumbnail', e.target.files[0]);
      this.setState({
        imageName: e.target.files[0].name,
        imageData: data
      });
    }

    render() {
      return (
        <Modal title={`${this.props.target ? 'Edit' : 'Add' } Plant`}
          body={
          <div className="modal-form">
            <div className="control">
              <label className="label">Name</label>
              <input required type="text" className="input js-name"
                     placeholder="Name" value={ this.state.name }
                     onChange={ (e) => { this.setState({ name: e.target.value }) } } />
            </div>

            <div className="control">
              <label className="label">Alternate Name</label>
              <input type="text" className="input js-alt-name"
                     placeholder="Latin, etc..." value={ this.state.altName }
                     onChange={ (e) => { this.setState({ altName: e.target.value }) } } />
            </div>

            <div className="control">
              <label className="label">Picture</label>
              <label htmlFor="add-plant-image" className="button is-info label">
                <p className="fa fa-picture-o"></p>
              </label>
              { !this.state.requestInProgress &&
                <input id="add-plant-image" accept="image/*" className="file-input" type="file"
                       onChange={ this.handleSelectImage }/>
              }
            </div>

            {/*
            <div className="control has-icons-right">
              <label className="label">Tags</label>
              <input type="text" className="input"/>
            </div>
            */}


            <div className="control">
              <label className="label">Notes</label>
              <textarea className="textarea js-notes" value={ this.state.notes }
                        onChange={ (e) => { this.setState({ notes: e.target.value }) } } />
            </div>


            <div className="control">
              <label className="label">Board</label>
              <div className="select">
                <select className="js-board-select" defaultValue={this.state.selectedBoardId} onChange={(e) => { this.setState({
                  selectedBoardId: e.target.value === 'null' ? null : e.target.value,
                  selectedSensors: {}
                }) } }>
                  <option value="null">Select a board:</option>
                  {
                    this.props.boardsData && this.props.boardsData.boards &&
                    this.props.boardsData.boards.map((board, index) => {
                      return <option key={ board._id } value={ board._id }>{ board.location }</option>
                    })
                  }
                </select>
              </div>
            </div>


            <div className="control">
              <label className="label">Sensors</label>
                {
                  this.state.selectedBoardId === null ? <p>[select a board]</p> :
                  this.getSelectedBoard().sensors.map((sensor) => {
                    return <div className="control" key={ sensor._id }>
                             <label className="checkbox">
                               <input type="checkbox" value={ sensor._id }
                                      className="js-sensor-checkbox"
                                      checked={ this.state.selectedSensors[sensor._id] || false }
                                      onChange={ (e) => { this.setState({
                                        selectedSensors: { ...this.state.selectedSensors, [sensor._id]: e.target.checked }
                                      }) } } />
                               { `${sensor.type} - Pin ${sensor.dataPin}` }
                             </label>
                           </div>
                  })
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
            { this.props.target &&
              <p className="control">
                <button className="button is-danger js-delete-button" onClick={this.handleDeletePlant}>
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

// you name the mutation just for debugging purposes.
// there's only one mutation, given to your component's props
// as "mutate" (unless you do custom arguments / wrap with multiple mutations)
const createPlantMutation = gql`
  mutation createPlant(
    $name: String!,
    $board: ID!
    $thumbnail: String,
    $altName: String,
    $tags: [String!],
    $notes: String,
    $sensors: [ID!]
    ) {
    createPlant(
      name: $name,
      altName: $altName,
      thumbnail: $thumbnail,
      board: $board,
      tags: $tags,
      notes: $notes,
      sensors: $sensors
      ) {
        _id
        name
        altName
        thumbnail
        board {
          _id
          location
        }
        tags
        notes
        sensors {
          _id
          type
        }
      }
  }
`;

const updatePlantMutation = gql`
  mutation updatePlant(
    $_id: ID!,
    $name: String!,
    $board: ID!
    $thumbnail: String,
    $altName: String,
    $tags: [String!],
    $notes: String,
    $sensors: [ID!]
    ) {
    updatePlant(
      _id: $_id,
      name: $name,
      altName: $altName,
      thumbnail: $thumbnail,
      board: $board,
      tags: $tags,
      notes: $notes,
      sensors: $sensors
      ) {
        _id
        name
        altName
        thumbnail
        board {
          _id
          location
        }
        tags
        notes
        sensors {
          _id
          type
        }
      }
  }
`;

const deletePlantMutation = gql`
  mutation deletePlant(
    $_id: ID!
  ) {
    deletePlant (
      _id: $_id
    ) {
      _id
    }
  }
`;

const createPlantQuery = gql`
  query AddPlantQuery {
    boards {
      _id
      location
      sensors {
        _id
        type
        dataPin
      }
    }
  }
`;

let AddPlantModal = createAddPlantModal(Modal);

AddPlantModal = compose(
  graphql(createPlantQuery, { name: 'boardsData' }),
  graphql(PlantsQuery, { name: 'plantsData' }),
  graphql(createPlantMutation, { name: 'createPlant' }),
  graphql(updatePlantMutation, { name: 'updatePlant' }),
  graphql(deletePlantMutation, { name: 'deletePlant' }),
  connect(
    null, // not mapping state to any props in this component
    (dispatch) => ({
      handleCloseModal() {
        dispatch(closeModal());
      }
    })
  )
)(AddPlantModal);

const AddPlantModalWithoutState = createAddPlantModal(ModalWithoutState);

export { AddPlantModalWithoutState, AddPlantModal };
