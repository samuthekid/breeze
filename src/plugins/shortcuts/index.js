let storage = {
  shortcuts: [
    {
      match: "youtube",
      url: "https://youtube.com/",
    },
    {
      match: "youtubeeee",
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

function onTextChange(args) {
  const x = storage.shortcuts.map((short) => {
    if (short.match === args)
      return short.url;
    else if (short.match.includes(args))
      return short.match;
    else
      return null;
  });
  console.log(x)
  return x;
}

export const shortcuts = {
  label: 'shortcuts',
  cmds: [
    {
      condition: 'beTrue',
      label: 'shortcuts',
      handler: args => [{
        id: 0,
        onEnter: () => window.location.replace(storage),
        text: onTextChange(args),
      }],
    },
  ],
};
