import React from 'react';
import { gql, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import closeModal from '../redux/actionTypes'
import axios from 'axios';

class AddPlantModal extends React.Component {

  state = {
    requestInProgress: false,
    name: '',
    altName: '',
    imageData: null,
    imageName: '',
    notes: '',

    selectedBoardIndex: -1,
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

  }

  handleSelectImage = (e) => {
    e.stopPropagation();
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
      <div className="modal-background" onClick={ this.props.handleCloseModal }></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Add Plant</p>
        </header>

        <div className="modal-card-body add-plant-form form-body">
          <div className="control">
            <label className="label">Name</label>
            <input required type="text" className="input"
                   placeholder="Name" value={ this.state.name }
                   onChange={ (e) => { this.setState({ name: e.target.value }) } } />
          </div>

          <div className="control">
            <label className="label">Alternate Name</label>
            <input type="text" className="input"
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
            <textarea className="textarea" value={ this.state.notes }
                      onChange={ (e) => { this.setState({ notes: e.target.value }) } } />
          </div>


          <div className="control">
            <label className="label">Board</label>
            <div className="select">
              <select onChange={(e) => { this.setState({
                selectedBoardIndex: Number(e.target.value),
                selectedSensors: {}
              }) } }>
                <option value={ this.state.selectedBoardIndex }>Select a board:</option>
                {
                  this.props.data.boards &&
                  this.props.data.boards.map((board, index) => {
                    return <option key={ board._id } value={ index }>{ board.location }</option>
                  })
                }
              </select>
            </div>
          </div>


          <div className="control">
            <label className="label">Sensors</label>
              {
                this.state.selectedBoardIndex < 0 ? <p>[select a board]</p> :
                this.props.data.boards[this.state.selectedBoardIndex].sensors.map((sensor) => {
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
              <button className="button is-primary" onClick={this.handleFormSubmit}>Submit</button>
            </p>
            <p className="control">
              <button className="button" onClick={this.props.handleCloseModal}>Cancel</button>
            </p>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

const addPlantMutation = gql`
  mutation addPlant(
    $name: String!,
    $board: String!
    $thumbnail: String,
    $altName: String,
    $tags: [String!],
    $notes: String
    ) {
    createPlant(
      name: $name,
      thumbnail: $thumbnail,
      board: $board,
      altName: $altName,
      tags: $tags,
      notes: $notes
      ) {
        _id
        name
        thumbnail
        board
        altName
        tags
        notes
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

export default compose(
  graphql(addPlantQuery),
  graphql(addPlantMutation),
  connect(
    (state) => ({
      isActive: state.modal.isActive
    }),
    (dispatch) => ({
      handleCloseModal() {
        dispatch(closeModal());
      }
    })
  )
)(AddPlantModal);
