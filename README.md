# react-datetime-picker

[![Build Status](https://secure.travis-ci.org/koliseoapi/react-datetime-picker.svg?branch=master)](http://travis-ci.org/koliseoapi/react-datetime-picker)
[![Coverage Status](https://img.shields.io/coveralls/koliseoapi/react-datetime-picker.svg?style=flat)](https://coveralls.io/r/koliseoapi/react-datetime-picker)

<!--
<a href="https://www.npmjs.com/package/react-datetime-picker"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/react-datetime-picker.svg?maxAge=43200"></a>
-->

React datetime picker. See the [demo here](http://koliseoapi.github.io/react-datetime-picker).

### Usage

```javascript
<DateTimeInput
  value={this.state.date}
  onChange={this.onChange}
  showTime={true}
/>
```

Available properties:

| Property | Type       | Content                                                                                                                                    | Default Value            |
| -------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| i18n     | `JSON`     | Entries to render i18n content                                                                                                             | See below for an example |
| showTime | `boolean`  | True to display a separate input field for the time                                                                                        | `true`                   |
| value    | `Date`     | The current value                                                                                                                          | `undefined`              |
| isValid  | `function` | A function that receives a date and returns true if the date is valid input. Can be used to set a maximum or minimum value in the calendar | `(date) => true`         |
| onChange | `function` | A function that will receive the value when the user introduces a valid date. Receives a JSON with `name`, `value` and `strValue`.         | `undefined`              |

The default value of `i18n` is:

```js
{
  Close: 'Close',
  format: 'yyyy-MM-dd',

  // Monday-indexed weekdays
  weekDays: 'MonTueWedThuFriSatSun'
}
```

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

**NOTICE** The removal of the dependency with Moment.js introduced breaking changes. The current format requires former `DD` and `YYYY` to be lowercase. `isValid()` also receives an instance of `Date` instead of `Moment`

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

### License and acknowledgements

Licensed under the MIT license

`react-datetime-picker` is based on [input-moment](https://github.com/wangzuo/input-moment) by Wang Zuo.
