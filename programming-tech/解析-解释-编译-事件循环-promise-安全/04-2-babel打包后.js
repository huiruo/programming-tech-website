(function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++)s(r[o]); return s })({
  1: [function (require, module, exports) {
    'use strict';

    var _lib = require('./lib.js.js');

    var _lib2 = _interopRequireDefault(_lib);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    if (window && window.alert) {
      alert(_lib2.default);
    } else {
      console.log(_lib2.default);
    }

  }, { "./lib.js": 2 }], 2: [function (require, module, exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _classCallCheck = require('babel-runtime/helpers/classCallCheck');

    var _classCallCheck2 = _interopRequireDefault(_classCallCheck);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = 'hello, world';

  }, { "babel-runtime/helpers/classCallCheck": 3 }], 3: [function (require, module, exports) {
    "use strict";

    exports.__esModule = true;

    exports.default = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };
  }, {}]
}, {}, [1]);