import React from "react";
import ReactDOM from "react-dom";
import DateTimeInput from "../index";
import { isAfter, formatISO, parseISO } from "date-fns/esm";
import { es } from "date-fns/esm/locale";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      from: formatISO(new Date())
    };

    this.onChange = ({ name, strValue }) => {
      console.log(`New value for ${name}: ${strValue}`);
      const state = {};
      state[name] = strValue;
      this.setState(state);
    };
  }

  render() {
    const { from, until } = this.state;
    return (
      <div className="app">
        <h1>react-datetime-picker</h1>
        <p>React datetime picker</p>
        <form>
          <label htmlFor="from" className="dt-input-label">
            Date from (US English, date+time, required)
          </label>
          <DateTimeInput
            name="from"
            id="from"
            dateFormat="MM-dd-yyyy"
            value={from}
            onChange={this.onChange}
            required={true}
          />

          <label htmlFor="until" className="dt-input-label">
            Date until (Spanish, date only, optional, required to be >= from)
          </label>
          <DateTimeInput
            name="until"
            id="until"
            dateFormat="dd-MM-yyyy"
            value={until}
            i18n={{ Close: "Cerrar" }}
            onChange={this.onChange}
            isValid={date => {
              return !from || isAfter(date, parseISO(from));
            }}
            showTime={false}
            locale={es}
          />
        </form>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
