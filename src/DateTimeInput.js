import React from "react";
import Calendar from "./Calendar";
import { bindAll, dateFormatToPattern, isDateValid } from "./util";
import { format, setHours, setMinutes, parse } from "date-fns/esm";

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
      i18n: { format: dateFormat }
    } = this.props;
    return !date
      ? {
          dateValue: "",
          timeValue: ""
        }
      : {
          dateValue: format(date, dateFormat),
          timeValue: format(date, "HH:mm")
        };
  }

  triggerChange() {
    const { isValid } = this.props;
    const { format: dateFormat } = this.props.i18n;
    const { dateValue, timeValue } = this.state;
    let result = undefined;

    if (dateValue) {
      try {
        result = parse(dateValue, dateFormat, new Date());
        const timeParts = /([0-2]?[0-9]):([0-5]?[0-9])/.exec(timeValue);
        if (timeParts) {
          const [_, hour, minutes] = timeParts;
          result = setHours(result, +hour);
          result = setMinutes(result, +minutes);
        }
      } catch (e) {
        console.log(e.message);
        result = NaN;
      }
    }

    // notify of date change
    const onChange = this.props.onChange;
    isDateValid(result) &&
      (!isValid || isValid(result)) &&
      onChange &&
      onChange({
        name: this.props.name,
        value: result,
        strValue: !result
          ? undefined
          : !this.props.showTime
          ? format(result, "yyyy-MM-dd")
          : format(result, "yyyy-MM-dd'T'HH:mm")
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
  onCalendarChange(date) {
    const { format: dateFormat } = this.props.i18n;
    this.setState(
      {
        dateValue: format(date, dateFormat),
        isOpen: false
      },
      () => {
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
    const {
      i18n,
      isValid,
      showTime,
      required,
      name,
      disabled,
      placeholder,
      onChange,
      value,
      ...otherProps
    } = this.props;
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
              placeholder={placeholder || i18n.format.toLowerCase()}
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
              {...otherProps}
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
    Close: "Close",

    // date format
    format: "yyyy-MM-dd",
    weekDays: "MonTueWedThuFriSatSun"
  },

  // true to include a time component
  showTime: true,

  // the current value, as date
  // value: undefined,

  // a function that given a date returns if it's valid
  isValid: date => true,

  // triggered when there is a change. Receives a Date instance
  onChange: undefined
};

export default DateTimeInput;
