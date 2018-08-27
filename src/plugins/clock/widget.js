import React, { Component } from 'react';
import styled from 'styled-components';

const ClockTime = styled.span`
  font-family: RobotoThin;
  font-size: 13.5vh;
  line-height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const AmPm = styled.span`
  font-size: 5vh;
  padding-left: 0.5%;
`;

class Clock extends Component {
  state = {
    useAmPm: false,
    time: '',
    ampm: '',
  };

  componentWillMount() {
    this.setClock();
  }

  setClock = () => {
    const time = new Date();
    let h = parseInt(time.getHours(), 10);
    let m = parseInt(time.getMinutes(), 10);

    let amPm = '';
    if (this.state.useAmPm) {
      if (h >= 12) amPm = 'pm';
      else amPm = 'am';
      if (h > 12) h -= 12;
      if (h === 0) h = 12;
    }
    if (h < 10) h = `0${h}`;
    if (m < 10) m = `0${m}`;

    this.setState({
      time: `${h}:${m}`,
      ampm: this.state.useAmPm && amPm,
    });

    setTimeout(this.setClock, 1000);
  };

  render() {
    return (
      <div>
        <ClockTime id="clock">{this.state.time}</ClockTime>
        <AmPm id="amPm">{this.state.ampm}</AmPm>
      </div>
    );
  }
}

export default Clock;
