export const calculator = {
  label: 'calculator',
  cmds: [
    {
      condition: 'regex',
      label: 'main',
      regex: /^[\+\-\/\*\%\d\.\(\)]+$/g,
      handler: args => [{
        id: 0,
        onEnter: console.log,
        text: eval(args),
      }],
    },
  ],
};
