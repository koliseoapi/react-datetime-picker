export function bindAll(_this, methods) {
  
  methods.forEach(method => {
    _this[method] = _this[method].bind(_this)
  });

}

// transform a date format to a regex pattern
export function dateFormatToPattern(dateFormat) {
  return dateFormat.
    replace(/yyyy/i, '[0-9]{4}').
    replace(/mm/i, '[01]?[0-9]').
    replace(/dd/i, '[0-3]?[0-9]')
    ;
}

// equivalent to lodash.range()
// https://www.reindex.io/blog/you-might-not-need-underscore/
export function range(start, end) {
  return Array.from(Array(end - start), (_, i) => start + i)
}

// replace lodash.chunk()
// https://stackoverflow.com/questions/8495687/split-array-into-chunks
export function chunk(array, chunk) {
  var i, j, result = [];
  for (i = 0, j = array.length; i < j; i += chunk) {
    result.push(array.slice(i, i + chunk));
  }
  return result;
}

