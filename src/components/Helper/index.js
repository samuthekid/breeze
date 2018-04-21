import React, { Component } from 'react';

class Helper extends Component {
  render() {
    return (
      <div className="open_options">
        <span>{this.props.text || 'Open options'}</span>
      </div>
    );
  }
}

export default Helper;
