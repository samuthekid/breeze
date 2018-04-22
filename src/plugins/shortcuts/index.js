import React from 'react';

function getSuggestions(args, _, props) {
  return props.shortcuts
    .filter((plug) => plug.plugin === 'shortcuts')
    .map((shortcut, index) => {
      const short = shortcut.state;

      if (short.match.includes(args)) {
        return {
          id: index,
          onEnter: () => window.location.replace(short.url),
          text: short.match,
          help: `Go to ${short.url}`,
        }
      }

      return null;
  }).filter((suggestion) => suggestion != null);
}

function getName(args) {
  return args.split(' ')[2];
}

function getUrl(args) {
  return args.split(' ')[3];
}

export const shortcuts = {
  label: 'shortcuts',
  cmds: [
    {
      condition: 'beTrue',
      handler: getSuggestions,
    },
    {
      condition: 'startsWith',
      label: 'add',
      handler: (args, { addShortcut, mutateWidgetState }, _) => ({
        id: 0,
        text: 'shortcuts add <name> <url>',
        help: 'Add shortcut <name> <url>',
        onEnter: () =>
          addShortcut(shortcuts => {
            console.log('SHORTCUT ADDED');
            return {
              plugin: 'shortcuts',
              state: {
                match: getName(args),
                url: getUrl(args),
              }
            }
          })
        }),
    },
    //{
    //  condition: 'startsWith',
    //  label: 'remove',
    //  handler: deleteShortcut,
    //}
  ],
};
