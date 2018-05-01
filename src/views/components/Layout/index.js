import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Responsive, WidthProvider } from 'react-grid-layout';
import * as plugins from '../../../plugins';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const WidgetsArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  align-items: center;
  align-content: center;
  flex-grow: 3;
  opacity: ${({ hidden }) => (hidden ? 0 : 1)};
`;

const ROW_HEIGHT = 5;

const layoutOpts = {
  rowHeight: ROW_HEIGHT,
  resizable: true,
  preventCollision: true,
  style: { height: '100vh', width: '100%' },
  compactType: 'none',
};

const BasicLayout = props => (
  <WidgetsArea hidden={props.hidden}>
    <ResponsiveReactGridLayout
      onLayoutChange={props.onLayoutChange}
      layouts={props.layout}
      {...layoutOpts}
    >
      {props.widgets.map((el, i) => {
        const { plugin, name, state } = el;
        const Component = plugins[plugin].widgets[name];
        return (
          <div key={plugin + name} id={`plugin_${i}`}>
            <Component {...state} />
          </div>
        );
      })}
    </ResponsiveReactGridLayout>
  </WidgetsArea>
);

// function calculateWH(widthPx, heightPx, colWidth, rowHeight, margin) {
//   const w = Math.ceil((widthPx - margin[0]) / (colWidth + margin[0]));
//   const h = Math.ceil((heightPx - margin[1]) / (rowHeight + margin[1]));
//   return [w, h];
// }

BasicLayout.propTypes = {
  widgets: PropTypes.arrayOf(PropTypes.shape({})),
  hidden: PropTypes.bool.isRequired,
  onLayoutChange: PropTypes.func.isRequired,
  layout: PropTypes.arrayOf(PropTypes.shape({})),
};

export default BasicLayout;
