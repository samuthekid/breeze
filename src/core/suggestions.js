import Fuse from 'fuse.js';
import { flatten } from 'ramda';

const cfg = {
  regex: cmd => value => cmd.regex.test(value),
};

export const getSuggestions = ({
  value,
  plugins,
  pluginsState,
  mutateWidget,
  mutatePlugin,
}) => {
  if (!value.length) return [];

  const suggestions = Object.values(plugins).reduce((acc, plugin) => {
    const v = acc.concat(
      plugin.cmds
        .map(cmd => {
          const able =
            cmd.condition != null ? cfg[cmd.condition](cmd)(value) : true;

          if (able)
            try {
              return cmd.handler(
                value,
                {
                  setWidgetState: mutateWidget(plugin),
                  setPluginState: mutatePlugin(plugin),
                },
                pluginsState[plugin.label],
              );
            } catch (e) {
              console.log(e);
            }
          return null;
        })
        .filter(ele => !!ele),
    );
    return v;
  }, []);

  return sortSuggestions(flatten(suggestions), value);
};

const options = {
  caseSensitive: false,
  shouldSort: true,
  threshold: 1,
  distance: 200,
  findAllMatches: true,
  maxPatternLength: 100,
  minMatchCharLength: 1,
  keys: ['text'],
};

export const sortSuggestions = (suggestions, value) => {
  const fuse = new Fuse(suggestions, options);
  return fuse.search(value).slice(0, 3);
};
