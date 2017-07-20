import React from 'react';
import InputSlider from 'react-input-slider';
import { bindAll } from './util';

class Time extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, [ 'changeHours', 'changeMinutes' ]);
  }

  render() {
    var { moment, i18n, className } = this.props;
    return (
      <div className={'dt-time ' + (className || '')}>
        <div className="dt-showtime">
          <span className="dt-time">{moment.format('HH')}</span>
          <span className="dt-separater">:</span>
          <span className="dt-time">{moment.format('mm')}</span>
        </div>

        <div className="dt-sliders">
          <div className="dt-time-text">{i18n.Hours}:</div>
          <InputSlider
            className="dt-slider-time"
            xmin={0}
            xmax={23}
            x={moment.hour()}
            onChange={this.changeHours}
          />
          <div className="dt-time-text">{i18n.Minutes}:</div>
          <InputSlider
            className="dt-slider-time"
            xmin={0}
            xmax={59}
            x={moment.minute()}
            onChange={this.changeMinutes}
          />
        </div>
      </div>
    );
  }

  changeHours(pos) {
    var m = this.props.moment;
    m.hours(parseInt(pos.x, 10));
    this.props.onChange(m);
  }

  changeMinutes(pos) {
    var m = this.props.moment;
    m.minutes(parseInt(pos.x, 10));
    this.props.onChange(m);
  }
  
};

export default Time;