---
title: es6-3-async
sidebar_position: 15
---

async用于定义一个异步函数，该函数返回一个Promise。

如果async函数返回的是一个同步的值，这个值将被包装成一个理解resolve的Promise，等同于return Promise.resolve(value)。

await用于一个异步操作之前，表示要“等待”这个异步操作的返回值。await也可以用于一个同步的值。

```js
//async await
//返回Promise
let timer = async function timer() {
    return new Promise((reslove, reject) => {
        setTimeout(() => {
            reslove('a');
        }, 1000);
    })
}
timer().then(result => {
    console.log(result);
}).catch(err => {
    console.log(err.message);
})

//返回同步的值
let sayHello = async function sayHello() {
    let hi = 'hello world'//等同于return Promise.resolve(hi);
    return hi
}
sayHello().then(res => {
    console.log(res)
}).catch(err => {
    console.log(err.message);
})
```


## 对异常的处理
## promise 对异常的处理
```js
// 1.使用reject
let promise = new Promise((reslove, reject) => {
  setTimeout(() => {
    reject('promise使用reject抛出异常')  
  }, 1000)
})
promise().then(res => {
  console.log(res)
})
.catch(err => {
  console.log(err)     //'promise使用reject抛出异常'
})

// 2.使用new Error() 
let promise = new Promise((reslove, reject) => {
    throw new Error('promise使用Error抛出异常') //使用throw异常不支持放在定时器中
})
promise().then(res => {
  console.log(res)
})
.catch(err => {
  console.log(err.message)     //'promise使用Error抛出异常'
})

// 3.reject一个new Error()
let promise = new Promise((resolve, reject) => {

    setTimeout(() => {
        reject(new Error('promise抛出异常'));
    }, 1000);
})

promise.then(res => {
    console.log(res);
})
.catch(err => {
    console.log(err.message);  //'promise抛出异常'
})
```

## async对异常的处理也可以直接用.catch()捕捉到
```js
// async抛出异常
let sayHi = async sayHi => {
        throw new Error('async抛出异常');
}
sayHi().then(res => {
    console.log(res);
})
.catch(err => {
    console.log(err.message);
})
```

## 与Generator的关系
```js
/*
虽然Generator将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）。
*/
function* getList() {
    const c = yield count()
    const l = yield list()
    return 'end'
}
var gl = getList()
console.log(gl.next()) // {value: Promise, done: false}
console.log(gl.next()) // {value: Promise, done: false}
console.log(gl.next()) // {value: 'end', done: true}

// 此时，我们便希望能出现一种能自动执行Generator函数的方法。我们的主角来了：async/await。 它就是Generator函数的语法糖。
let getList = async () => {
  const c = await count()
  const l = await list()
}
```
