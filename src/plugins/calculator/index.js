function getSuggestions(args) {
  return [
    {
      id: 0,
      text: '= ' + eval(args),
      help: 'inline calculator <3',
    }
  ];
}

export const calculator = {
  label: 'calculator',
  cmds: [
    {
      condition: 'regex',
      label: 'calculator',
      regex: /^[\+\-\/\*\%\d\.\(\)]+$/,
      handler: getSuggestions,
    },
  ],
};
