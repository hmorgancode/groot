import React from 'react';
import { gql, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { closeModal } from '../redux/actionTypes'
import axios from 'axios';

class AddPlantModalWithoutState extends React.Component {

  state = {
    requestInProgress: false,
    name: '',
    altName: '',
    imageData: null,
    imageName: '',
    notes: '',

    selectedBoardId: null,
    selectedSensors: {}
  };

  // Upload the image, then make a put request for the new plant.
  handleFormSubmit = async (e) => {
    // Verify form input


    this.setState({ requestInProgress: true });
    // Upload the image and store the result.
    let uploadedImageName;
    try {
      const res = await axios.post('http://localhost:3000/image_upload', this.state.imageData);
      uploadedImageName = res.data;
    } catch (error) {
      this.setState({ error });
      console.error('An error occurred while uploading the thumbnail image.');
      return;
    }

    // Create plant
    console.log(uploadedImageName);
    const selectedBoard = this.getSelectedBoard();

    // do graphQL mutation!
    this.props.mutate({
      variables: {
        name: this.state.name,
        altName: this.state.altName,
        thumbnail: uploadedImageName,
        notes: this.state.notes,
        board: selectedBoard._id,
        sensors: Object.entries(this.state.selectedSensors).map(([key, value]) => key)
      },
      optimisticResponse: {
        createPlant: {
          _id: -1, // temp, server decides real one
          name: this.state.name,
          altName: this.state.altName,
          thumbnail: uploadedImageName,
          notes: this.state.notes,
          // @TODO: Look up how apollo handles nested graphQL types
          // and whether this optimistic update is correct or if you should
          // create 'board' by value and not by reference.
          board: selectedBoard,
          sensors: selectedBoard.sensors.filter((sensor) => this.state.selectedSensors[sensor._id])
        }
      }
    })
  }

  getSelectedBoard = () => {
    return this.props.data.boards.find((board) => board._id === this.state.selectedBoardId);
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
      <div className={'modal is-active'}>
      <div className="modal-background js-modal-background" onClick={ this.props.handleCloseModal }></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Add Plant</p>
        </header>

        <div className="modal-card-body add-plant-form form-body">
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
              <select className="js-board-select" onChange={(e) => { this.setState({
                selectedBoardId: e.target.value === 'null' ? null : e.target.value,
                selectedSensors: {}
              }) } }>
                <option value="null">Select a board:</option>
                {
                  this.props.data && this.props.data.boards &&
                  this.props.data.boards.map((board, index) => {
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

        <div className="modal-card-foot">
          <div className="control is-grouped">
            <p className="control">
              <button className="button is-primary js-submit-form" onClick={this.handleFormSubmit}>Submit</button>
            </p>
            <p className="control">
              <button className="button js-close-modal" onClick={this.props.handleCloseModal}>Cancel</button>
            </p>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

// you name the mutation just for debugging purposes.
// there's only one mutation, given to your component's props
// as "mutate" (unless you do custom arguments)
const addPlantMutation = gql`
  mutation addPlant(
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
        }
        tags
        notes
        sensors {
          _id
        }
      }
  }
`;

const addPlantQuery = gql`
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

const AddPlantModal = compose(
  graphql(addPlantQuery),
  graphql(addPlantMutation),
  connect(
    null, // not mapping state to any props in this component
    (dispatch) => ({
      handleCloseModal() {
        dispatch(closeModal());
      }
    })
  )
)(AddPlantModalWithoutState);

export { AddPlantModalWithoutState, AddPlantModal };
