import React from 'react';

const API = 'https://api.coinmarketcap.com/v1/ticker/';

class Widget extends React.Component {
  state = {
    loading: false,
    data: null,
  };

  componentWillMount() {
    fetch(API)
      .then(res => res.json())
      .then(results =>
        results.map(ele => ({
          id: ele.id,
          symbol: ele.symbol,
          price: ele.price_usd,
        })),
      )
      .then(data => this.setState({ data }));
  }

  render() {
    const { data } = this.state;
    const { whitelist } = this.props;

    if (data == null) return null;

    return (
      <div className='crypto_wrapper'>
      {
      whitelist
        .map(symbol => data.find(ele => ele.symbol === symbol))
        .filter(ele => !!ele)
        .map(({ id, price, symbol }) => (
          <div key={id} style={{ display: 'flex', justify: 'space-around' }}>
            <p>{symbol}</p>
            <p>{price} $</p>
          </div>
        ))
      }
      </div>
    );
  }
}

export const crypto = {
  label: 'crypto',
  widgets: {
    main: Widget,
  },
  cmds: [
    {
      condition: 'startsWith',
      handler: (args, { addWidget }) => [
        {
          id: 'crypto_0',
          onEnter: () =>
            addWidget({
              plugin: 'crypto',
              name: 'main',
              state: { whitelist: ['ETH', 'BTC', 'LTC'] },
            }),
          text: 'crypto widget open',
          help: 'Open Crypto widget',
        },
      ],
    },
    {
      condition: 'startsWith',
      handler: (args, { mutateWidgetState }) => [
        {
          id: 'crypto_1',
          onEnter: () => {
            mutateWidgetState(widgets => {
              const element = widgets.find(
                ele => ele.plugin === 'crypto' && ele.name === 'main',
              );

              return {
                plugin: 'crypto',
                name: 'main',
                state: {
                  whitelist: [...element.state.whitelist, args.split(' ')[3]],
                },
              };
            });
          },
          text: 'crypto add coin <coin>',
          help: 'Add coin to Crypto widget',
        },
      ],
    },
    {
      condition: 'startsWith',
      handler: (args, { mutateWidgetState }) => [
        {
          id: 'crypto_2',
          onEnter: () => {
            mutateWidgetState(widgets => {
              const element = widgets.find(
                ele => ele.plugin === 'crypto' && ele.name === 'main',
              );

              const whitelist = element.state.whitelist.filter(ele => ele !== args.split(' ')[3])
              return {
                plugin: 'crypto',
                name: 'main',
                state: {
                  whitelist,
                },
              };
            });
          },
          text: 'crypto rm coin <coin>',
          help: 'Remove coin from Crypto widget',
        },
      ],
    },

  ],
};
