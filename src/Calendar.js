import cx from 'classnames';
import blacklist from 'blacklist';
import React from 'react';
import { range, chunk, bindAll } from 'lodash';

function isPrevMonth(day, weekIndex) {
  return (weekIndex === 0 && day > 7);
}

function isNextMonth(day, weekIndex) {
  return (weekIndex >= 4 && day <= 14);
}

var Day = function(props) {
  var { day, weekIndex, isValid, selected } = props;
  var prevMonth = isPrevMonth(day, weekIndex);
  var nextMonth = isNextMonth(day, weekIndex);
  var elementProps = blacklist(props, 'day', 'weekIndex', 'selected', 'className', 'isValid');
  elementProps.className = cx({
    'dt-prev-month': prevMonth,
    'dt-next-month': nextMonth,
    'dt-invalid': !isValid,
    'dt-current-day': selected
  });
  return <td {...elementProps}>{day}</td>;
}

class Calendar extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      moment: props.moment.clone()
    }
    bindAll(this, [ 'selectDate', 'nextMonth', 'prevMonth' ]);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.moment.isSame(nextProps.moment)) {
      this.state.moment.locale(nextProps.moment.locale());
    } else {
      this.state.moment = nextProps.moment.clone();
    }
  }

  render() { 
    var moment = this.state.moment;

    var currentDay = moment.date();
    var prevMonthLastDay = moment.clone().subtract(1, 'month').endOf('month').date();
    var monthFirstDay = moment.clone().date(1).day();
    var monthLastDay = moment.clone().endOf('month').date();

    var days = [].concat(
      range(prevMonthLastDay - monthFirstDay + 1, prevMonthLastDay + 1),
      range(1, monthLastDay + 1),
      range(1, 42 - monthLastDay - monthFirstDay + 1)
    );

    // get short names for weekdays in current locale, example
    var weeks = moment.localeData()._weekdaysShort;

    return (
      <div className={cx('dt-calendar', this.props.className)}>
        <div className="dt-toolbar">
          <button type="button" className="dt-prev-month" onClick={this.prevMonth}>
            <i className="dt-prev-month-icon" />
          </button>
          <span className="dt-current-date">{moment.format('MMMM YYYY')}</span>
          <button type="button" className="dt-next-month" onClick={this.nextMonth}>
            <i className="dt-next-month-icon" />
          </button>
        </div>

        <table>
          <thead>
            <tr>
              { weeks.map((weekDay, index) => <td key={index}>{weekDay}</td>) }
            </tr>
          </thead>
          <tbody>
            {
              chunk(days, 7).map((row, weekIndex) => (
                <tr key={weekIndex}>
                  {
                    row.map((day) => {
                      const newDate = this.getNewDate(day, weekIndex);
                      const isValid = this.props.isValid(newDate);
                      const selected = newDate.isSame(this.props.moment);
                      return (
                        <Day key={day} day={day} selected={selected} weekIndex={weekIndex} isValid={isValid}
                          onClick={isValid && this.selectDate.bind(null, day, weekIndex)}
                        />
                      )
                    })
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }

  getNewDate(day, weekIndex) {
    let newDate = this.state.moment.clone().date(day);
    if (isPrevMonth(day, weekIndex)) {
      newDate.subtract(1, 'month');
    } else if (isNextMonth(day, weekIndex)) {
      newDate.add(1, 'month');
    }
    return newDate;
  }

  selectDate(day, weekIndex) {
    let newDate = this.getNewDate(day, weekIndex);
    if (isPrevMonth(day, weekIndex)) {
      this.prevMonth();
    } else if (isNextMonth(day, weekIndex)) {
      this.nextMonth();
    } else {
      this.props.onChange(newDate);
    }
  }

  prevMonth(e) {
    e && e.preventDefault();
    this.setState({
      moment: this.state.moment.subtract(1, 'month')
    });
  }

  nextMonth(e) {
    e && e.preventDefault();
    this.setState({
      moment: this.state.moment.add(1, 'month')
    });
  }

};

export default Calendar;