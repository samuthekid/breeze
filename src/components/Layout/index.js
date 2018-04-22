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
      console.log({ i })

      return (
        <div key={i}>
          <span>
            <Component key={name} {...state} />;
          </span>
        </div>
      );
    });
  }

  render() {
    var layout = [
      { i: 'a', x: 0, y: 0, w: 1, h: 1 },
      { i: 'b', x: 0, y: 1, w: 1, h: 1 },
      { i: 'c', x: 0, y: 2, w: 1, h: 1 },
      { i: 'd', x: 0, y: 3, w: 1, h: 1 },
    ];
    return (
      <ReactGridLayout {...this.state}>{this.generateDOM()}</ReactGridLayout>
    );
  }
}

export default BasicLayout;
