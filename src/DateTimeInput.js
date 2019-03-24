import React from "react";
import Calendar from "./Calendar";
import moment from "moment";
import { bindAll, dateFormatToPattern } from "./util";

let COUNTER = 0;

class DateTimeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.dateToValues(props.value);
    this.state.id = COUNTER++;
    bindAll(this, [
      "onClose",
      "onCalendarChange",
      "onInputBlur",
      "onInputFocus",
      "onDateChange",
      "onTimeChange",
      "onInputClick",
      "onKeyDown",
      "triggerChange"
    ]);
  }

  componentWillReceiveProps({ value }) {
    this.setState(this.dateToValues(value));
  }

  onDateChange(e) {
    this.setState({
      dateValue: e.target.value
    });
  }

  onTimeChange(e) {
    this.setState({
      timeValue: e.target.value
    });
  }

  // translate a date to the corresponding input values
  dateToValues(date) {
    const {
      i18n: { format, locale }
    } = this.props;
    if (!date) {
      return {
        dateValue: "",
        timeValue: ""
      };
    }
    const currentMoment = moment(date).locale(locale);
    return {
      dateValue: currentMoment.format(format),
      timeValue: currentMoment.format("HH:mm")
    };
  }

  triggerChange() {
    const { format, locale } = this.props.i18n;
    const { dateValue, timeValue } = this.state;
    let result = undefined;

    if (dateValue) {
      var currentMoment = moment(dateValue, format).locale(locale);
      const timeParts = /([0-2]?[0-9]):([0-5]?[0-9])/.exec(timeValue);
      if (timeParts) {
        const [_, hour, minutes] = timeParts;
        currentMoment.hour(hour);
        currentMoment.minutes(minutes);
      }
      result = currentMoment.toDate();
    }

    // notify of date change
    const onChange = this.props.onChange;
    const valid = !result || currentMoment.isValid();
    valid &&
      onChange &&
      onChange({
        name: this.props.name,
        value: result,
        strValue: !result
          ? undefined
          : !this.props.showTime
          ? new moment(result).format("YYYY-MM-DD")
          : new moment(result).format("YYYY-MM-DDTHH:mm")
      });
  }

  onInputFocus() {
    this.setState({
      focused: true,
      isOpen: true
    });
  }

  // moving focus to something else, close dialog
  onInputBlur(event) {
    const newElement = event.relatedTarget;
    if (newElement) {
      const isOpen = !!(
        newElement && newElement.closest(`#dt-${this.state.id}`)
      );
      this.setState({
        focused: false,
        isOpen: isOpen
      });
    }
    this.triggerChange();
  }

  // a date has been chosen in the calendar
  onCalendarChange(dateMoment) {
    const { format } = this.props.i18n;
    this.setState(
      {
        dateValue: dateMoment.format(format),
        isOpen: false
      },
      () => {
        //this.triggerChange();
        setTimeout(() => {
          this.refs.dateInput.focus();
          this.setState({ isOpen: false });
        }, 0);
      }
    );
  }

  onInputClick() {
    this.setState({ isOpen: true });
  }

  onClose() {
    this.setState({ isOpen: false });
  }

  onKeyDown(e) {
    if (e.keyCode == 27) {
      // if esc, hide the calendar
      this.onClose();
    } else if (e.keyCode == 13) {
      // if enter is pressed when the calendar is shown, just cancel the event and hide the calendar
      // presing enter again will submit the form
      if (this.state.isOpen) {
        this.triggerChange();
        this.setState({ isOpen: false });
        e.preventDefault();
      }
    } else {
      // any other key, show the calendar
      this.state.isOpen || this.setState({ isOpen: true });
    }
  }

  render() {
    const { i18n, isValid, required, showTime, name, disabled } = this.props;
    const { isOpen, dateValue, timeValue, id } = this.state;

    return (
      <div className="dt-input-container" id={`dt-${id}`}>
        <div className="dt-inputs">
          <div className="dt-input-date-wrapper">
            <input
              type="text"
              className="dt-input dt-input-date"
              value={dateValue}
              required={required}
              placeholder={i18n.format}
              pattern={dateFormatToPattern(i18n.format)}
              name={name}
              disabled={disabled}
              autoComplete="off"
              ref="dateInput"
              onKeyDown={!disabled ? this.onKeyDown : undefined}
              onClick={!disabled ? this.onInputClick : undefined}
              onFocus={!disabled ? this.onInputFocus : undefined}
              onBlur={!disabled ? this.onInputBlur : undefined}
              onChange={!disabled ? this.onDateChange : undefined}
            />
          </div>

          {showTime && (
            <input
              type="text"
              className="dt-input dt-input-time"
              pattern="([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]"
              value={timeValue}
              required={required}
              disabled={disabled}
              placeholder="hh:mm"
              onBlur={!disabled ? this.onInputBlur : undefined}
              onChange={!disabled ? this.onTimeChange : undefined}
            />
          )}
        </div>

        {isOpen && (
          <div aria-hidden="true">
            <div className="dt-dialog-backdrop" onClick={this.onClose} />
            <dialog className="dt-dialog" open>
              <Calendar
                dateValue={dateValue}
                i18n={i18n}
                isValid={isValid}
                onChange={this.onCalendarChange}
              />
              <div className="dt-actions">
                <button
                  type="button"
                  className="dt-btn dt-close"
                  tabIndex="-1"
                  onClick={this.onClose}
                >
                  {i18n.Close}
                </button>
              </div>
            </dialog>
          </div>
        )}
      </div>
    );
  }
}

DateTimeInput.defaultProps = {
  // the i18n entries to use
  i18n: {
    Date: "Date",
    Time: "Time",
    Close: "Close",
    Hours: "Hours",
    Minutes: "Minutes",

    // date format
    format: "YYYY-MM-DD",

    // locale ISO
    locale: "en"
  },

  // true to include a time component
  showTime: true,

  // the current value, as date
  // value: undefined,

  // a function that given a date returns if it's valid
  isValid: moment => true,

  // triggered when there is a change. Receives a Date instance
  onChange: undefined
};

export default DateTimeInput;
