# react-moment-datetime 

React datetime picker powered by [momentjs](http://momentjs.com)

The design is from https://dribbble.com/shots/1439965-Due-Date-and-Time-Picker.

### Installation
``` sh
npm i react-moment-datetime --save
```

**Notice:** This module requires [moment](https://www.npmjs.com/package/moment).

### Demo
http://ccoloma.github.io/react-moment-datetime

### Usage
``` javascript
<DateTimeInput
  moment={this.state.moment}
  onChange={this.handleChange}
  onClose={this.handleClose}
  isValid={() => true} // default
/>
```
Check [app.js](https://github.com/ccoloma/react-moment-datetime/blob/master/test/app.js) for a working example.

### Development
- npm install
- npm start
- http://localhost:8080/test/

### License

Licensed under the MIT license

react-moment-datetime is based on the great job by Wang Zuo, the author of [input-moment](https://github.com/wangzuo/input-moment)
