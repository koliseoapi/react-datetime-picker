import cx from 'classnames';
import React from 'react';
import Calendar from './Calendar';
import Time from './Time';
import moment from 'moment';
import { bindAll } from './util';

class DateTimeInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      isOpen: !!props.isOpen
    };
    bindAll(this, ['handleClose', 'handleClickTab', 'toggleDialog', 'handleClear']);
  }

  render() {
    const { value, i18n, name, format, onChange, isValid, locale, required } = this.props;
    const { tab, isOpen } = this.state;
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
          <dialog className="dt-input-moment"> 
            <div className="dt-options">
              <button type="button" className={'dt-calendar dt-btn ' + (tab === 0? 'is-active': '')} onClick={this.handleClickTab.bind(null, 0)}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className='dt-icon'
                  viewBox="0 0 36.4 36.4">
                    <path d="M30.2 4h-1V2.6C29 1.3 27.8 0 26.4 0c-1.5 0-2.7 1.2-2.7 2.8v1H21V3c0-2-1.2-3-2.6-3-1.5 0-2.7 1.2-2.7 2.8v1H13V3c0-2-1.2-3-2.7-3-1.5 0-2.7 1.2-2.7 2.8v1H6.2C4 4 2 6 2 8.3v24c0 2.3 2 4.2 4.2 4.2h24c2.4 0 4.3-2 4.3-4.2v-24c0-2.3-2-4.3-4.3-4.3zm-5-1.3c0-.6.6-1.2 1.3-1.2.6 0 1 .6 1 1.3v4.8c0 .7-.4 1.3-1 1.3-.7 0-1.2-1-1.2-1.7V2.8zm-8 0c0-.6.5-1.2 1.2-1.2s1 .6 1 1.3v4.8c0 .7-.4 1.3-1 1.3s-1.2-1-1.2-1.7V2.8zm-8 0c0-.6.5-1.2 1-1.2s1.3.6 1.3 1.3v4.8c0 .7-.6 1.3-1.2 1.3S9 8 9 7.2V2.8zM32 32.3c0 1-.8 1.7-1.8 1.7h-24c-1 0-1.7-.8-1.7-1.8v-22H32v22z"/><path d="M6.7 14.6h4.6v4H6.7zm6.3 0h4.5v4H13zm6 0h4.6v4H19zm6 0h4.7v4H25zM6.7 20h4.6v4.2H6.7zm6.3 0h4.5v4.2H13zm6 0h4.6v4.2H19zm6 0h4.7v4.2H25zM6.7 25.5h4.6v4H6.7zm6.3 0h4.5v4H13zm6 0h4.6v4H19zm6 0h4.7v4H25z"/>
                </svg>
                {i18n.Date}
              </button>
              <button type="button" className="dt-btn" onClick={this.handleClickTab.bind(null, 1)}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="dt-icon"
                  viewBox="0 0 640 640">
                    <path d="M320 25.6C157.4 25.6 25.6 157.4 25.6 320c0 162.6 131.8 294.4 294.4 294.4S614.4 482.6 614.4 320c0-162.6-131.8-294.4-294.4-294.4zm0 524.8C192.7 550.4 89.6 447.2 89.6 320S192.6 89.6 320 89.6 550.4 192.8 550.4 320 447.4 550.4 320 550.4zm22.4-396.8h-44.8v175.7l109 109 31.6-31.7-95.8-96z"/>
                </svg>
                {i18n.Time}
              </button>
            </div>

            <div className="dt-tabs">
              <Calendar
                className={cx('dt-tab', {'is-active': tab === 0})}
                moment={currentMoment}
                onChange={onChange}
                i18n={i18n}
                locale={locale}
                isValid={isValid}
              />
              <Time
                className={cx('dt-tab', {'is-active': tab === 1})}
                moment={currentMoment}
                onChange={onChange}
                i18n={i18n}
                isValid={isValid}
              />
            </div>
            
            <div className="dt-actions">
              <a className="dt-clear" onClick={this.handleClear}>
                {i18n.Clear}
              </a>
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

  handleClickTab(tab, e) {
    e.preventDefault();
    this.setState({tab: tab});
  }

  handleClose(e) {
    e.preventDefault();
    this.setState({ isOpen: false });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  handleClear(e) {
    e.preventDefault();
    this.setState({
      isOpen: false
    });
    this.props.onChange();
  }

};

DateTimeInput.defaultProps = {
  i18n: {
    Date: 'Date',
    Time: 'Time',
    Close: 'Close',
    Hours: 'Hours',
    Minutes: 'Minutes',
    Clear: 'Clear'
  },
  format: 'YYYY-MM-DD HH:mm',
  name: 'Date',
  locale: 'en',
  value: '',
  isValid: (moment) => true
}

export default DateTimeInput;