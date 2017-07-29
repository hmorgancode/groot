import React from 'react';

function makeList(ListItem) {
  return class extends React.Component {
    render() {
      return (
        <div>
          { this.props.items.map((item) => <ListItem key={item._id} {...item} />) }
        </div>
      );
    }
  }
}

export default makeList;
