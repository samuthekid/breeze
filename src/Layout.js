import React from 'react';
import _ from 'lodash';
import RGL, { WidthProvider } from 'react-grid-layout';
const ReactGridLayout = WidthProvider(RGL);

class BasicLayout extends React.PureComponent {
  static defaultProps = {
    items: 10,
    rowHeight: 200,
    rowWidth: 50,
    cols: 5,
    style: { backgroundColor: 'red', height: 1000 },
  };

  generateDOM() {
    return _.map(_.range(this.props.items), i => {
      return (
        <div key={i}>
          <span>{i}</span>
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
      { i: 'e', x: 0, y: 4, w: 1, h: 1 },
      { i: 'f', x: 1, y: 0, w: 1, h: 1 },
      { i: 'g', x: 1, y: 1, w: 1, h: 1 },
      { i: 'h', x: 1, y: 2, w: 1, h: 1 },
      { i: 'i', x: 1, y: 3, w: 1, h: 1 },
      { i: 'k', x: 1, y: 4, w: 1, h: 1 },
    ];
    return (
      <ReactGridLayout layout={layout} {...this.props}>
        {this.generateDOM()}
      </ReactGridLayout>
    );
  }
}

export default BasicLayout;
