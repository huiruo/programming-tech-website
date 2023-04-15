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

## promise all
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
