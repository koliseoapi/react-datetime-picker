import React from 'react';
import ReactDOM from 'react-dom';
import DateTimeInput from '../index';
import { bindAll } from 'lodash';

var i18n = {
  en: {
    Date: 'Date',
    Time: 'Time',
    Close: 'Close',
    Hours: 'Hours',
    Minutes: 'Minutes',
    Clear: 'Clear'
  },
  es: {
    Date: 'Fecha',
    Time: 'Hora',
    Close: 'Cerrar',
    Hours: 'Horas',
    Minutes: 'Minutos',
    Clear: 'Borrar'
  }
}

const defaultLocale = 'en';

class App extends React.Component {

  constructor(props) {
    super(props);
    bindAll(this, [ 'handleChange', 'handleClose', 'onLocaleChange' ])
    this.state = {
      locale: defaultLocale,
      i18n: i18n[defaultLocale],
      value: undefined
    }
  }

  render() {
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
            value={this.state.value}
            locale={this.state.locale}
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
  }

  onLocaleChange(e) {
    var locale = e.target.value;
    this.setState({ locale, i18n: i18n[locale], value: this.state.value });
  }

  handleChange(moment) {
    this.setState({ value: !moment? undefined : moment.format('YYYY-MM-DD HH:mm') });
  }

  handleClose() {
    console.log('closed', this.state.value);
  }
};

ReactDOM.render(<App/>, document.getElementById('app'));
