---
title: promise基础
sidebar_position: 1
---

## 1.Promise一般是包在一个函数中，在需要的时候去运行这个函数
Promise的构造函数接收一个参数，是函数，并且传入两个参数：resolve，reject，分别表示异步操作执行成功后的回调函数和

promise有三个状态：
1. pending[待定]初始状态
2. fulfilled[实现]操作成功
3. rejected[被否决]操作失败
当promise状态发生改变，就会触发then()里的响应函数处理后续步骤；

Promise上还有then方法，then 方法就是用来指定Promise 对象的状态改变时确定执行的操作，resolve 时执行第一个函数（onFulfilled），reject时执行第二个函数（onRejected）

```js
function getNumber() {
  const p = new Promise(function (resolve, reject) {
    // 做一些异步操作
    setTimeout(function () {
      const num = Math.ceil(Math.random() * 10); //生成1-10的随机数
      if (num <= 5) {
        resolve(num);
      }
      else {
        reject('数字太大了');
      }
    }, 2000);
  });
  return p;
}

getNumber().then(
  function (data) {
    console.log('resolved');
    console.log(data);
  },
  function (reason, data) {
    console.log('rejected');
    console.log(reason);
  }
);
```

## promise 和await
await 在等什么？
一句话概括： await等的是右侧「表达式」的结果


## 04.链式操作的用法
> 从表面上看，Promise只是能够简化层层回调的写法，而实质上，Promise的精髓是“状态”，用维护状态、传递状态的方式来使得回调函数能够及时调用，它比传递callback函数要简单、灵活的多。所以使用Promise的正确场景是这样的：

promise链式调用：因为then()方法内部返回了一个Promise实例，而返回的这个Promise实例在继续调用了第二个then()方法。并且第二个then的resolve回调的参数，是上一个then的resolve回调函数的返回值。
```js
new Promise((resolve, reject) => {
    resolve(123)
}).then((res) => {
    console.log(res)
    return 456
}).then((res) => {
    console.log(res)
    return 789
}).then((res) => {
    console.log(res)
})
/*
123
456
789
*/
```

```js
function runAsync1(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务1执行完成');
            resolve('随便什么数据1');
        }, 1000);
    });
    return p;            
}
function runAsync2(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务2执行完成');
            resolve('随便什么数据2');
        }, 2000);
    });
    return p;            
}
function runAsync3(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务3执行完成');
            resolve('随便什么数据3');
        }, 2000);
    });
    return p;            
}

runAsync1()
.then(function(data){
    console.log(data);
    return runAsync2();
})
.then(function(data){
    console.log(data);
    return runAsync3();
})
.then(function(data){
    console.log(data);
});
这样能够按顺序，每隔两秒输出每个异步回调中的内容，在runAsync2中传给resolve的数据，能在接下来的then方法中拿到.
```

## promise方法
### Promise.resolve(value)
返回一个解决的 Promise 对象，其状态为已完成（fulfilled），并且带有给定的值。
```js
Promise.resolve("Hello, world").then(result => {
  console.log(result); // 输出 "Hello, world"
});
```

### Promise.reject(reason)
返回一个拒绝的 Promise 对象，其状态为已拒绝（rejected），并且带有给定的拒绝原因。
```js
Promise.reject(new Error("Something went wrong")).catch(error => {
  console.error(error); // 输出错误信息
});
```

### Promise.allSettled(iterable)
>返回一个 Promise，该 Promise 在可迭代对象中的所有 Promise 都已解决（无论是成功还是失败）后才解决，并提供每个 Promise 的解决状态和值。

使用场景：上传的时候知道几个成功几个失败
```js
const promise1 = Promise.resolve(1);
const promise2 = Promise.reject(new Error("Rejected"));
const promise3 = Promise.resolve(3);

Promise.allSettled([promise1, promise2, promise3]).then(results => {
  console.log(results);
  // 输出: [{status: "fulfilled", value: 1}, {status: "rejected", reason: Error: "Rejected"}, {status: "fulfilled", value: 3}]
});
```

### promise all
```js
function test(val){
	return new Promise((resolve,reject)=>{
    setTimeout(() => {
	   let res=Math.random()+1
	   if(res<1.5){
	       resolve('<0.5')
	   }else{
	       reject('>0.5')
	   }
      	resolve(res)
    }, 1000);
 })
}

Promise.all([test(1),test(2)]).then((x)=>{console.log(x)},(y)=>{console.log(y)})
```

### Promise.prototype
>`Promise.prototype.then(onFulfilled, onRejected)`：添加解决（fulfilled）和拒绝（rejected）时的回调函数。

```js
const promise = new Promise(resolve => {
  setTimeout(() => resolve("Success!"), 1000);
});

promise.then(result => {
  console.log(result); // 输出 "Success!"
});
```

>`Promise.prototype.catch(onRejected)`：添加拒绝时的回调函数，用于处理 Promise 拒绝时的情况。

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error("Something went wrong")), 1000);
});

promise.catch(error => {
  console.error(error); // 输出错误信息
});
```

>`Promise.prototype.finally(onFinally)`

添加一个回调函数，无论 Promise 是否解决或拒绝，都会执行。这在需要执行清理操作时非常有用。
```js
const promise = new Promise(resolve => {
  setTimeout(() => resolve("Success!"), 1000);
});

promise.finally(() => {
  console.log("Finally block executed."); // 无论如何都会执行
});
```

### Promise.race(iterable)
>返回一个 Promise，该 Promise 在可迭代对象中的任何一个 Promise 解决或拒绝时就解决或拒绝。
```js
const promise1 = new Promise(resolve => setTimeout(resolve, 100, 'first'));
const promise2 = new Promise(resolve => setTimeout(resolve, 200, 'second'));

Promise.race([promise1, promise2]).then(value => {
  console.log(value); // 输出 "first"，因为它解决得更快
});
```