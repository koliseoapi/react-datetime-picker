# react-datetime-picker

[![Build Status](https://secure.travis-ci.org/koliseoapi/react-datetime-picker.svg?branch=master)](http://travis-ci.org/koliseoapi/react-datetime-picker)
[![Coverage Status](https://coveralls.io/repos/github/koliseoapi/react-moment-datetime/badge.svg?branch=master)](https://coveralls.io/github/koliseoapi/react-moment-datetime?branch=master)
<a href="https://www.npmjs.com/package/@koliseoapi/react-datetime-picker"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@koliseoapi/react-datetime-picker.svg?maxAge=43200"></a>

React datetime picker, based on date-fns. See the [demo here](http://koliseoapi.github.io/react-datetime-picker).

### Usage

```javascript
<DateTimeInput
  value={this.state.date}
  onChange={this.onChange}
  showTime={true}
/>
```

## Available properties:

| Property | Type       | Content                                                                                                                     | Default Value      |
| -------- | ---------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| format   | `String`   | The [date format](https://date-fns.org/v2.8.1/docs/parse) to use                                                            | "yyyy-MM-dd"       |
| showTime | `boolean`  | True to display a separate input field for the time                                                                         | `true`             |
| value    | `Date`     | The current value                                                                                                           | `undefined`        |
| isValid  | `function` | A function that returns true if a date is considered valid. Can be used to set a maximum or minimum value in the calendar   | `(date) => true`   |
| onChange | `function` | A function that will be invoked when the user introduces a valid date. Receives a JSON with `name`, `value` and `strValue`. | `undefined`        |
| locale   | `Object`   | A [date-fns locale](https://date-fns.org/v2.8.1/docs/I18n) to language-specific date fields                                 | `en_US`            |
| i18n     | `Object`   | Entries to render a language-specific UI                                                                                    | `{Close: 'Close'}` |

Any other attributes will be forwarded to the date input field:

```javascript
<label htmlFor="startDate">Start Date</label>
<DateTimeInput
  id="startDate"
  placeholder="dd/mm/yyyy"
  aria-label="Please introduce a start date"
/>
```

Check [app.js](https://github.com/koliseoapi/react-datetime-picker/blob/master/example/app.js) for a working example.

### Development

Work on the code:

```sh
npm i
npm run watch
xdg-open http://localhost:8080/example/
```

Work on the demo:

```sh
./publish.sh
```

## Breaking changes

A previous version of this library was based on [moment.js](https://momentjs.com/). We replaced this dependency with the more lightweight [date-fns](https://date-fns.org/), which introduced the following breaking changes in react-datetime-input version 1.0.0:

- The current `format` requires `dd` and `yyyy` to be lowercase (previously: uppercase).
- `isValid()` now receives an instance of `Date` (previously: instance of `Moment`)
- The locale being passed is now a [date-fns locale](https://date-fns.org/v2.8.1/docs/I18n) (previously: using Moment locale).

## License and acknowledgements

Licensed under the MIT license

`react-datetime-picker` is based on [input-moment](https://github.com/wangzuo/input-moment) by Wang Zuo.
