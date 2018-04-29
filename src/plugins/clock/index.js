import Widget from './widget';

export const clock = {
  label: 'clock',
  widgets: {
    main: Widget,
  },
  cmds: [
    {
      label: 'open widget',
      handler: (args, { setWidgetState }) => [
        {
          id: 'w_0',
          onEnter: () =>
            setWidgetState({
              plugin: 'clock',
              name: 'main',
              state: {},
            }),
          text: 'clock widget open',
          help: 'Show clock widget',
        },
      ],
    },
  ],
};
