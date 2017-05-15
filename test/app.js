import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import DateTimeInput from '../index';

var i18n = {
  en: {
    Date: 'Date',
    Time: 'Time',
    Close: 'Close',
    Hours: 'Hours',
    Minutes: 'Minutes'
  },
  es: {
    Date: 'Fecha',
    Time: 'Hora',
    Close: 'Cerrar',
    Hours: 'Horas',
    Minutes: 'Minutos'
  }
}


var App = React.createClass({
  displayName: 'App',

  getInitialState() {
    var locale = 'en';
    return {
      locale,
      i18n: i18n[locale],
      moment: moment().locale(locale)
    };
  },

  render() {
    var moment = this.state.moment;
    return (
      <div className="app">
        <h1>react-moment-datetime</h1>
        <h2>React datetime picker powered by momentjs</h2>
        <form>
          <label htmlFor="locale">Locale</label>
          <select name="locale" value={this.state.locale} onChange={this.onLocaleChange}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
          <label htmlFor="date" className="dt-input-label">Date</label>
          <DateTimeInput
            moment={moment}
            i18n={this.state.i18n}
            onChange={this.handleChange}
            onClose={this.handleClose}
            isValid={(moment) => {
              return moment.isAfter(new Date());
            }}
          />
        </form>
      </div>
    );
  },

  onLocaleChange(e) {
    var locale = e.target.value;
    this.setState({ locale, i18n: i18n[locale], moment: this.state.moment.locale(locale) });
  },

  handleChange(moment) {
    this.setState({ moment });
  },

  handleClose() {
    console.log('closed', this.state.moment.format('llll'));
  }
});

ReactDOM.render(<App/>, document.getElementById('app'));
