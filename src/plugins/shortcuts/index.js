let storage = {
  shortcuts: [
    {
      match: 'youtube',
      url: 'https://youtube.com/',
    },
    {
      match: 'reddit',
      url: 'https://reddit.com/',
    },
    {
      match: 'gmail',
      url: 'https://gmail.com/',
    },
  ],
};

function getSuggestions(args) {
  return storage.shortcuts
    .map((shortcut, index) => {
      if (shortcut.match.includes(args)) {
        return {
          id: 'short_' + index,
          onEnter: () => window.location.replace(shortcut.url),
          text: shortcut.match,
          help: 'Open ' + shortcut.url,
        };
      }
    else return null;
    }).filter(suggestion => suggestion != null);
}

export const shortcuts = {
  label: 'shortcuts',
  cmds: [
    {
      condition: 'beTrue',
      label: 'shortcuts',
      handler: getSuggestions,
    },
  ],
};
