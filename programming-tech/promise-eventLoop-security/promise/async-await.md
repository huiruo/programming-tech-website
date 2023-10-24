## async
* 函数前面使用async关键字，这个函数就会返回一个promise
* 如果返回的不是一个promise，JavaScript也会自动把这个值"包装"成Promise的resolve值。

返回一个promise
```js
async function fn() {
    return new Promise(resolve => {
        setTimeout(function(){
            resolve('hello world');
        }, 1000);
    });
}

fn().then(res => {
    console.log(res); // hello world
});

let test1 = Object.prototype.toString.call(fn) === '[object AsyncFunction]';
let test2 = Object.prototype.toString.call(fn()) === '[object Promise]';
console.log({test1,test2}) // true,true
```

返回一个非promise
```js
async function fn() {
    return 2;
}
const test = fn(); 

console.log(test); // Promise {<resolved>: 2}

fn().then(res => {
    console.log(res); // 2
})
```

## await
await 操作符用于等待一个Promise 对象。只能在异步函数async function使用;

当代码执行到await语句时，会暂停执行，直到await后面的promise正常处理。

这和我们之前讲到的generator一样，可以让代码在某个地方中断。只不过，在generator中，我们需要手动写代码去执行generator，而await则是像一个自带执行器的generator。

可以理解为：await就是generator的语法糖



await 表达式会暂停当前 async function 的执行，等待 Promise 处理完成。若 Promise 正常处理(fulfilled)，其回调的resolve函数参数作为 await 表达式的值，继续执行 async function。若 Promise 处理异常(rejected)，await 表达式会把 Promise 的异常原因抛出。另外，如果 await 操作符后的表达式的值不是一个 Promise，则返回该值本身。
```js
const promiseTest = function() {
    return new Promise(resolve => {
        setTimeout(function(){
            resolve(1);
        }, 1000);
    });
};

const fn = async function() {
    const res = await promiseTest();
    console.log(res); 
    const res2 = await 2;
    console.log(res2);
};

fn();
```


把await放在try catch中捕获错误
```js
const promiseTest = function() {
    return new Promise(resolve => {
        console.log(test);
        resolve();
    });
};

const fn = async function() {
    try {
        await promiseTest();
    } catch (e) {
        console.log(e); // test is not defined
    }
};

fn();
```

## 任务队列

js中的队列其实就是一个数组。

### 同步任务队列
任务队列中的函数都是同步函数。这种情况比较简单，我们可以采用reduce很方便的遍历。
```js
const fn1 = function(i) {
    return i + 1;
};
const fn2 = function(i) {
    return i * 2;
};
const fn3 = function(i) {
    return i * 100;
};
const taskList = [fn1, fn2, fn3];
let a = 1;
const res = taskList.reduce((sum, fn) => {
    sum = fn(sum);
    return sum;
}, a); 

console.log(res); // 400
```

### 任务队列中
任务队列中的函数都是异步函数。这里，我们假设所有的函数都是以Promise的形式封装的。现在，需要依次执行队列中的函数。假设异步任务队列如下：
```js
const fn1 = function() {
    return new Promise( resolve => {
        setTimeout(function(){
            console.log('fn1');
            resolve();
        }, 2000);
    });
};
const fn2 = function() {
    return new Promise( resolve => {
        setTimeout(function(){
            console.log('fn2');
            resolve();
        }, 1000);
    });
};
const fn3 = function() {
    console.log('fn3');
    return Promise.resolve(1);
};
const taskList = [fn1, fn2, fn3];
```

可以使用正常的for循环或者for...of... 来遍历数组，并且使用async await来执行代码:
```js
// for循环
(async function(){
    for(let i = 0; i < taskList.length; i++) {
        await taskList[i]();
    }
})();

// for..of..
(async function(){
    for(let fn of taskList) {
    	await fn();
	}
})();
```

## promise和async/await区别
### 错误处理
1. Promise使用catch()方法处理失败状态下的结果
2. async/await 中，使用 try/catch 语句来处理异步操作的错误

```js
// Promise 的错误处理
function example() {
  return somePromise()
    .then(result => {
      console.log(result)
    })
    .catch(error => {
      console.error(error)
    })
}

// async/await 的错误处理
async function example() {
  try {
    const result = await somePromise()
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}
```

### 执行顺序
1. Promise链式调用`.then()`方法来处理多个异步操作的结果，从而形成一条执行链。但是，这种方法有时会导致代码难以阅读和维护。
2. async/await 中，使用更加直观的同步代码形式来处理异步操作。async/await 中的异步操作会被自动转换为 Promise 对象,从而可以使用 Promise 的链式调用方法。
```js
// Promise 的链式调用
function example() {
  return somePromise1()
    .then(result1 => {
      return somePromise2(result1)
    })
    .then(result2 => {
      console.log(result2)
    })
}

// async/await 的同步代码形式
async function example() {
  const result1 = await somePromise1()
  const result2 = await somePromise2(result1)
  console.log(result2)
}
```

## 生成器+promise=async function
Async/Await就是一个自执行的generate函数

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