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
import Helper from './components/Helper';
import Clock from './components/Clock';

const cfg = {
  regex: cmd => value => cmd.regex.test(value),
  beTrue: cmd => value => true,
  startsWith: cmd => (value, plugin) => value.startsWith(plugin.label),
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
        <div className='logo'></div>
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
          header={(item) => (<Helper text={item.help} />)}
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

        <Layout widgets={this.props.widgets} />
        <div className="help_wrapper flex_vam_sb">
          <div className="help_icon"></div>
          <div>
            download this wallpaper
          </div>
        </div>
      </Background>
    );
  }
}

const enhance = compose(
  withState('cmd', 'setCmd', ''),
  withState('suggestions', 'setSuggestions', []),
  withState('widgets', 'setWidgets', []),
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
  withProps(({ setCmd, setSuggestions, addWidget, mutateWidgetState }) => ({
    setCmd: ({ target: { value } }) => {
      setCmd(value);

      const suggestions = value.length
        ? Object.values(plugins).reduce((acc, plugin) => {
            const v = acc.concat(
              plugin.cmds
                .map(cmd => {
                  const checker = cfg[cmd.condition];

                  if (checker(cmd)(value, plugin))
                    try {
                      return cmd.handler(value, {
                        addWidget,
                        mutateWidgetState,
                      });
                    } catch (e) {
                      console.warn(e);
                      // do nothing
                    }
                  else return null;
                })
                .filter(ele => !!ele),
            );
            return v;
          }, [])
        : [];

      const flattenSuggestions = !suggestions.length
        ? []
        : flatten(suggestions).sort(
            (a, b) => (a.text.indexOf(value) > b.text.indexOf(value) ? -1 : 1),
          );
      setSuggestions(flattenSuggestions);
    },
  })),
);

export default enhance(App);
