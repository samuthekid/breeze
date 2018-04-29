import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as plugins from '../../../plugins';

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

const BasicLayout = ({ widgets, hidden }) => (
  <WidgetsArea hidden={hidden}>
    {widgets.map(({ plugin, name, state }, i) => {
      const Component = plugins[plugin].widgets[name];
      return (
        <div key={i}>
          <span>
            <Component key={name} {...state} />
          </span>
        </div>
      );
    })}
  </WidgetsArea>
);

BasicLayout.propTypes = {
  widgets: PropTypes.arrayOf(PropTypes.shape({})),
  hidden: PropTypes.bool.isRequired,
};

export default BasicLayout;
