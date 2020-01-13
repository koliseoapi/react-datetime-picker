import React from "react";
import Calendar from "./Calendar";
import { dateFormatToPattern, isDateValid } from "./util";
import { format, setHours, setMinutes, parse } from "date-fns/esm";
import { parseISO } from "date-fns";

let COUNTER = 0;
const DEFAULT_DATE_FORMAT = "yyyy-MM-dd";

// translate a date to the corresponding input values
function dateToValues(dateTimeStr, dateTimeFormat) {
  if (!dateTimeStr) {
    return {
      dateValue: "",
      timeValue: ""
    };
  }
  const date = parseISO(dateTimeStr);
  const [, dateFormat] = dateTimeFormat
    ? /^([^T]+)/.exec(dateTimeFormat)
    : [undefined, DEFAULT_DATE_FORMAT];
  return {
    dateValue: format(date, dateFormat),
    timeValue: format(date, "HH:mm")
  };
}

class DateTimeInput extends React.Component {
  constructor(props) {
    super(props);
    const { value, dateFormat } = props;
    if (value && typeof value !== "string") {
      throw new Error(
        `Property "value" must be of type String (received: ${value.constructor.name})`
      );
    }

    this.state = dateToValues(value, dateFormat);
    this.state.id = COUNTER++;

    this.onDateChange = e => {
      this.setState({
        dateValue: e.target.value
      });
    };

    this.onTimeChange = e => {
      this.setState({
        timeValue: e.target.value
      });
    };

    this.triggerChange = () => {
      const { isValid, dateFormat } = this.props;
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
    };

    this.onInputFocus = () => {
      this.setState({
        focused: true,
        isOpen: true
      });
    };

    // moving focus to something else, close dialog
    this.onInputBlur = event => {
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
    };

    // a date has been chosen in the calendar
    this.onCalendarChange = date => {
      const { dateFormat } = this.props;
      this.setState(
        {
          dateValue: format(date, dateFormat),
          isOpen: false
        },
        () => {
          setTimeout(() => {
            this.dateInputRef && this.dateInputRef.focus();
            this.setState({ isOpen: false });
          }, 0);
        }
      );
    };

    this.onInputClick = () => {
      this.setState({ isOpen: true });
    };

    this.onClose = () => {
      this.setState({ isOpen: false });
    };

    this.onKeyDown = e => {
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
    };
  }

  componentWillUnmount() {
    this.dateInputRef = undefined;
  }

  render() {
    const {
      i18n,
      dateFormat,
      isValid,
      showTime,
      required,
      name,
      disabled,
      placeholder,
      onChange,
      value,
      locale,
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
              placeholder={placeholder || dateFormat.toLowerCase()}
              pattern={dateFormatToPattern(dateFormat)}
              name={name}
              disabled={disabled}
              autoComplete="off"
              ref={e => (this.dateInputRef = e)}
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
                dateFormat={dateFormat}
                isValid={isValid}
                onChange={this.onCalendarChange}
                locale={locale}
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
  // Date format
  dateFormat: DEFAULT_DATE_FORMAT,

  // the i18n entries to use
  i18n: {
    Close: "Close"
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
