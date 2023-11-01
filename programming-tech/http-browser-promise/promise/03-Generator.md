---
title: Generator
sidebar_position: 2
---

## 协程
一个进程可以有多个线程，一个线程可以有多个协程，但是一个线程同时只能有一个协程在运行。

这个意思就是说如果当前协程可以执行，比如同步代码，那就执行它，如果当前协程暂时不能继续执行，比如他是一个异步读文件的操作，那就将它挂起，然后去执行其他协程，等这个协程结果回来了，可以继续了再来执行它。

* yield其实就相当于将当前任务挂起了，下次调用再从这里开始。

* 迭代器需要手动调next才能一条一条执行yield

* next的返回值是{value, done}，value是yield后面表达式的值


## async/await是Generator和自动执行器的语法糖，写法和实现原理都类似co模块的promise模式
Generator自己不能自动执行，要自动执行需要引入其他方案，前面讲thunk的时候提供了一种方案，co模块也是一个很受欢迎的自动执行方案

>思路：先写一个局部的方法，这个方法会去调用gen.next，同时这个方法本身又会传到回调函数或者promise的成功分支里面，异步结束后又继续调用这个局部方法，这个局部方法又调用gen.next，这样一直迭代，直到迭代器执行完毕。

## Generator基本应用
### 生成器函数运行后会返回一个迭代器对象，即iterator
```js
function* testFn() {
  yield 1;
  yield 2;
  yield 3;
  return 4;
}
const fn = testFn()
console.log('1-',fn.next())
console.log('2-',fn.next())
console.log('3-',fn.next())
console.log('4-',fn.next())
```

### 关于传参
next里面的参数给到了上一次yield的执行结果

迭代器还有个return方法，这个方法会直接终止当前迭代器，将done置为true，这个方法的参数就是迭代器的value：
```js
function* testFn() {
  const test1 = yield 1;
  console.log("test1:",test1)
  const test2 = yield 2;
  const test3 = yield 3;
  return test3;
}
const fn = testFn()
console.log('1-',fn.next(21))
console.log('2-',fn.next(22))
console.log('3-',fn.next(23))
console.log('4-',fn.next(24))
console.log(fn);
```

### yield
实例中第一次调用next，值:10 + 5，即15，然后第二次调用next，其实就走到了yield*了，这其实就相当于调用了gen，然后执行他的第一个yield，值就是1。
```js
function* gen() {
  let a = yield 1;
  let b = yield a + 2;
}

function* gen2() {
  yield 10 + 5;
  yield* gen();
}

let iterator = gen2();
console.log('iterator2:',iterator.next()) // iterator2 {value: 15, done: false}

console.log('第二次调用next:',iterator.next()) // {value: 1, done: false}
```

## 异步三种写法: promise,Generator,async
需求：三个网络请求，请求3依赖请求2的结果，请求2依赖请求1;

### promise
```js
const request = require("request");

const request1 = function() {
  const promise = new Promise((resolve) => {
    request('https://www.baidu.com', function (error, response) {
      if (!error && response.statusCode == 200) {
        resolve('request1 success');
      }
    });
  });

  return promise;
}

const request2 = function() {
  const promise = new Promise((resolve) => {
    request('https://www.baidu.com', function (error, response) {
      if (!error && response.statusCode == 200) {
        resolve('request2 success');
      }
    });
  });

  return promise;
}

const request3 = function() {
  const promise = new Promise((resolve) => {
    request('https://www.baidu.com', function (error, response) {
      if (!error && response.statusCode == 200) {
        resolve('request3 success');
      }
    });
  });

  return promise;
}

request1().then((data) => {
  console.log(data);
  return request2();
})
.then((data) => {
  console.log(data);
  return request3();
})
.then((data) => {
  console.log(data);
})
```

### 使用Generator来解决“回调地狱”
参考：[Generator](http://dennisgo.cn/Articles/JavaScript/Generator.html)
```js
const request = require("request");

function* requestGen() {
  function sendRequest(url) {
    request(url, function (error, response) {
      if (!error && response.statusCode == 200) {
        console.log(response.body);

        // 注意这里，引用了外部的迭代器iterator
        iterator.next(response.body);
      }
    })
  }

  const url = 'https://www.baidu.com';

  // 使用yield发起三个请求，每个请求成功后再继续调next
  yield sendRequest(url);
  yield sendRequest(url);
  yield sendRequest(url);
}

const iterator = requestGen();

// 手动调第一个next
iterator.next();
```

### async写法
```js
const fetch = require('node-fetch');

async function sendRequest () {
  const r1 = await fetch('https://www.baidu.com');
  const r2 = await fetch('https://www.baidu.com');
  const r3 = await fetch('https://www.baidu.com');

  return {
    r1,
    r2,
    r3,
  }
}

sendRequest().then((res) => {
  console.log('res', res);
});
```