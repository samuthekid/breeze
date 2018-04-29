# Breeze

Breeze is your personal dashboard extension for the browser. It works as a CLI but you can use widgets as well, written in React JS.

## Plugins
A plugin consists in a serie of commands and widgets, you can build this plugins using Breeze Plugin API.

### Building a plugin
A plugin has the follow sintax:
```
export const calculator = {
  label: 'calculator',
  cmds: [
    {
      condition: 'regex',
      label: 'calculator',
      regex: /^[\+\-\/\*\%\d\.\(\)]+$/,
      handler: args => [
        {
          id: 0,
          text: '= ' + eval(args),
          help: 'inline calculator',
        },
      ],
    },
  ],
};
```
* label - plugin label
* cmds - array of commands, see Commands section for more details

#### API
* addWidget
* removeWidget
* mutateWidgetState
* setBackground (FUTURE)
* downloadBackground (FUTURE)

## Commands
### args
### flags
### suggestions

## API
