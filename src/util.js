export function bindAll(_this, methods) {
  
  methods.forEach(method => {
    _this[method] = _this[method].bind(_this)
  });

}