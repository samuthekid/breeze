import React from 'react';

const storage = {
  list: [
    { id: 1, text: 'tarefa 1 xD', done: false },
    { id: 2, text: 'cena 2', done: false },
    { id: 3, text: 'coisa 3', done: false },
  ],
};

function addListItem(value) {
  storage.list = [
    ...storage.list,
    {
      id: storage.list.length + 1,
      text: value.substring(value.indexOf(' '), value.length),
      done: false,
    },
  ];
}

function toggleItem(value) {
  const id = parseInt(value.split(' ')[1], 10);
  storage.list = storage.list.map(item => {
    if (item.id === id) {
      const x = { ...item, done: !item.done };
      return x;
    }
    return item;
  });
}

function removeItem(value) {
  const id = parseInt(value.split(' ')[1], 10);
  storage.list = storage.list
    .filter(item => item.id !== id)
    .map((item, i) => ({ ...item, id: i + 1 }));
}

function removeDone(value) {
  storage.list = storage.list
    .filter(item => !item.done)
    .map((item, i) => ({ ...item, id: i + 1 }));
}

const Widget = ({ list }) => (
  <div style={{ height: '100%' }}>
    {list.map(todo => (
      <p key={todo.id}>
        {todo.id} - {todo.text} {todo.done ? 'X' : '_'}
      </p>
    ))}
  </div>
);

export const todolist = {
  label: 'todo',
  widgets: {
    main: Widget,
  },
  cmds: [
    {
      handler: (args, { setWidgetState }) => [
        {
          id: 'tdl_0',
          onEnter: () =>
            setWidgetState({
              plugin: 'todolist',
              name: 'main',
              state: storage,
            }),
          text: 'todo widget open',
          help: 'Show todo list widget',
        },
      ],
    },
    {
      handler: (args, { setWidgetState }) => [
        {
          id: 'tdl_1',
          onEnter: () => {
            addListItem(args);
            setWidgetState({
              plugin: 'todolist',
              name: 'main',
              state: storage,
            });
          },
          text: 'todo add <item text>',
          help: 'Add todo item',
        },
      ],
    },
    {
      handler: (args, { setWidgetState }) => [
        {
          id: 'tdl_2',
          onEnter: () => {
            toggleItem(args);
            setWidgetState({
              plugin: 'todolist',
              name: 'main',
              state: storage,
            });
          },
          text: 'todo x <id>',
          help: 'Check/Uncheck todo item [id]',
        },
      ],
    },
    {
      handler: (args, { setWidgetState }) => [
        {
          id: 'tdl_3',
          onEnter: () => {
            removeItem(args);
            setWidgetState({
              plugin: 'todolist',
              name: 'main',
              state: storage,
            });
          },
          text: 'todo rm <id>',
          help: 'Remove item with id',
        },
      ],
    },
    {
      handler: (args, { setWidgetState }) => [
        {
          id: 'tdl_4',
          onEnter: () => {
            removeDone(args);
            setWidgetState({
              plugin: 'todolist',
              name: 'main',
              state: storage,
            });
          },
          text: 'todo rm checked',
          help: 'Remove all checked items',
        },
      ],
    },
  ],
};
