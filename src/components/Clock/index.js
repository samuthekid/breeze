import React, { Component } from 'react';

class Clock extends Component {

  state = {
    showSeconds: true,
    useAmPm: false,
    time: '',
    ampm: '',
  }

  setClock = () => {
    let time = new Date();
    let h = parseInt(time.getHours());
    let m = parseInt(time.getMinutes());
    let s = parseInt(time.getSeconds());

    let am_pm = "";
    if (this.state.useAmPm) {
      if (h >= 12) am_pm = "pm";
      else am_pm = "am";
      if (h > 12) h = h - 12;
      if (h == 0) h = 12;
    }
    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;

    this.setState({
      time: this.state.showSeconds
        ? h + ":" + m + ":" + s
        : h + ":" + m,
      ampm: this.state.useAmPm && am_pm,
    });

    setTimeout(this.setClock, 1000);
  }

  componentWillMount() {
    this.setClock();
  }

  render() {
    return (
      <div>
        <span className="clock" id="clock">{this.state.time}</span>
        <span className="am_pm" id="am_pm">{this.state.ampm}</span>
      </div>
    );
  }
}

export default Clock;
