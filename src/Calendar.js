import React from 'react';
import moment from 'moment';
import { bindAll, range, chunk } from './util';

function isPrevMonth(day, weekIndex) {
  return (weekIndex === 0 && day > 7);
}

function isNextMonth(day, weekIndex) {
  return (weekIndex >= 4 && day <= 14);
}

function Day(allProps) {
  const { day, weekIndex, isValid, selected, ...props } = allProps;

  const classes = ['dt-day-a'];
  isPrevMonth(day, weekIndex) && classes.push('dt-prev-month');
  isNextMonth(day, weekIndex) && classes.push('dt-next-month');
  !isValid && classes.push('dt-invalid');
  selected && classes.push('dt-current-day');

  return (
    <td className="dt-day">
      <a 
        className={classes.join(' ')} 
        tabIndex="-1"
        {...props}
      >
        {day}
      </a>
    </td>
  );
}

// 
// Render a month in the calendar
//
class Calendar extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = this.stateFromProps(props);
    bindAll(this, ['selectDate', 'nextMonth', 'prevMonth']);
  }

  stateFromProps({ dateValue, i18n: { format, locale }}) {
    let currentMoment = new moment(dateValue, format);
    if (!currentMoment.isValid()) {
      currentMoment = new moment();
    }
    return {
      moment: currentMoment.locale(locale)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.stateFromProps(nextProps));
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

  render() { 
    var moment = this.state.moment;
    var { dateValue, i18n: { format } } = this.props;

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
      <div className="dt-calendar">
        <div className="dt-toolbar">
          <button 
            type="button" 
            className="dt-button dt-btn-prev-month" 
            onClick={this.prevMonth}
            tabIndex="-1"
          >
          </button>
          <span className="dt-current-date">{moment.format('MMMM YYYY')}</span>
          <button 
            type="button" 
            className="dt-button dt-btn-next-month" 
            onClick={this.nextMonth}
            tabIndex="-1"
          >
          </button>
        </div>

        <table className="dt-calendar-table">
          <thead>
            <tr>
              { weeks.map((weekDay, index) => <th className="dt-th" key={index}>{weekDay}</th>) }
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
                      const selected = newDate.format(format) == dateValue;
                      return (
                        <Day 
                          key={day} 
                          day={day} 
                          selected={selected} 
                          weekIndex={weekIndex} 
                          isValid={isValid}

                          onMouseDown={isValid? this.selectDate.bind(null, day, weekIndex) : undefined}
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

};

export default Calendar;