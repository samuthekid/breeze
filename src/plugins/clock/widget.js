import React, { Component } from 'react';
import styled from 'styled-components';

const ClockTime = styled.span`
  font-family: RobotoThin;
  font-size: 13.5vh;
  line-height: 15vh;
`;

const AmPm = styled.span`
  font-size: 5vh;
  padding-left: 0.5%;
`;

class Clock extends Component {
  state = {
    showSeconds: true,
    useAmPm: false,
    time: '',
    ampm: '',
  };

  setClock = () => {
    const time = new Date();
    let h = parseInt(time.getHours(), 10);
    let m = parseInt(time.getMinutes(), 10);
    let s = parseInt(time.getSeconds(), 10);

    let am_pm = '';
    if (this.state.useAmPm) {
      if (h >= 12) am_pm = 'pm';
      else am_pm = 'am';
      if (h > 12) h -= 12;
      if (h == 0) h = 12;
    }
    if (h < 10) h = `0${h}`;
    if (m < 10) m = `0${m}`;
    if (s < 10) s = `0${s}`;

    this.setState({
      time: this.state.showSeconds ? `${h}:${m}:${s}` : `${h}:${m}`,
      ampm: this.state.useAmPm && am_pm,
    });

    setTimeout(this.setClock, 1000);
  };

  componentWillMount() {
    this.setClock();
  }

  render() {
    return (
      <div>
        <ClockTime id="clock">{this.state.time}</ClockTime>
        <AmPm id="am_pm">{this.state.ampm}</AmPm>
      </div>
    );
  }
}

export default Clock;
