import React from 'react';
import { gql, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { closeModal,
         selectBoard,
         selectImage,
         uploadImageRequest,
         uploadImageSuccess,
         uploadImageFailure,
         deleteImageRequest,
         deleteImageSuccess,
         deleteImageFailure
       } from '../redux/actionTypes'
import axios from 'axios';

class AddPlantModal extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelectImage = this.handleSelectImage.bind(this);
  }

  // Consider a more durable way to handle this later
  // Currently, just upload something when someone selects an image.
  // If they change it, delete the old image upload and upload the new one.
  async handleSelectImage(e) {
    e.stopPropagation();
    if (this.props.form.selectedImageName === e.target.files[0].name) {
      return;
    }
    this.props.handleSelectImage(e.target.files[0].name);

    // Keep this data here so the event can go back to pool.
    let data = new FormData();
    data.append('thumbnail', e.target.files[0]);

    // delete the last image we uploaded
    if (this.props.form.uploadedImageName != null) {
      try {
        this.props.handleDeleteImageRequest();
        await axios.post('http://localhost:3000/image_delete', { imageName: this.props.form.uploadedImageName });
        this.props.handleDeleteImageSuccess();
      } catch (err) {
        this.props.handleDeleteImageFailure(err);
        return;
      }
    }

    // Upload the image and store the result.
    try {
      this.props.handleUploadImageRequest();
      const res = await axios.post('http://localhost:3000/image_upload', data);
      this.props.handleUploadImageSuccess(res.data);
    } catch (err) {
      this.props.handleUploadImageFailure(err);
      this.props.handleSelectImage('');
    }
  }

  render() {
    return (
      <div className={'modal ' + (this.props.isActive ? 'is-active ' : '')}>
      <div className="modal-background" onClick={this.props.handleCloseModal}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Add Plant</p>
        </header>

        <div className="modal-card-body add-plant-form form-body">
          <div className="control">
            <label className="label">Name</label>
            <input required type="text" className="input" placeholder="Name"/>
          </div>

          <div className="control">
            <label className="label">Alternate Name</label>
            <input type="text" className="input" placeholder="Latin, etc..."/>
          </div>

          <div className="control">
            <label className="label">Picture</label>
            <label htmlFor="add-plant-image" className="button is-info label">
              <p className="fa fa-picture-o"></p>
            </label>
            { !this.props.form.isFetching &&
              <input id="add-plant-image" accept="image/*" className="file-input" type="file"
                     /* value={this.props.form.selectedImageName} */
                     onChange={this.handleSelectImage}/>
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
            <textarea className="textarea"/>
          </div>


          <div className="control">
            <label className="label">Board</label>
            <div className="select">
              <select onChange={(e) => { this.props.handleSelectBoard(Number(e.target.value)) } }>
                <option value="-1">Select a board:</option>
                {
                  this.props.data.boards &&
                  this.props.data.boards.map((board, index) => {
                    return <option key={board._id} value={index}>{board.location}</option>
                  })
                }
              </select>
            </div>
          </div>


          <div className="control">
            <label className="label">Sensors</label>
              {
                this.props.form.selectedBoardIndex < 0 ? <p>[select a board]</p> :
                this.props.data.boards[this.props.form.selectedBoardIndex].sensors.map((sensor) => {
                  return <div className="control" key={sensor._id}>
                           <label className="checkbox">
                             <input type="checkbox" value={sensor._id} />
                             {`${sensor.type} - Pin ${sensor.dataPin}`}
                           </label>
                         </div>
                })
              }
          </div>
        </div>

        <div className="modal-card-foot">
          <div className="control is-grouped">
            <p className="control">
              <button className="button is-primary" onClick={() => console.log('BUTTON!')}>Submit</button>
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
      isActive: state.modal.isActive,
      form: state.addPlantModal
    }),
    (dispatch) => ({
      handleCloseModal() {
        dispatch(closeModal());
      },
      handleSelectBoard(selectedBoardIndex) {
        dispatch(selectBoard(selectedBoardIndex));
      },
      handleSelectImage(selectedImage) {
        dispatch(selectImage(selectedImage));
      },
      handleUploadImageRequest() {
        dispatch(uploadImageRequest());
      },
      handleUploadImageSuccess(name) {
        dispatch(uploadImageSuccess(name));
      },
      handleUploadImageFailure(error) {
        dispatch(uploadImageFailure(error));
      },
      handleDeleteImageRequest() {
        dispatch(deleteImageRequest());
      },
      handleDeleteImageSuccess() {
        dispatch(deleteImageSuccess());
      },
      handleDeleteImageFailure(error) {
        dispatch(deleteImageFailure(error));
      }
    })
  )
)(AddPlantModal);
