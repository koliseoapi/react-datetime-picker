import React from 'react';
import { bindAll } from './util';

// equivalent to lodash.range()
// https://www.reindex.io/blog/you-might-not-need-underscore/
function range(start, end) {
  return Array.from(Array(end - start), (_, i) => start + i)
}

// replace lodash.chunk()
// https://stackoverflow.com/questions/8495687/split-array-into-chunks
function chunk(array, chunk) {
  var i, j, result = [];
  for (i = 0, j = array.length; i < j; i += chunk) {
    result.push(array.slice(i, i + chunk));
  }
  return result;
}

function isPrevMonth(day, weekIndex) {
  return (weekIndex === 0 && day > 7);
}

function isNextMonth(day, weekIndex) {
  return (weekIndex >= 4 && day <= 14);
}

function Day(allProps) {
  const { day, weekIndex, isValid, selected, ...props } = allProps;
  const prevMonth = isPrevMonth(day, weekIndex);
  const nextMonth = isNextMonth(day, weekIndex);
  const classes = ['dt-day'];
  prevMonth && classes.push('dt-prev-month');
  nextMonth && classes.push('dt-next-month');
  !isValid && classes.push('dt-invalid');
  selected && classes.push('dt-current-day');
  props.className = classes.join(' ');
  return <td {...props}>{day}</td>;
}

// 
// Render a month in the calendar
//
class Calendar extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      moment: props.moment.clone()
    };
    bindAll(this, ['selectDate', 'nextMonth', 'prevMonth']);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      moment: nextProps.moment.clone()
    });
    /*
    if (this.state.moment.isSame(nextProps.moment)) {
      this.state.moment.locale(nextProps.moment.locale());
    } else {
      this.state.moment = nextProps.moment.clone();
    }
    */
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
      <div className="dt-calendar">
        <div className="dt-toolbar">
          <button type="button" className="dt-button dt-btn-prev-month" onClick={this.prevMonth}>
          </button>
          <span className="dt-current-date">{moment.format('MMMM YYYY')}</span>
          <button type="button" className="dt-button  dt-btn-next-month" onClick={this.nextMonth}>
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
                      const selected = newDate.isSame(this.props.moment);
                      return (
                        <Day 
                          key={day} 
                          day={day} 
                          selected={selected} 
                          weekIndex={weekIndex} 
                          isValid={isValid}
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