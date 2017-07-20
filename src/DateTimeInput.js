import React from 'react';
import Calendar from './Calendar';
import Time from './Time';
import moment from 'moment';
import { bindAll } from './util';

class DateTimeInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: !!props.isOpen
    };
    bindAll(this, ['handleClose', 'toggleDialog']);
  }

  render() {
    const { value, i18n, name, format, onChange, isValid, locale, required } = this.props;
    const { isOpen } = this.state;
    const currentMoment = (value? moment(value, format) : moment());
    currentMoment.locale(locale);
    return (
      <div className="dt-input-container">
        <input
          type="text"
          name={name}
          value={value}
          onClick={this.toggleDialog}
          readOnly
          className="dt-input"
          required={required}
        />
        { isOpen && 
          <dialog className="dt-dialog" open> 
            <Calendar
              moment={currentMoment}
              onChange={onChange}
              i18n={i18n}
              locale={locale}
              isValid={isValid}
            />
            <Time
              moment={currentMoment}
              onChange={onChange}
              i18n={i18n}
              isValid={isValid}
            />
            
            <div className="dt-actions">
              <button type="button" className="dt-btn dt-close" onClick={this.handleClose}>
                {i18n.Close}
              </button>
            </div>
          </dialog>
        }
      </div>
    );
  }

  toggleDialog() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  handleClose(e) {
    e.preventDefault();
    this.setState({ isOpen: false });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

};

DateTimeInput.defaultProps = {
  i18n: {
    Date: 'Date',
    Time: 'Time',
    Close: 'Close',
    Hours: 'Hours',
    Minutes: 'Minutes'
  },
  format: 'YYYY-MM-DD HH:mm',
  name: 'Date',
  locale: 'en',
  value: '',
  isValid: (moment) => true
}

export default DateTimeInput;