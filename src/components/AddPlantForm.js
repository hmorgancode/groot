import React from 'react';
import { gql, graphql } from 'react-apollo';

class AddPlantForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: '' };

    this.handleImageSelect = this.handleImageSelect.bind(this);
  }

  handleImageSelect(e) {
    console.log(e.target.files);
    // files[0] is the one you want
    this.setState({ image: e.target.value });
  }

  render() {
    return (
      <div className="add-plant-form">
      <div className="form-body">
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
          <input id="add-plant-image" className="file-input" type="file"
                 value={this.state.image} onChange={this.handleImageSelect}/>
        </div>


        <div className="control">
          <label className="label">Tags</label>
          <input type="text" className="input"/>
        </div>


        <div className="control">
          <label className="label">Notes</label>
          <input type="textarea" className="textarea"/>
        </div>


        <div className="control">
          <label className="label">Board</label>
          <input type="text" className="input"/>
        </div>


        <div className="control">
          <label className="label">Sensors</label>
          <input type="text" className="input"/>
        </div>
      </div>
      <div className="form-footer">
        <div className="control is-grouped is-grouped-right">
          <p className="control">
            <button className="button is-primary" onClick={() => console.log('BUTTON!')}>Submit</button>
          </p>
          <p className="control">
            <button className="button" onClick={this.props.handleCloseModal}>Cancel</button>
          </p>
        </div>
      </div>
      </div>
    );
  }
}

const addPlantMutation = gql`
  mutation createPlant(
    $name: String!,
    $thumbnail: String!,
    $board: String!
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


export default graphql(addPlantMutation)(AddPlantForm);
