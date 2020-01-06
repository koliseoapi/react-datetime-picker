import React from "react";
import ReactDOM from "react-dom";
import DateTimeInput from "../index";
import { bindAll } from "../src/util";
import { isBefore, format, isAfter } from "date-fns/esm";
import { es } from "date-fns/esm/locale";

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
            format="MM-dd-yyyy"
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
            format="dd-MM-yyyy"
            value={until}
            i18n={{ Close: "Cerrar" }}
            onChange={this.onChange}
            isValid={date => {
              return !from || isAfter(date, from);
            }}
            showTime={false}
            locale={es}
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
