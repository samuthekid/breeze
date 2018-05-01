import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const WeatherWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 20px;
`;

const Title = styled.h2`
  font-family: RobotoThin;
  text-transform: uppercase;
  font-size: 16px;
`;

const BigTitle = styled.h3`
  font-family: RobotoThin;
  text-transform: uppercase;
  font-size: 60px;
  margin: 0;
`;

const API = city =>
  `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${city}")&format=json`;

class Widget extends React.Component {
  static propTypes = {
    city: PropTypes.string.isRequired,
  };

  state = {
    data: null,
  };

  componentWillMount() {
    fetch(API(this.props.city))
      .then(res => res.json())
      .then(({ query: { results } }) => results)
      .then(({ channel: { item } }) => item)
      .then(data => this.setState({ data }));
  }

  componentWillReceiveProps(nextProps) {
    fetch(API(nextProps.city))
      .then(res => res.json())
      .then(({ query: { results } }) => results)
      .then(({ channel: { item } }) => item)
      .then(data => this.setState({ data }));
  }

  render() {
    const { data } = this.state;

    if (data == null) return null;

    return (
      <WeatherWrapper style={{ height: '100%' }}>
        <Title>{data.condition.date.substring(0, 3)}</Title>
        <BigTitle>{data.condition.temp}</BigTitle>
        <Title>{data.condition.text}</Title>
        <p style={{ display: 'flex', flexDirection: 'row' }}>
          {data.forecast.slice(1, 5).map(day => (
            <div style={{ margin: '8px' }}>
              <p key={`tmp${day.date}`}>{day.high}</p>
              <p key={`day${day.date}`}>{day.day}</p>
            </div>
          ))}
        </p>
      </WeatherWrapper>
    );
  }
}

export const weather = {
  label: 'weather',
  widgets: {
    main: Widget,
  },
  cmds: [
    {
      label: 'open widget',
      handler: (args, { setWidgetState }) => [
        {
          id: 'w_0',
          onEnter: () =>
            setWidgetState({
              plugin: 'weather',
              name: 'main',
              state: { city: 'Coimbra' },
            }),
          text: 'weather widget open',
          help: 'Show weather widget',
        },
      ],
    },
    {
      label: 'change city',
      handler: (args, { setWidgetState }) => [
        {
          id: 'w_1',
          onEnter: () =>
            setWidgetState({
              plugin: 'weather',
              name: 'main',
              state: { city: args.split(' ')[2] },
            }),
          text: 'weather city <city>',
          help: 'Set weather city',
        },
      ],
    },
  ],
};
