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
