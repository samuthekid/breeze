import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Layout from 'views/components/Layout';
import FlatList from 'views/components/List';
import Background from 'views/components/Background';
import Helper from 'views/components/Helper';
import Logo from 'views/components/Logo';
import SearchBox from 'views/components/SearchBox';
import enhance from './enhance';

class App extends Component {
  static propTypes = {
    loadInitialState: PropTypes.func.isRequired,
    setCmd: PropTypes.func.isRequired,
    cmd: PropTypes.string.isRequired,
    refreshSuggestions: PropTypes.func.isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.shape({})),
    widgets: PropTypes.arrayOf(PropTypes.shape({})),
    setSuggestions: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.setFocus();
    this.props.loadInitialState();
  }

  setFocus = () => this.cmdInput.focus();

  render() {
    return (
      <Background onClick={this.setFocus}>
        <Logo />
        <SearchBox
          value={this.props.cmd}
          onChange={this.props.refreshSuggestions}
          innerRef={input => {
            this.cmdInput = input;
          }}
        />
        <FlatList
          onShiftItemClick={() =>
            window.location.replace(
              `https://www.google.pt/search?q=${escape(this.props.cmd)}`,
            )
          }
          header={item => <Helper text={item.help} />}
          selectable
          data={this.props.suggestions}
          renderItem={({ index, item, isSelected }) => (
            <p id={item.id} className={isSelected ? 'selected' : undefined}>
              {item.text}
            </p>
          )}
          onItemClick={({ onEnter }) => {
            this.props.setCmd('');
            this.props.setSuggestions([]);
            this.setFocus();
            onEnter != null && onEnter();
          }}
        />

        <Layout
          widgets={this.props.widgets}
          hidden={!!this.props.suggestions.length}
        />
      </Background>
    );
  }
}

export default enhance(App);
