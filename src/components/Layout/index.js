import React from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import * as plugins from '../../plugins';

class BasicLayout extends React.PureComponent {
  
  generateDOM() {
    return this.props.widgets.map(({ plugin, name, state }, i) => {
      const Component = plugins[plugin].widgets[name];
      return (
        <div className={'widget'} key={i}>
          <span>
            <Component key={name} {...state} />
          </span>
        </div>
      );
    });
  }

  render() {
    return (
      <div className={'widgets_area'} {...this.state}>{this.generateDOM()}</div>
    );
  }
}

export default BasicLayout;
