import React from 'react';
import { GenericWeather } from 'react-weather';

const Widget = ({ city }) => {
  return <div style={{ height: '100px' }}>{city}</div>;
};

export const weather = {
  label: 'weather',
  widgets: {
    main: Widget,
  },
  cmds: [
    {
      condition: 'startsWith',
      label: 'open widget',
      handler: (args, { addWidget, mutateWidgetState }) => [
        {
          id: 'w_0',
          onEnter: () =>
            addWidget({
              plugin: 'weather',
              name: 'main',
              state: { city: 'Coimbra2' },
            }),
          text: 'Add weather widget',
        },
        {
          id: 'w_1',
          onEnter: () =>
            mutateWidgetState({
              plugin: 'weather',
              name: 'main',
              state: { city: args },
            }),
          text: 'Change city',
        },
      ],
    },
  ],
};
