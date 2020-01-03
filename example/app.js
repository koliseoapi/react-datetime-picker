import React from "react";
import ReactDOM from "react-dom";
import DateTimeInput from "../index";
import { bindAll } from "../src/util";
import { isBefore, format, isAfter } from "date-fns/esm";

var enValues = {
  Close: "Close",
  format: "MM-dd-yyyy",
  weekDays: "MonTueWedThuFriSatSun"
};

var esValues = {
  Close: "Cerrar",
  format: "dd-MM-yyyy",
  weekDays: "LunMarMieJueVieSabDom"
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
        <h1>react-datetime-picker</h1>
        <p>React datetime picker</p>
        <form>
          <label htmlFor="from" className="dt-input-label">
            Date from (US English, date+time, required)
          </label>
          <DateTimeInput
            name="from"
            id="from"
            value={from}
            i18n={enValues}
            onChange={this.onChange}
            isValid={date => {
              return !until || isBefore(date, until);
            }}
            required={true}
          />

          <label htmlFor="until" className="dt-input-label">
            Date until (Spanish, date only, optional)
          </label>
          <DateTimeInput
            name="until"
            id="until"
            value={until}
            i18n={esValues}
            onChange={this.onChange}
            isValid={date => {
              return !from || isAfter(date, from);
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
        : format(value, "yyyy-MM-dd HH:mm");
    console.log(`New value for ${name}: ${formattedValue}`);
    const state = {};
    state[name] = value;
    this.setState(state);
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
