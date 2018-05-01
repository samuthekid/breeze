import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CryptoWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const API = 'https://api.coinmarketcap.com/v1/ticker/';

class Widget extends React.Component {
  static propTypes = {
    whitelist: PropTypes.arrayOf(PropTypes.string),
  };

  state = {
    data: null,
  };

  componentWillMount() {
    fetch(API)
      .then(res => res.json())
      .then(results =>
        results.map(ele => ({
          change1h: ele.percent_change_1h,
          change24h: ele.percent_change_24h,
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
      <CryptoWrapper>
        {whitelist
          .map(symbol => data.find(ele => ele.symbol === symbol))
          .filter(ele => !!ele)
          .map(({ id, price, symbol, change24h }, i) => (
            <div
              key={id}
              style={{
                marginTop: i === 0 ? '0px' : '16px',
                width: '250px',
                display: 'flex',
                justifyContent: 'space-between',
                align: 'center',
              }}
            >
              <div>
                <p>{symbol}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div>
                  <p
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      padding: '0px',
                      margin: '0px',
                    }}
                  >
                    {price} $
                  </p>
                  <p
                    style={{
                      textAlign: 'center',
                      margin: '0px',
                      padding: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {change24h}% 24h
                  </p>
                </div>
              </div>
            </div>
          ))}
      </CryptoWrapper>
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
      handler: (args, { setWidgetState }) => [
        {
          id: 'crypto_0',
          onEnter: () =>
            setWidgetState({
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
      handler: (args, { setWidgetState }) => [
        {
          id: 'crypto_1',
          onEnter: () => {
            setWidgetState(widgets => {
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
      handler: (args, { setWidgetState }) => [
        {
          id: 'crypto_2',
          onEnter: () => {
            setWidgetState(widgets => {
              const element = widgets.find(
                ele => ele.plugin === 'crypto' && ele.name === 'main',
              );

              const whitelist = element.state.whitelist.filter(
                ele => ele !== args.split(' ')[3],
              );
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
