import React, { Component } from 'react';
import { compose, withState, withProps } from 'recompose';
import Layout from './Layout';
import * as plugins from './plugins';
import { path, flatten } from 'ramda';
import FlatList from './components/List';

const cfg = {
  regex: cmd => value => cmd.regex.test(value),
  beTrue: cmd => value => true,
};

class App extends Component {
  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ height: '100px' }}>
          <input value={this.props.cmd} onChange={this.props.setCmd} />
          <FlatList
            scroll
            height="10rem"
            selectable={true}
            data={this.props.suggestions}
            renderItem={({ index, item, isSelected }) => {
              return `${isSelected ? 'selected' : ''} ${item.text}`
            }}
            onItemClick={({ onEnter }) => onEnter()}
          />
        </div>
        <Layout />
      </div>
    );
  }
}

const enhance = compose(
  withState('cmd', 'setCmd', ''),
  withState('suggestions', 'setSuggestions', []),
  withProps(({ setCmd, setSuggestions }) => ({
    setCmd: ({ target: { value } }) => {
      setCmd(value);

      const suggestions = Object.values(plugins).reduce((acc, plugin) => {
        const v = acc.concat( 
          plugin.cmds.map(cmd => {
            const checker = cfg[cmd.condition];

            if (checker(cmd)(value))
              try {
                return cmd.handler(value);
              } catch (e) {
                // do nothing
              }
            else return null;
          })
          .filter(ele => !!ele))

        return v;
      }, []);

      setSuggestions(flatten(suggestions));
    },
  })),
);

export default enhance(App);
