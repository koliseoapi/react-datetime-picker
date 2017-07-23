# react-moment-datetime 

React datetime picker powered by [momentjs](http://momentjs.com). See the [demo here](http://koliseoapi.github.io/react-moment-datetime).

### Usage

``` javascript
<DateTimeInput
  moment={this.state.moment}
  onChange={this.handleChange}
  onClose={this.handleClose}
  isValid={() => true} // default
/>
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

