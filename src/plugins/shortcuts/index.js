import React from 'react';

let storage = {
  shortcuts: [
    {
      match: "youtube",
      url: "https://youtube.com/",
    },
    {
      match: "reddit",
      url: "https://reddit.com/",
    },
    {
      match: "gmail",
      url: "https://gmail.com/",
    },
  ],
};

function getSuggestions(args) {
  return storage.shortcuts.map((shortcut, index) => {
    if (shortcut.match.includes(args)) {
      return {
        id: index,
        onEnter: () => window.location.replace(shortcut.url),
        text: shortcut.match,
      }
    }

    return null;
  }).filter((suggestion) => suggestion != null);
}

//function saveShortcut(args) {
//  return {
//    id: 0,
//    text: 'Add shortcut',
//    onEnter: () => addShortcut({
//      state: {
//
//      }
//    }),
//  }
//}
//
//function deleteShortcut(args) {
//  return {
//    id: 0,
//    text: 'Remove shortcut',
//    onEnter: () => removeShortcut(args),
//  }
//}

export const shortcuts = {
  label: 'shortcuts',
  cmds: [
    {
      condition: 'beTrue',
      handler: getSuggestions,
    },
    //{
    //  condition: 'startsWith',
    //  label: 'add',
    //  handler: saveShortcut,
    //},
    //{
    //  condition: 'startsWith',
    //  label: 'remove',
    //  handler: deleteShortcut,
    //}
  ],
};
