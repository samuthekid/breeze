import React, { Component } from 'react';
import { compose, withState, withProps } from 'recompose';
import { path, flatten } from 'ramda';

// CSS
import 'index.css';

// Plugins
import * as plugins from './plugins';

// Components
import Layout from './components/Layout';
import FlatList from './components/List';
import Background from './components/Background';


const cfg = {
  regex: cmd => value => cmd.regex.test(value),
  beTrue: cmd => value => true,
};

class App extends Component {

  setFocus = () => {
    this.nameInput.focus();
  }

  componentDidMount() {
    this.setFocus();
  }

  render() {
    return (
      <Background onClick={this.setFocus}>
        <input
          className={'search_box'}
          value={this.props.cmd}
          onChange={this.props.setCmd}
          ref={(input) => { this.nameInput = input; }}
        />
        <FlatList
          scroll
          height="10rem"
          selectable={true}
          data={this.props.suggestions}
          renderItem={({ index, item, isSelected }) => (
              <p className={isSelected ? 'selected' : undefined}>{item.text}</p>
            )}
          onItemClick={({ onEnter }) => onEnter()}
        />
        {/* <Layout /> */}
      </Background>
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
