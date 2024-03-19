## worker_threads
worker_threads 是 Node.js 中的一个模块，用于创建多线程的工作线程。在 Node.js 中，JavaScript 是单线程的，这意味着它在执行代码时只能使用一个 CPU 核心。但是，有时候需要执行一些耗时的任务，这时候就可以使用 worker_threads 模块创建额外的线程，使得这些任务可以在单独的线程中并行执行，从而提高应用程序的性能和响应性。

worker_threads 模块允许你创建新的 Node.js 工作线程，并通过线程间的消息传递进行通信。每个工作线程都有自己的事件循环，可以执行 JavaScript 代码，但是它们在独立的线程中运行，不会阻塞主线程。

使用 worker_threads 模块可以创建多个工作线程，这些线程可以同时执行 CPU 密集型任务或 I/O 密集型任务。这对于处理大量并发请求或执行长时间运行的计算任务非常有用，而不会阻塞主应用程序的事件循环。

## 在 Node.js 中，主线程和工作线程是指在不同上下文中执行的线程，它们有一些重要的区别：
1. 主线程：
    * 在 Node.js 应用程序启动时创建。
    * 负责执行 JavaScript 代码，并且是应用程序的入口点。
    * 主线程负责管理事件循环，处理 I/O 操作，执行代码以及与工作线程之间的通信。
    * 只有一个主线程。
2. 工作线程：
    * 使用 worker_threads 模块创建，每个工作线程都在自己的线程中执行 JavaScript 代码。
    * 用于执行 CPU 密集型任务或 I/O 密集型任务，以提高应用程序的性能和响应性。
    * 每个工作线程都有自己的事件循环，独立于主线程。
    * 可以创建多个工作线程，每个工作线程都可以并行执行任务。

主线程和工作线程的一些重要区别包括：
* 主线程是应用程序的入口点，而工作线程是为执行特定任务而创建的额外线程。
* 主线程负责管理整个应用程序的事件循环和主要逻辑，而工作线程负责执行特定任务，并且在执行过程中不会阻塞主线程。
* 主线程和工作线程之间通过消息传递进行通信，工作线程可以向主线程发送消息，主线程也可以向工作线程发送消息，以便在它们之间交换数据或命令。

总的来说，主线程是应用程序的核心，而工作线程是为了提高性能而创建的辅助线程，用于执行一些耗时的任务，同时保持主线程的响应性。

## 例子
当使用 worker_threads 模块时，你可以将需要在工作线程中执行的代码作为字符串传递给工作线程，并通过消息传递机制将结果返回给主线程。
```js
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    // 主线程

    // 定义要在工作线程中执行的代码
    const code = `console.log('hello world')`;

    // 创建工作线程
    const worker = new Worker(__filename, {
        workerData: { code }
    });

    // 接收工作线程的消息
    worker.on('message', (result) => {
        console.log('Received from worker:', result);
    });
} else {
    // 工作线程

    // 执行传递给工作线程的代码
    const result = eval(workerData.code);

    // 将结果发送回主线程
    parentPort.postMessage(result);
}
```