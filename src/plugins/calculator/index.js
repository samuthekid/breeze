function getSuggestions(args) {
  return [
    {
      id: 0,
      text: '=' + eval(args),
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
