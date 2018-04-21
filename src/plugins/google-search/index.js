export const googleSearch = {
  label: 'googleSearch',
  cmds: [
    {
      condition: 'beTrue',
      label: 'main',
      handler: args => [{
        id: 0,
        onEnter: () =>
          window.location.replace(
            'https://www.google.pt/search?q=' + escape(args),
          ),
        text: args.length > 0 ? 'Search ' + args : null,
      }],
    },
  ],
};
