export const loadInitialState = ({ setWidgets, setPlugins }) => {
  if (window.chrome.storage) {
    window.chrome.storage.sync.get('state', data => {
      if (window.chrome.runtime.lastError) {
        console.log(window.runtime.lastError);
        return;
      }
      setWidgets(data.state.widgets || []);
      setPlugins(data.state.plugins || []);
    });
  } else {
    setWidgets(JSON.parse(localStorage.getItem('state')).widgets || []);
    setPlugins(JSON.parse(localStorage.getItem('state')).plugins || []);
  }
};

export const saveState = state => {
  if (window.chrome.storage) {
    window.chrome.storage.sync.set({ state });
  } else {
    window.localStorage.setItem('state', JSON.stringify(state));
  }
};
