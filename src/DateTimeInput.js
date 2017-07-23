import React from 'react';
import Calendar from './Calendar';
import moment from 'moment';
import { bindAll, dateFormatToPattern } from './util';

let COUNTER = 0;

class DateTimeInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.dateToValues(props.value);
    this.state.id = COUNTER++;
    bindAll(this, [ 
      'onClose', 'onInputBlur', 'onCalendarChange',
      'onInputFocus', 'onDateChange', 'onTimeChange',
      'onInputClick' , 'onKeyDown'
    ]);
  }

  componentWillReceiveProps({ value }) {
    this.setState(this.dateToValues(value));
  }

  onDateChange(e) {
    this.setState({
      dateValue: e.target.value,
      isOpen: true
    })
  }

  onTimeChange(e) {
    this.setState({
      timeValue: e.target.value,
      isOpen: true
    })
  }

  // translate a date to the corresponding input values
  dateToValues(date) {
    const { i18n: { format, locale } } = this.props;
    if (!date) {
      return {
        dateValue: '',
        timeValue: ''
      }
    }
    const currentMoment = moment(date).locale(locale);
    return {
      dateValue: currentMoment.format(format),
      timeValue: currentMoment.format('HH:mm')
    }
  }

  onInputFocus() {
    this.setState({
      focused: true,
      isOpen: true
    });
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
    valid && onChange && onChange({
      name: this.props.name,
      value: result,
      strValue: !result? undefined :
        !this.props.showTime ? new moment(result).format('YYYY-MM-DD') :
          new moment(result).format('YYYY-MM-DDTHH:mm')
    });

  }

  onInputBlur(event) {

    // moving focus to something else, close dialog
    const newElement = event.relatedTarget;
    this.setState({
      focused: false,
      isOpen: !!(newElement && newElement.closest(`#dt-${this.state.id}`))
    })

    this.triggerChange();

  }

  // a date has been chosen in the calendar
  onCalendarChange(date) {
    const { locale, format } = this.props.i18n;
    this.refs.dateInput.focus();
    this.setState({
      dateValue: new moment(date).locale(locale).format(format),
      isOpen: false
    });
  }

  onInputClick() {
    this.setState({ isOpen: true });
  }

  onClose() {
    this.setState({ isOpen: false });
  }

  onKeyDown(e) {
    var handled = false
    if (e.keyCode == 27) {
      this.onClose();
    }
  }

  render() {
    const { value, i18n, isValid, locale, required, showTime, name } = this.props;
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
              ref="dateInput"

              onKeyDown={this.onKeyDown}
              onClick={this.onInputClick}
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              onChange={this.onDateChange}

            />
          </div>

          { showTime && 
            <input
              type="text"
              className="dt-input dt-input-time"
              pattern="[0-2]?[0-2]:[0-5]?[0-9]"
              value={timeValue}
              required={required}
              placeholder="hh:mm"

              onKeyDown={this.onKeyDown}
              onClick={this.onInputClick}
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              onChange={this.onTimeChange}
              
            />  
          }
        </div>

        { isOpen && 
          <dialog className="dt-dialog" open>
            <Calendar
              dateValue={dateValue}
              i18n={i18n}
              isValid={isValid}

              onChange={this.onCalendarChange}
              onBlur={this.onInputBlur}
            />
            <div className="dt-actions">
              <button type="button" className="dt-btn dt-close" onClick={this.onClose}>{i18n.Close}</button>
            </div>
          </dialog>
        }
      </div>
    );
  }

};

DateTimeInput.defaultProps = {
  
  // the i18n entries to use
  i18n: {
    Date: 'Date',
    Time: 'Time',
    Close: 'Close',
    Hours: 'Hours',
    Minutes: 'Minutes',

    // date format
    format: 'YYYY-MM-DD',

    // locale ISO
    locale: 'en'
  },
  
  // true to include a time component
  showTime: true,

  // the current value, as date
  // value: undefined,

  // a function that given a date returns if it's valid
  isValid: (moment) => true,

  // triggered when there is a change. Receives a Date instance
  onChange: undefined

}

export default DateTimeInput;