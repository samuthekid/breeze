export const calculator = {
  label: 'calculator',
  cmds: [
    {
      condition: 'regex',
      label: 'main',
      regex: /^[\+\-\/\*\%\d\.\(\)]+$/,
      handler: args => [{
        id: 0,
        onEnter: () => console.log(args),
        text: '=' + eval(args),
      }],
    },
  ],
};
