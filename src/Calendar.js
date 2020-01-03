import React from "react";
import { bindAll, range, chunk, isDateValid } from "./util";
import {
  subMonths,
  addMonths,
  lastDayOfMonth,
  getDate,
  setDate,
  parse,
  getDay,
  format
} from "date-fns/esm";

function isPrevMonth(day, weekIndex) {
  return weekIndex === 0 && day > 6;
}

function isNextMonth(day, weekIndex) {
  return weekIndex >= 4 && day <= 14;
}

/**
 * currentDate: the currently selected Date in the calendar
 * day: the day of the month (1-31)
 * weekIndex: the current week being rendered in the calendar
 */
function createCalendarDate(currentDate, day, weekIndex) {
  let newDate = setDate(currentDate, +day);
  if (isPrevMonth(day, weekIndex)) {
    newDate = subMonths(newDate, 1);
  } else if (isNextMonth(day, weekIndex)) {
    newDate = addMonths(newDate, 1);
  }
  return newDate;
}

function Day(allProps) {
  const { day, weekIndex, isValid, selected, ...props } = allProps;

  const classes = ["dt-day-a"];
  isPrevMonth(day, weekIndex) && classes.push("dt-prev-month");
  isNextMonth(day, weekIndex) && classes.push("dt-next-month");
  !isValid && classes.push("dt-invalid");
  selected && classes.push("dt-current-day");

  return (
    <td className="dt-day">
      <a className={classes.join(" ")} tabIndex="-1" {...props}>
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
    bindAll(this, ["selectDate", "nextMonth", "prevMonth"]);
  }

  stateFromProps({ dateValue, i18n: { format } }) {
    try {
      var currentMoment = parse(dateValue, format, new Date());

      // if date is not valid
      if (!isDateValid(currentMoment)) {
        currentMoment = new Date();
      }
    } catch (e) {
      console.error(e.message);
      currentMoment = new Date();
    }
    return {
      moment: currentMoment
    };
  }

  selectDate(day, weekIndex) {
    let newDate = createCalendarDate(this.state.moment, day, weekIndex);
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
      moment: subMonths(this.state.moment, 1)
    });
  }

  nextMonth(e) {
    e && e.preventDefault();
    this.setState({
      moment: addMonths(this.state.moment, 1)
    });
  }

  render() {
    const moment = this.state.moment;
    //const currentDay = getDate(moment);
    const {
      dateValue,
      i18n: { format: dateFormat, weekDays: weekDaysStr }
    } = this.props;

    const prevMonthLastDay = getDate(lastDayOfMonth(subMonths(moment, 1)));
    const currentMonthFirstWeekDay = getDay(setDate(moment, 1));
    const currentMonthLastDay = getDate(lastDayOfMonth(moment));

    const days = [].concat(
      range(
        prevMonthLastDay - currentMonthFirstWeekDay + 1,
        prevMonthLastDay + 1
      ),
      range(1, currentMonthLastDay + 1),
      range(1, 42 - currentMonthLastDay - currentMonthFirstWeekDay + 1)
    );
    debugger;

    // short names of the week days
    const weekDays = days.slice(0, 7).map(day => {
      const date = createCalendarDate(this.state.moment, day, 0);
      const weekDay = getDay(date);
      return weekDaysStr.substring(weekDay * 3, (weekDay + 1) * 3);
    });

    return (
      <div className="dt-calendar" aria-hidden="true">
        <div className="dt-toolbar">
          <button
            type="button"
            className="dt-button dt-btn-prev-month"
            onClick={this.prevMonth}
            tabIndex="-1"
          />
          <span className="dt-current-date">{format(moment, "MMMM yyyy")}</span>
          <button
            type="button"
            className="dt-button dt-btn-next-month"
            onClick={this.nextMonth}
            tabIndex="-1"
          />
        </div>

        <table className="dt-calendar-table">
          <thead>
            <tr>
              {weekDays.map((weekDay, index) => (
                <th className="dt-th" key={index}>
                  {weekDay}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chunk(days, 7).map((row, weekIndex) => (
              <tr key={weekIndex}>
                {row.map(day => {
                  const newDate = createCalendarDate(moment, day, weekIndex);
                  const isValid = this.props.isValid(newDate);
                  const selected = format(newDate, dateFormat) == dateValue;
                  return (
                    <Day
                      key={day}
                      day={day}
                      selected={selected}
                      weekIndex={weekIndex}
                      isValid={isValid}
                      onMouseDown={
                        isValid
                          ? this.selectDate.bind(null, day, weekIndex)
                          : undefined
                      }
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Calendar;
