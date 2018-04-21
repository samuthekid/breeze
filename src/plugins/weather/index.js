import React from 'react';

const Widget = ({ city, country }) => {
  return <div>Lolipos</div>;
};

export const weather = {
  label: 'weather',
  widgets: {
    main: Widget,
  },
  cmds: [
    {
      condition: 'beTrue',
      label: 'open widget',
      handler: (args, { addWidget }) => [
        {
          id: 0,
          onEnter: () => addWidget('main'),
          text: 'Open weather widget' 
        },
      ],
    },
  ],
};
