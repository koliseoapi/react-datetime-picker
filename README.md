# react-moment-datetime 

[![Build Status](https://secure.travis-ci.org/koliseoapi/react-moment-datetime.svg?branch=master)](http://travis-ci.org/koliseoapi/react-moment-datetime)
[![Coverage Status](https://img.shields.io/coveralls/koliseoapi/react-moment-datetime.svg?style=flat)](https://coveralls.io/r/koliseoapi/react-moment-datetime)
<a href="https://www.npmjs.com/package/react-moment-datetime"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/react-moment-datetime.svg?maxAge=43200"></a>

React datetime picker powered by [momentjs](http://momentjs.com). See the [demo here](http://koliseoapi.github.io/react-moment-datetime).

### Usage

``` javascript
<DateTimeInput
  value={this.state.date}
  onChange={this.onChange}
  showTime={true}
/>
```

Available properties:

| Property | Type | Content  | Default Value |
| --- | --- | --- | --- |
| `i8n` | JSON | Entries to render i18n content | See below for an example
| `showTime` | boolean | True to display a separate input field for the time | `true`
| `value` | Date | The current value | `undefined`
| `isValid` | function | A function that receives a date and returns true if the date is valid input. Can be used to set a maximum or minimum value in the calendar | `(moment) => true`
| `onChange` | function | A function that will receive the value when the user introduces a valid date. Receives a JSON of `name`, `value` and `strValue` | `undefined`

The default value of `i18n`:

```js
{
  Date: 'Date',
  Time: 'Time',
  Close: 'Close',
  Hours: 'Hours',
  Minutes: 'Minutes',

  // date format
  format: 'YYYY-MM-DD',

  // locale ISO
  locale: 'en'
}
```

Check [app.js](https://github.com/koliseoapi/react-moment-datetime/blob/master/example/app.js) for a working example.

### Development

Work on the code:

```sh
npm install
npm start
xdg-open http://localhost:8080/example/
```

Work on the demo:

```sh
./publish.sh
```

### License and acknowledgements

Licensed under the MIT license

`react-moment-datetime` is based on the great job by Wang Zuo, the author of [input-moment](https://github.com/wangzuo/input-moment)

Design inspired in https://dribbble.com/shots/1439965-Due-Date-and-Time-Picker.

