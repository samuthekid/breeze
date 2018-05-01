import React from 'react';
import PropTypes from 'prop-types';

const Widget = ({ list }) => (
  <div style={{ height: '100%' }}>
    {list.map(todo => (
      <p key={todo.id}>
        {todo.id} - {todo.text} {todo.done ? 'X' : '_'}
      </p>
    ))}
  </div>
);

Widget.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Widget;
