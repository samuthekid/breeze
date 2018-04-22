function getSuggestions(args) {
  return args && args !== '' && [
    {
      id: 'search',
      text: "Search this", 
      help: "See Google results", 
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
