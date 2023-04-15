
## 生成器+promise=async function

测试方式1：[es6-to-es5-本地测试](https://github.com/huiruo/es6-to-es5)

测试方式2：
[babeljs.io](https://babeljs.io/repl)

比如：`@babel/plugin-transform-arrow-functions`；码中的所有箭头函数（arrow functions）都将被转换为 ES5 兼容的函数表达式了


## 转化成es5
[babeljs.io](https://babeljs.io/repl)
`@babel/plugin-transform-regenerator`:将async转化为es5
```js
async function async1 () {
    await testFn()
    console.log('A')
}
function testFn(){
  return new Promise((resolve, reject) => {
        resolve()
    })
}
async1()

|
|
V
// 省略包...
function async1() {
  return _regeneratorRuntime().async(function async1$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return _regeneratorRuntime().awrap(testFn());
      case 2:
        console.log('A');
      case 3:
      case "end":
        return _context.stop();
    }
  }, null, null, null, Promise);
}
function testFn() {
  return new Promise((resolve, reject) => {
    resolve();
  });
}
async1();
```

## 转化成yield
[babeljs.io](https://babeljs.io/repl)
配置好plugins:`plugin-transform-async-to-generator`
### 转化前
```js
async function async1 () {
    await testFn()
    console.log('A')
}
function testFn(){
  return new Promise((resolve, reject) => {
        resolve()
    })
}
async1()
```

### 转化后
```js
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
function async1() {
  return _async.apply(this, arguments);
}
function _async() {
  _async = _asyncToGenerator(function* () {
    yield testFn();
    console.log('A');
  });
  return _async.apply(this, arguments);
}
function testFn() {
  return new Promise((resolve, reject) => {
    resolve();
  });
}
async1();
```

### 例子2
[babeljs.io](https://babeljs.io/repl)
`plugin-transform-runtime`
```js
const fetchData = (data) => new Promise((resolve) => setTimeout(resolve, 1000, data + 1))

const fetchValue = async function () {
    var value1 = await fetchData(1);
    var value2 = await fetchData(value1);
    var value3 = await fetchData(value2);
    console.log(value3)
};

fetchValue();
```

```js
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
```