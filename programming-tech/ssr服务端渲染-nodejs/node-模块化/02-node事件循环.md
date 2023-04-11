每个阶段的含义：
```
1.timers 阶段：这个阶段执行 timer（setTimeout、setInterval）的回调
2.I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调
3.idle, prepare 阶段：仅 node 内部使用
4.poll 阶段：获取新的 I/O 事件, 适当的条件下 node 将阻塞在这里
5.check 阶段：执行 setImmediate() 的回调
6.close callbacks 阶段：执行 socket 的 close 事件回调

外部输入数据–>轮询阶段(poll)–>检查阶段(check)–>关闭事件回调阶段(close callback)–>定时器检测阶段(timer)–>I/O 事件回调阶段(I/O callbacks)–>闲置阶段(idle, prepare)–>轮询阶段
```



js是单线程运⾏，异步操作特别重要。只要⽤到引擎之外的功能，就需要跟外部交互，从⽽形成异步操作。
Node的异步语法⽐浏览器复杂，因为它可以跟内核对话，不得不搞了⼀个专门的库 libuv 做这件事。

这个库负责各种回调函数的执⾏时间，毕竟异步任务最后还是要回到主线程，⼀个个排队执⾏，这就是事件循环。

## 执行顺序
当个v8引擎将js代码解析后传入libuv引擎后，循环首先进入poll阶段，poll阶段相当于整体同步代码的解析，会生成一个执行栈，同时会把setImmediate的回调放入check队列，在setTimeout() 和 setInterval()定时到期后把其回调事件放入timers队列，
poll queue清空后，会转到check阶段，检查执行check队列，检查执行timer队列，之后进入到callbacks阶段，执行回调。check和timer两者的顺序是不固定的，受到代码运行的环境的影响。

总结：
poll轮询属于io观察者，process.nextTick()属于idle观察者, setImmediate()属于check观察者。

在每一轮循环检查中,idle观察者先于I/O观察者,I/O观察者先于check观察者.

第一次进入代码时，idle观察者不存在。

## Node中的process.nextTick()
process.nextTick()是node中一个特殊的队列，这些事件会在每一个阶段执行完毕准备进入下一个阶段时优先执行。也就是说process.nextTick()在阶段切换时执行。并且，不管其有多深的回调，都会被一次执行完毕。

## Promise
上面的阶段没有包括Promise，在node中，promise和浏览器中类似，执行在process.nextTick()之后，在setTimeout之前

## 形象化理解
固执的探险家(每个房间都要走到底)

所有的代码就像是已经设定好的迷宫，而引擎就是去探险的人，我们称为小呆。

小呆到达迷宫，已经有了地图，根据地图冒险。

迷宫有六个房间，分别是timer, i/ocallback, ide prepare(内部使用，已封闭), poll, check， close callback，

其中timer是虚拟现实房间，小呆随时可以看到里面的场景。

其他的每个房间又五个房间，有的开放，有的不开放。

探险规则：每次离开一个房间，都要检查有没有受伤（peocess.nextTick()）

小呆首先进入poll房间，开始探险（执行poll 队列），之后进入check房间，timer房间（随机），探险完之后出来，进入close callback，探险完之后，进入io/callback房间，最后完成探险，离开。

小呆说任务总算完成了。

## 定时器
```
为了协调异步任务，Node 提供了四个定时器，让任务可以在指定的时间运⾏：setTimeout、setInterval、setImmediate、process.nextTick。前两个是语⾔的标准，后两个是 Node 独有的。它们的写法差不多，作⽤也差不多，不太容易区别。
```

见实例文件test1
## 本轮循环和次轮循环
异步任务可以分成两种：
追加在本轮循环的异步任务、
追加在次轮循环的异步任务。
所谓 “循环”，指的是事件循环（event loop）。

这是 JavaScript 引擎处理异步任务的⽅式，本轮循环⼀定早于次轮循环执⾏即可。
Node 规定，process.nextTick 和 Promise 的回调函数，追加在本轮循环 即同步任务⼀旦执⾏完成，就开始执⾏它们。

⽽ setTimeout、setInterval、setImmediate 的回调函数，追加在次轮循环。这就是说，上段代码的第三⾏ 和第四⾏，⼀定 ⽐第⼀⾏和第⼆⾏更早执⾏

## process.nextTick()
process.nextTick 这个名字有点误导，它是在本轮循环执⾏的，⽽且是所有异步任务⾥⾯最快执⾏的。Node 执⾏完所有同步任务，接下 来就会执⾏ process.nextTick 的任务队列。
所以，下⾯这⾏代码是第⼆个输出结果。基本上，如果你希望异步任务尽可能快地执⾏，那就使⽤ process.nextTick。

## 、微任务
根据语⾔规定，Promise 对象的回调函数，会进⼊异步任务⾥⾯的”微任务”（microtask）队列。微任务队列追加在 process.nextTick 队列的后⾯，也属于本轮循环。所以，下⾯的代码总是先输出 3，再输出 4。

⾄此，本轮循环的执⾏顺序就讲完了：同步任务 => process.nextTick() => 微任务
```js
process.nextTick(() => console.log(3));
Promise.resolve().then(() => console.log(4));
// 注意，只有前⼀个队列全部清空以后，才会执⾏下⼀个队列。代码中，全部process.nextTick的回调函数，执⾏都会早于Promise
process.nextTick(() => console.log(1));
Promise.resolve().then(() => console.log(2));

process.nextTick(() => console.log(5));
Promise.resolve().then(() => console.log(4));
/*
3
1
5
4
2
4
*/
```

## 事件循环执⾏顺序
Node 只有⼀个主线程，事件循环是在主线程上完成的。开始执⾏脚本时，会先进⾏事件循环的初始化，但是这时事件循环还没有开始，会先完成下⾯的事情： 

同步任务、发出异步请求、规划定时器⽣效的时间、执⾏process.nextTick()等等。最后，上⾯这些事情都⼲完了，事件循环就正式开始了。事件循环会⽆限次地执⾏，⼀轮⼜⼀轮。

只有异步任务的回调函数队列清空了，才会停⽌执⾏。每⼀轮的事件循环，分成六个阶段，这些阶段会依次执⾏:
```
1、timers: 这个阶段执行定时器队列中的回调如 setTimeout() 和 setInterval()。

2、I/O callbacks:这个阶段执行几乎所有的回调。但是不包括close事件，定时器和setImmediate()的回调。
3、idle, prepare 这个阶段仅在内部使用，可以不必理会。
4、poll 等待新的I/O事件，node在一些特殊情况下会阻塞在这里。
5、check  setImmediate()的回调会在这个阶段执行。
6、close callbacks 例如socket.on('close', ...)这种close事件的回调。

每个阶段都有⼀个先进先出的回调函数队列。只有⼀个阶段的回调函数队列清空了，该执⾏的回调函数都执⾏了，事件循环才会进⼊下⼀个阶段。简单介绍⼀下每个阶段的含义： 

（1）timers：这个是定时器阶段，处理setTimeout()和setInterval()的回调函数。进⼊这个阶段后，主线程会检查⼀下当前时间，是否满⾜定时器的条件。如果满⾜就执⾏回调函数，否则就离开这个阶段。 
（2）I/O callbacks：除了举出的这些操作回调函数，其他的回调函数都在这个阶段执⾏：setTimeout() 和 setInterval() 的回调函数、setImmediate() 的回调函数、⽤于关闭请求的回调函数，⽐如 socket.on(‘close’, …) 
（3）idle, prepare：该阶段只供 libuv 内部调⽤，这⾥可以忽略。 
（4）Poll：这个阶段是轮询时间，⽤于等待还未返回的 I/O 事件，⽐如服务器的回应、⽤户移动⿏标等等。这个阶段的时间会⽐较长。如果没有其他异步任务要处理（⽐如到期的定时器），会⼀直停留在这个阶段，等待 I/O 请求返回结果。 
（5）check：该阶段执⾏ setImmediate() 的回调函数。 
（6）close callbacks：该阶段执⾏关闭请求的回调函数，⽐如 socket.on('close', …)。
```

## 事件循环⽰例
```js
const fs = require('fs');
const timeoutScheduled = Date.now();

//异步任务⼀：100ms 后执⾏的定时器
setTimeout(() => {
const delay = Date.now() - timeoutScheduled;
  console.log(`${delay}ms`);
}, 100);

// 异步任务⼆：⽂件读取后，有⼀个 200ms的回调函数
fs.readFile('test.js', () => {
const startCallback = Date.now();
while (Date.now() - startCallback < 200) {
//什么也不做
  }
});

/*
上⾯代码有两个异步任务，⼀个是 100ms 后执⾏的定时器，⼀个是⽂件读取，它的回调函数需要 200ms。请问运⾏结果是什么？ 
脚本进⼊第⼀轮事件循环以后，没有到期的定时器，也没有已经可以执⾏的 I/O 回调函数，所以会进⼊ Poll 阶段，等待内核返回⽂件读取的结果。由于读取⼩⽂件⼀般不会超过 100ms，所以在定时器到期之前，Poll 阶段就会得到结果，因此就会继续往下执⾏。

第⼆轮事件循环，依然没有到期的定时器，但是已经有了可以执⾏的 I/O 回调函数，所以会进⼊ I/O callbacks 阶段，执⾏ fs.readFile 的回调函数。这个回调函数需要 200ms，也就是说，
在它执⾏到⼀半的时候，100ms 的定时器就会到期。但是，必须等到这个回调函数执⾏完，才会离开这个阶段。第三轮事件循环，已经有了到期的定时器，所以会在 timers阶段执⾏定时器。

最后输出结果⼤概是 200 多毫秒。
*/
```

## setTimeout 和 setImmediate
由于 setTimeout 在 timers 阶段执⾏，⽽ setImmediate 在 check 阶段执⾏。所以，setTimeout 会早于 setImmediate 完成。
```js
setTimeout(() => console.log(1));
setImmediate(() => console.log(2)
```
上⾯代码应该先输出 1，再输出 2，但是实际执⾏的时候，结果却是不确定，有时还会先输出 2，再输出 1。这是因为 setTimeout 的第⼆个参数默认为 0。 

但是实际上，Node 做不到 0 毫秒，最少也需要 1 毫秒，根据官⽅⽂档，第⼆个参数的取值范围在 1 毫秒到 2147483647 毫秒之间。

也就是说，setTimeout(f, 0) 等同于setTimeout(f, 1)。实际执⾏的时候，进⼊事件循环以后，有可能到了 1 毫秒，也可能还没到 1 毫秒，取决于系统当时的状况。 

如果没到 1 毫秒，那么 timers 阶段就会跳过，进⼊ check 阶段，先执⾏ setImmediate 的回调函数。但是，下⾯的代码⼀定是先输出2，再输出 1。
```js
const fs = require('fs');
fs.readFile('test.js', () => {
  setTimeout(() => console.log(1));
  setImmediate(() => console.log(2));
});

// 上⾯代码会先进⼊ I/O callbacks 阶段，然后是 check 阶段，最后才是 timers 阶段。因此，setImmediate 才会早于 setTimeout 执⾏。
```