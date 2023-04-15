function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
const fetchData = data = > new Promise(resolve = > setTimeout(resolve, 1000, data + 1));
const fetchValue =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(function* () {
      var value1 = yield fetchData(1);
      var value2 = yield fetchData(value1);
      var value3 = yield fetchData(value2);
      console.log(value3);
    });
    return function fetchValue() {
      return _ref.apply(this, arguments);
    };
  }();
fetchValue();