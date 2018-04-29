function getSuggestions(args, _, state = initialState) {
  return (state.list || [])
    .map(({ match, url }, index) => {
      if (match.includes(args)) {
        return {
          id: `short_${index}`,
          text: match,
          help: `Open ${url}`,
          onEnter: () => window.location.replace(url),
        };
      }
      return null;
    })
    .filter(ele => !!ele);
}

function getName(args) {
  return args.split(' ')[2];
}

function getUrl(args) {
  const url = args.split(' ')[3];

  if (!url.includes('http://')) {
    return `http://${url}`;
  }

  return url;
}

const initialState = {
  list: [
    { match: 'fb', url: 'https://facebook.com' },
    { match: 'gmail', url: 'https://gmail.com' },
  ],
};

export const shortcuts = {
  label: 'shortcuts',
  cmds: [
    {
      handler: getSuggestions,
    },
    {
      label: 'add',
      handler: (args, { setPluginState }) => ({
        id: 'short_add',
        text: 'shortcuts add <name> <url>',
        help: 'Add shortcut <name> <url>',
        onEnter: () =>
          setPluginState((state = initialState) => ({
            ...state,
            list: [
              ...state.list,
              {
                match: getName(args),
                url: getUrl(args),
              },
            ],
          })),
      }),
    },
    {
      label: 'remove',
      handler: (args, { setPluginState }) => ({
        id: 'short_rm',
        text: 'shortcuts remove <name>',
        help: 'Remove shortcut <name>',
        onEnter: () =>
          setPluginState((state = initialState) => ({
            ...state,
            list: state.list.filter(
              short => short.match !== args.split(' ')[2],
            ),
          })),
      }),
    },
  ],
};
