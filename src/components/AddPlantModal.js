import React from 'react';
import { gql, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { closeModal } from '../redux/actionTypes'
import axios from 'axios';
import PlantsQuery from '../graphql/PlantsQuery';

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
  }

  // Shim so that we can provide a substitute during unit testing.
  static defaultProps = {
    axios: axios
    // we also shim in mutate during testing, but that's provided by Apollo
  }

  // Upload the image (if provided) and submit the plant's data
  handleFormSubmit = async (e) => {
    if (this.state.name == null || this.state.selectedBoardId == null) {
      return;
    }

    this.setState({ requestInProgress: true });

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
      update: (store, { data: { createPlant } })=> {
        const data = store.readQuery({ query: PlantsQuery });
        // debugger;
        data.plants.push(createPlant);
        store.writeQuery({ query: PlantsQuery, data });
        // const foo = store.readQuery({ query: getPlantsQuery });
        // debugger;
      }
    });

    this.props.handleCloseModal();
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
