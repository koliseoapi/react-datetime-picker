import React from "react";
import ReactDOM from "react-dom";
import DateTimeInput from "../index";
import moment from "moment";
import { bindAll } from "../src/util";

var enValues = {
  Date: "Date",
  Time: "Time",
  Close: "Close",
  Hours: "Hours",
  Minutes: "Minutes",
  format: "MM-DD-YYYY",
  locale: "en"
};

var esValues = {
  Date: "Fecha",
  Time: "Hora",
  Close: "Cerrar",
  Hours: "Horas",
  Minutes: "Minutos",
  format: "DD-MM-YYYY",
  locale: "es"
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      from: new Date()
    };
    bindAll(this, ["onChange"]);
  }

  render() {
    const { from, until } = this.state;
    return (
      <div className="app">
        <h1>react-moment-datetime</h1>
        <p>React datetime picker powered by momentjs</p>
        <form>
          <label htmlFor="from" className="dt-input-label">
            Date from (US English, date+time, required)
          </label>
          <DateTimeInput
            name="from"
            value={from}
            i18n={enValues}
            onChange={this.onChange}
            isValid={moment => {
              return !until || moment.isBefore(until);
            }}
            required={true}
          />

          <label htmlFor="until" className="dt-input-label">
            Date until (Spanish, date only, optional)
          </label>
          <DateTimeInput
            name="until"
            value={until}
            i18n={esValues}
            onChange={this.onChange}
            isValid={moment => {
              return !from || moment.isAfter(from);
            }}
            showTime={false}
          />
        </form>
      </div>
    );
  }

  onChange({ name, value }) {
    const formattedValue =
      typeof value === "undefined"
        ? "undefined"
        : new moment(value).format("YYYY-MM-DD HH:mm");
    console.log(`New value for ${name}: ${formattedValue}`);
    const state = {};
    state[name] = value;
    this.setState(state);
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
