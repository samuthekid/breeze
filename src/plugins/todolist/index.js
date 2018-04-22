import React from 'react';

let storage = {
  list: [
    { id: 1, text: "tarefa 1 xD", done: false},
    { id: 2, text: "cena 2", done: false},
    { id: 3, text: "coisa 3", done: false},
  ]
};

function addListItem(value) {
  storage.list = [ ...storage.list,
    { id: storage.list.length + 1, text: value.substring(value.indexOf(' '), value.length), done: false }
  ];
};

function toggleItem(value) {
  const id = parseInt(value.split(' ')[1]);
  storage.list = storage.list.map(item => {
    if (item.id === id) {
      const x =  { ...item, done: !item.done };
      return x;
    } else return item
  });
};

function removeItem(value) {
  const id = parseInt(value.split(' ')[1]);
  storage.list = storage.list.filter(item => {
    return item.id != id;
  }).map((item, i) => ({ ...item, id: i + 1 }));
};

function removeDone(value) {
  const id = parseInt(value.split(' ')[1]);
  storage.list = storage.list.filter(item => {
    return !item.done;
  }).map((item, i) => ({ ...item, id: i + 1 }));
};

const Widget = ({ list }) => {
  return <div style={{ height: '100px' }}>
    {list.map(todo => (
      <p key={todo.id}>{todo.id} - {todo.text} {todo.done ? 'X' : '_' }</p>
    ))}
  </div>;
};

export const todolist = {
  label: 'todo',
  widgets: {
    main: Widget,
  },
  cmds: [
    {
      condition: 'startsWith',
      handler: (args, { addWidget }) => [
        {
          id: 'tdl_0',
          onEnter: () =>
            addWidget({
              plugin: 'todolist',
              name: 'main',
              state: storage,
            }),
          text: 'todo widget open',
          help: 'Show ToDo List widget',
        },
      ],
    },
    {
      condition: 'startsWith',
      handler: (args, { mutateWidgetState }) => [
        {
          id: 'tdl_1',
          onEnter: () => {
            addListItem(args);
            mutateWidgetState({
              plugin: 'todolist',
              name: 'main',
              state: storage,
            })
          },
          text: 'todo add <item text>',
          help: 'Add todo item',
        },
      ],
    },
    {
      condition: 'startsWith',
      handler: (args, { mutateWidgetState }) => [
        {
          id: 'tdl_2',
          onEnter: () => {
            toggleItem(args);
            mutateWidgetState({
              plugin: 'todolist',
              name: 'main',
              state: storage,
            })
          },
          text: 'todo x <id>',
          help: 'Check/Uncheck todo item [id]',
        },
      ],
    },
    {
      condition: 'startsWith',
      handler: (args, { mutateWidgetState }) => [
        {
          id: 'tdl_3',
          onEnter: () => {
            removeItem(args);
            mutateWidgetState({
              plugin: 'todolist',
              name: 'main',
              state: storage,
            })
          },
          text: 'todo remove <id>',
          help: 'Remove item with id',
        },
      ],
    },
    {
      condition: 'startsWith',
      handler: (args, { mutateWidgetState }) => [
        {
          id: 'tdl_4',
          onEnter: () => {
            removeDone(args);
            mutateWidgetState({
              plugin: 'todolist',
              name: 'main',
              state: storage,
            })
          },
          text: 'Remove all checked items',
        },
      ],
    },
  ],
};
