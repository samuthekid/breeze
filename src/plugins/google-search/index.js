function getSuggestions(args) {
  return args && args !== '' && [
    {
      id: 0,
      text: "Search " + args,
      onEnter: () => window.location.replace(
        'https://www.google.pt/search?q=' + escape(args),
      )
    }
  ];
}

export const googleSearch = {
  label: 'googleSearch',
  cmds: [
    {
      condition: 'beTrue',
      label: 'main',
      handler: getSuggestions,
    },
  ],
};
