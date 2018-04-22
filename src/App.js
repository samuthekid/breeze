import React, { Component } from 'react';
import { compose, withState, withProps } from 'recompose';
import { path, flatten } from 'ramda';
import Fuse from 'fuse.js';

// CSS
import 'index.css';

// Plugins
import * as plugins from './plugins';

// Components
import Layout from './components/Layout';
import FlatList from './components/List';
import Background from './components/Background';
import Helper from './components/Helper';
import Clock from './components/Clock';

const cfg = {
  regex: cmd => value => cmd.regex.test(value),
  beTrue: cmd => value => true,
  // startsWith: cmd => (value, plugin) => value.startsWith(plugin.label),
  startsWith: cmd => (value, plugin) => true,
};

class App extends Component {
  setFocus = () => {
    this.cmdInput.focus();
  };

  componentDidMount() {
    this.setFocus();
  }

  render() {
    return (
      <Background onClick={this.setFocus}>
        <div className="logo" />
        <Clock />
        <input
          className={'search_box'}
          value={this.props.cmd}
          onChange={this.props.setCmd}
          ref={input => {
            this.cmdInput = input;
          }}
        />
        <FlatList
          header={item => <Helper text={item.help} />}
          height="10rem"
          selectable={true}
          data={this.props.suggestions}
          renderItem={({ index, item, isSelected }) => (
            <p id={item.id} className={isSelected ? 'selected' : undefined}>
              {item.text}
            </p>
          )}
          onItemClick={({ onEnter }) => onEnter != null && onEnter()}
        />

        {!this.props.suggestions.length &&
          <Layout widgets={this.props.widgets} />
        }

        <div className="help_wrapper flex_vam_sb">
          <div className="help_icon" />
          <div>download this wallpaper</div>
        </div>
      </Background>
    );
  }
}

const enhance = compose(
  withState('cmd', 'setCmd', ''),
  withState('suggestions', 'setSuggestions', []),
  withState('widgets', 'setWidgets', []),
  withState('shortcuts', 'setShortcuts', []),
  withProps(props => ({
    addWidget: element => props.setWidgets([...props.widgets, element]),
    mutateWidgetState: mutate => {
      const element =
        typeof mutate === 'object' ? mutate : mutate(props.widgets);

      const w = props.widgets.filter(
        ele => !(ele.name === element.name && ele.plugin === element.plugin),
      );

      w.push(element);

      props.setWidgets(w);
    },
  })),
  withProps(props => ({
    addShortcut: mutate => {
      const wtv = mutate(props.shortcuts);

      props.setShortcuts([...props.shortcuts, wtv])
    },
    removeShortcut: mutate => {
      const wtf = mutate(props.shortcuts);

      props.setShortcuts(wtf);
    },
  })),
  withProps((props) => {
    const { setCmd, setSuggestions, addWidget, mutateWidgetState, addShortcut, removeShortcut } = props;

    return ({
      setCmd: ({ target: { value } }) => {
        setCmd(value);

        const suggestions = value.length
          ? flatten(
              Object.values(plugins).reduce((acc, plugin) => {
                const v = acc.concat(
                  plugin.cmds
                    .map(cmd => {
                      const checker = cfg[cmd.condition];

                      if (checker(cmd)(value, plugin))
                        try {
                          return cmd.handler(value, {
                            addWidget,
                            mutateWidgetState,
                            addShortcut,
                            removeShortcut,
                          }, props);
                        } catch (e) {
                          console.warn(e);
                          // do nothing
                        }
                      else return null;
                    })
                    .filter(ele => !!ele),
                );
                return v;
              }, []),
            )
          : [];

        if (suggestions.length > 2) {
          const last = suggestions.pop();

          const options = {
            caseSensitive: false,
            shouldSort: true,
            threshold: 0.5,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['text'],
          };
          const fuse = new Fuse(suggestions, options);
          const result = fuse.search(value).slice(0, 3);

          result.push(last);

          setSuggestions(result);
        } else {
          const options = {
            caseSensitive: false,
            shouldSort: true,
            threshold: 0.5,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['text'],
          };
          const fuse = new Fuse(suggestions, options);
          const result = fuse.search(value);

          setSuggestions(result);
        }
      },
    });
  }),
);

export default enhance(App);
