## 实现原理

Promise 是一种用于处理异步操作的编程模式，它的实现原理涉及到 JavaScript 的事件循环、回调函数和状态管理。

Promise 的基本实现原理。它提供了一种更清晰、可读性更好的方式来处理异步操作，避免了深层嵌套的回调函数。当然，实际的 Promise 实现可能更复杂，包括处理异步任务队列、微任务队列等细节。

1. Promise 的状态：
   - Promise 有三种状态：Pending（进行中）、Fulfilled（已完成）、Rejected（已拒绝）。
   - 初始状态是 Pending，可以转为 Fulfilled 或 Rejected。
2. Executor 函数：
   - 当创建一个 Promise 时，你需要传入一个带有两个参数的 Executor 函数，通常是一个回调函数。Executor 函数会在 Promise 被创建时立即执行。
   - Executor 函数接受两个参数，通常被命名为 resolve 和 reject，用于改变 Promise 的状态。
   - 如果异步操作成功，调用 resolve 并传递异步操作的结果。
   - 如果异步操作失败，调用 reject 并传递错误信息。
3. Then 方法：
   - Promise 对象上有一个 then 方法，可以通过它来注册两个回调函数，分别处理成功状态和失败状态。
   - then 方法接受两个参数，通常被称为 onFulfilled 和 onRejected，分别是成功状态和失败状态的回调函数。
   - 如果 Promise 的状态是 Fulfilled，将会调用 onFulfilled 回调函数。
   - 如果 Promise 的状态是 Rejected，将会调用 onRejected 回调函数。
4. 状态变迁：
   - 一旦状态从 Pending 转变为 Fulfilled 或 Rejected，就不可再次改变。
   - 当状态改变时，Promise 将调用相应的回调函数，执行后续操作。
5. 链式调用：
   - Promise 支持链式调用，通过 then 方法返回一个新的 Promise 对象。
   - 这允许你在多个异步操作之间形成有序的操作链，每个操作都基于前一个操作的结果。

### 简单的 Promise 使用示例：
这个示例创建了一个 Promise 对象，使用 then 方法注册了成功和失败的回调函数。一旦异步操作完成，Promise 的状态将会改变，然后适当的回调函数将会被调用。

```js
const myPromise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const randomNumber = Math.random();
    if (randomNumber < 0.5) {
      resolve(randomNumber);
    } else {
      reject("Error: Random number is too large.");
    }
  }, 1000);
});

myPromise
  .then((result) => {
    console.log("Fulfilled: " + result);
  })
  .catch((error) => {
    console.error("Rejected: " + error);
  });
```

### 实现简单promise
```js
class MyPromise {
  constructor(executor) {
    // 初始状态为 Pending
    this.status = 'Pending';
    // 存储成功状态的值
    this.value = undefined;
    // 存储失败状态的原因
    this.reason = undefined;

    // 定义 resolve 函数，用于将 Promise 状态转为 Fulfilled
    const resolve = (value) => {
      // 只有在状态为 Pending 时才能改变状态
      if (this.status === 'Pending') {
        this.status = 'Fulfilled';
        this.value = value;
      }
    };

    // 定义 reject 函数，用于将 Promise 状态转为 Rejected
    const reject = (reason) => {
      // 只有在状态为 Pending 时才能改变状态
      if (this.status === 'Pending') {
        this.status = 'Rejected';
        this.reason = reason;
      }
    };

    // 执行传入的 executor 函数，并传入 resolve 和 reject
    try {
      executor(resolve, reject);
    } catch (error) {
      // 如果执行 executor 函数抛出异常，则将状态转为 Rejected
      reject(error);
    }
  }

  // 定义 then 方法，用于注册成功和失败的回调函数
  then(onFulfilled, onRejected) {
    if (this.status === 'Fulfilled') {
      // 如果当前状态为 Fulfilled，则调用成功回调函数
      onFulfilled(this.value);
    } else if (this.status === 'Rejected') {
      // 如果当前状态为 Rejected，则调用失败回调函数
      onRejected(this.reason);
    }
  }
}

// 示例用法
const myPromise = new MyPromise((resolve, reject) => {
  // 模拟异步操作
  setTimeout(() => {
    const randomNumber = Math.random();
    if (randomNumber < 0.5) {
      resolve(randomNumber);
    } else {
      reject("Error: Random number is too large.");
    }
  }, 1000);
});

myPromise.then(
  (result) => {
    console.log("Fulfilled: " + result);
  },
  (error) => {
    console.error("Rejected: " + error);
  }
);
```