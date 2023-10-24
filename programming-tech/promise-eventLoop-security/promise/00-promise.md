## 订阅一件事，当这件事发生的时候，触发对应的函数
当在executor中执行resolve或者reject的时候, 此时是异步操作，会先执行then/catch等，当主栈完成后，才会去调用resolve/reject中存放的方法执行:

promise 内部基于发布订阅的,传入fn()
```js
new Promise((resolve, reject) => {
  resolve('fulfilled')
}).then(console.log) // => 'fulfilled'
```

```js
new Promise(fn).then(onFulfilled, onRejected);
```

订阅者（then）把订阅的事件 (console.log) 注册到调度中心（Promise）

当发布者（resolve, reject）发布该事件到调度中心，该事件触发时由调度中心统一调度订阅者注册到调度中心的处理代码, 输出 ‘fulfilled’。

fn里面的异步操作没结束,status还是PENDING，这怎么办呢，这时候我们肯定不能立即调onFulfilled或者onRejected的，因为fn到底成功还是失败还不知道呢。

那什么时候知道fn成功还是失败呢？答案是fn里面主动调resolve或者reject的时候。所以如果这时候status状态还是PENDING，我们应该将onFulfilled和onRejected两个回调存起来，等到fn有了结论，resolve或者reject的时候再来调用对应的代码。因为后面then还有链式调用，会有多个onFulfilled和onRejected，我这里用两个数组将他们存起来，等resolve或者reject的时候将数组里面的全部方法拿出来执行一遍：
```js
// 构造函数
function MyPromise(fn) {
  // 构造函数里面添加两个数组存储成功和失败的回调
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  function resolve(value) {
    if(that.status === PENDING) {
      // ...省略其他代码...
      // resolve里面将所有成功的回调拿出来执行
      that.onFulfilledCallbacks.forEach(callback => {
        callback(that.value);
      });
    }
  }

  function reject(reason) {
    if(that.status === PENDING) {
      // ...省略其他代码...
      // resolve里面将所有失败的回调拿出来执行
      that.onRejectedCallbacks.forEach(callback => {
        callback(that.reason);
      });
    }
  }
}

// then方法
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  // ...省略其他代码...

  // 如果还是PENDING状态，将回调保存下来
  if(this.status === PENDING) {
    this.onFulfilledCallbacks.push(realOnFulfilled);
    this.onRejectedCallbacks.push(realOnRejected);
  }
}
```
订阅发布模式:暂时将回调保存下来，等条件满足的时候再拿出来运行让。

事件中心注册事件:回调数组里面push回调函数

resolve就相当于发布了一个`成功`事件，所有注册了的事件，即`onFulfilledCallbacks`里面的所有方法都会拿出来执行;

reject就相当于发布了一个`失败`事件
