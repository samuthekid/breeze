import React from 'react';

function getSuggestions(args, _, props) {
  return props.shortcuts
    .filter((plug) => plug.plugin === 'shortcuts')
    .map((shortcut, index) => {
      const short = shortcut.state;

      if (short.match.includes(args)) {
        return {
          id: 'short_' + index,
          text: short.match,
          help: 'Open ' + short.url,
          onEnter: () => window.location.replace(short.url),
        }
      }

      return null;
  }).filter((suggestion) => suggestion != null);
}

function getName(args) {
  return args.split(' ')[2];
}

function getUrl(args) {
  let url = args.split(' ')[3];

  if (!url.includes('http://')) {
    return 'http://' + url;
  }

  return url;
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
        id: 'short_add',
        text: 'shortcuts add <name> <url>',
        help: 'Add shortcut <name> <url>',
        onEnter: () =>
          addShortcut(shortcuts => {
            console.log('ADD SHORTCUT');
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
    {
      condition: 'startsWith',
      label: 'remove',
      handler: (args, { removeShortcut, mutateWidgetState}, _) => ({
        id: 'short_rm',
        text: 'shortcuts remove <name>',
        help: 'Remove shortcut <name>',
        onEnter: () =>
          removeShortcut(shortcuts => {
            console.log('REMOVE SHORTCUT');
            return (shortcuts.filter((short) =>
              short.state.match != args.split(' ')[2]
            ));
          })
      }),
    }
  ],
};
