import { compose, withState, withProps } from 'recompose';
import {
  loadInitialState,
  saveState,
  setPluginState,
  setWidgetState,
  setLayoutState,
  getSuggestions,
} from 'core';
import * as plugins from '../../../plugins';

const enhance = compose(
  withState('cmd', 'setCmd', ''),
  withState('suggestions', 'setSuggestions', []),
  withState('widgets', 'setWidgets', []),
  withState('plugins', 'setPlugins', {}),
  withState('layout', 'setLayout', { lg: [], md: [], sm: [], xs: [] }),
  withProps(
    ({
      setWidgets,
      setPlugins,
      widgets,
      plugins: pluginsState,
      setLayout,
      layout,
    }) => ({
      loadInitialState: () =>
        loadInitialState({ setWidgets, setPlugins, setLayout }),
      save: data =>
        saveState({ widgets, plugins: pluginsState, layout, ...data }),
    }),
  ),
  withProps(
    ({
      setLayout,
      setWidgets,
      setPlugins,
      widgets,
      save,
      plugins: pluginsState,
    }) => ({
      setWidgetState: setWidgetState({ setWidgets, widgets, save }),
      setPluginState: setPluginState({
        save,
        setPlugins,
        plugins: pluginsState,
      }),
      setLayoutState: setLayoutState({
        save,
        setLayout,
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
