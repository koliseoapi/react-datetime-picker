import React from "react";
import { bindAll, chunk, isDateValid, capitalize } from "./util";
import {
  subMonths,
  addMonths,
  lastDayOfMonth,
  getDate,
  setDate,
  parse,
  getDay,
  format,
  getDaysInMonth
} from "date-fns/esm";

// return a range of days, where each value is start+index+1
function dateRange(start, end) {
  return Array.from(Array(end - start), (_, i) => start + i + 1);
}

function Day(allProps) {
  const {
    day,
    date,
    isValid,
    selected,
    belongsTothisMonth,
    onChange,
    ...props
  } = allProps;

  const classes = [
    "dt-day-a",
    belongsTothisMonth ? "" : "dt-other-month",
    isValid ? "" : "dt-invalid",
    !selected ? "" : "dt-current-day"
  ]
    .filter(_ => !!_)
    .join(" ");

  const onMouseDown = isValid ? () => onChange(date) : undefined;

  // we don't use data-date, but it's useful for testing purposes
  return (
    <td className="dt-day">
      <a
        className={classes}
        tabIndex="-1"
        data-date={date.toISOString()}
        onMouseDown={onMouseDown}
        {...props}
      >
        {day}
      </a>
    </td>
  );
}

// calculate the day numbers for the calendar, returned as three arrays:
// last month, current month, next month.
// the first and last arrays may be empty for certain months. See CalendarTest for examples.
export function getCalendarFragments(date) {
  const prevMonthLastDay = getDate(lastDayOfMonth(subMonths(date, 1)));
  const currentMonthFirstWeekDay = getDay(setDate(date, 1));
  const daysInMonth = getDaysInMonth(date);
  const totalCalendarDays =
    Math.ceil((daysInMonth + currentMonthFirstWeekDay) / 7) * 7;
  const lastMonthDateRange = dateRange(
    prevMonthLastDay - currentMonthFirstWeekDay,
    prevMonthLastDay
  );

  return {
    lastMonth: lastMonthDateRange,
    currentMonth: dateRange(0, daysInMonth),
    nextMonth: dateRange(
      0,
      totalCalendarDays - daysInMonth - lastMonthDateRange.length
    )
  };
}

//
// Render a month in the calendar
//
class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.stateFromProps(props);
    bindAll(this, ["nextMonth", "prevMonth"]);
  }

  stateFromProps({ dateValue, format }) {
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
    const { onChange, dateValue, format: dateFormat, locale } = this.props;

    const { lastMonth, currentMonth, nextMonth } = getCalendarFragments(moment);
    const days = [].concat(lastMonth, currentMonth, nextMonth);
    function belongsToLastMonth(dayIndex) {
      return dayIndex < lastMonth.length;
    }
    function belongsToNextMonth(dayIndex) {
      return dayIndex >= lastMonth.length + currentMonth.length;
    }
    function createCalendarDate(currentDate, dayIndex) {
      const day = days[dayIndex];
      let newDate = setDate(currentDate, 1);
      if (belongsToLastMonth(dayIndex)) {
        newDate = subMonths(newDate, 1);
      } else if (belongsToNextMonth(dayIndex)) {
        newDate = addMonths(newDate, 1);
      }
      return setDate(newDate, day);
    }

    // short names of the week days
    const weekDays = days.slice(7, 14).map(day => {
      const date = setDate(moment, day);
      return format(date, "EE", { locale });
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
          <span className="dt-current-date">
            {capitalize(format(moment, "MMMM yyyy", { locale }))}
          </span>
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
                {row.map((day, di) => {
                  const dayIndex = weekIndex * 7 + di;
                  const newDate = createCalendarDate(moment, dayIndex);
                  const isValid = this.props.isValid(newDate);
                  const selected = format(newDate, dateFormat) == dateValue;
                  return (
                    <Day
                      key={day}
                      day={day}
                      date={newDate}
                      selected={selected}
                      isValid={isValid}
                      belongsTothisMonth={
                        !belongsToLastMonth(dayIndex) &&
                        !belongsToNextMonth(dayIndex)
                      }
                      onChange={onChange}
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
