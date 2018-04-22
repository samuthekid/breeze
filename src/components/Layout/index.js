import React from 'react';
import _ from 'lodash';
import RGL, { WidthProvider } from 'react-grid-layout';
import * as plugins from '../../plugins';
const ReactGridLayout = WidthProvider(RGL);

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: props.widgets.length,
      rowHeight: 200,
      cols: 1,
    };
  }

  generateDOM() {
    return this.props.widgets.map(({ plugin, name, state }, i) => {
      const Component = plugins[plugin].widgets[name];

      return (
        <div key={i}>
          <span>
            <Component key={name} {...state} />
          </span>
        </div>
      );
    });
  }

  render() {
    return (
      <ReactGridLayout {...this.state}>{this.generateDOM()}</ReactGridLayout>
    );
  }
}

export default BasicLayout;
