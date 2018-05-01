export const setWidgetState = ({
  setWidgets,
  widgets,
  save,
}) => plugin => mutate => {
  const changes =
    typeof mutate === 'object'
      ? mutate
      : mutate(widgets.filter(ele => ele.plugin === plugin.label));

  const w = widgets.filter(ele => ele.plugin !== changes.plugin);
  const data = [...w, changes];

  setWidgets(data);
  save({ widgets: data });
};

export const setPluginState = ({
  setPlugins,
  plugins,
  save,
}) => plugin => mutation => {
  const element =
    typeof mutation === 'object' ? mutation : mutation(plugins[plugin.key]);

  const data = { ...plugins, [plugin.label]: element };
  setPlugins(data);
  save({ plugins: data });
};

export const setLayoutState = ({ setLayout, save, layouts }) => layout => {
  setLayout(layout);
  save({ layout });
};
