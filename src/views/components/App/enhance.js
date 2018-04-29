import { compose, withState, withProps } from 'recompose';
import {
  loadInitialState,
  saveState,
  setPluginState,
  setWidgetState,
  getSuggestions,
} from 'core';
import * as plugins from '../../../plugins';

const enhance = compose(
  withState('cmd', 'setCmd', ''),
  withState('suggestions', 'setSuggestions', []),
  withState('widgets', 'setWidgets', []),
  withState('plugins', 'setPlugins', {}),
  withProps(({ setWidgets, setPlugins, widgets, plugins: pluginsState }) => ({
    loadInitialState: () => loadInitialState({ setWidgets, setPlugins }),
    save: data => saveState({ widgets, plugins: pluginsState, ...data }),
  })),
  withProps(
    ({ setWidgets, setPlugins, widgets, save, plugins: pluginsState }) => ({
      setWidgetState: setWidgetState({ setWidgets, widgets, save }),
      setPluginState: setPluginState({
        save,
        setPlugins,
        plugins: pluginsState,
      }),
    }),
  ),
  withProps(props => ({
    refreshSuggestions: ({ target: { value } }) => {
      props.setCmd(value);

      props.setSuggestions(
        getSuggestions({
          value,
          plugins,
          pluginsState: props.plugins,
          mutateWidget: props.setWidgetState,
          mutatePlugin: props.setPluginState,
        }),
      );
    },
  })),
);

export default enhance;
