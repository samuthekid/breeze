import React, { Component } from 'react';

class Background extends Component {
  render() {
    return (
      <div>
        <div className={'wallpaper'} ></div>
        <div className={'overlay'} ></div>
        <div className={'overlay2'} ></div>
        
        <div className={'black_wallpaper'}></div>
        <div className={'color_preview'}></div>

        <div
          className={'main_content'}
          onClick={this.props.onClick}
        >
            {this.props.children}
        </div>
      </div>
    );
  }
}

export default Background;
