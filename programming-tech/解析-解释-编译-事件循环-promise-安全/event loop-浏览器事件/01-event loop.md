---
title: event loop
sidebar_position: 1
---

# 浏览器event loop

## JS到底是怎么运行的呢？
```
00-Parser解析得到AST-Ignition解释得到字节码.md

## 初始化3.构造事件循环与消息队列
```
JS引擎常驻于内存中，等待宿主将JS代码或函数传递给它。也就是等待宿主环境分配宏观任务，反复等待 - 执行即为事件循环。
![img1](../../assets/img-engine/js运行.png)

概念1：宿主
JS运行的环境:浏览器/Node。

概念2：执行栈,是一个存储函数调用的栈结构，遵循先进后出的原则。
```js
function foo() {
  throw new Error('error')
  console.log("test")
}
function bar() {
  foo()
}
bar()

以上代码会报错：
VM100:2 Uncaught Error: error
    at foo (<anonymous>:2:9)
    at bar (<anonymous>:5:3)
    at <anonymous>:7:1

当开始执行 JS 代码时，首先会执行一个 main 函数，然后执行我们的代码。根据先进后出的原则，后执行的函数会先弹出栈，在图中我们也可以发现，foo 函数后执行，当执行完毕后就从栈中弹出了。
```

## JS是单线程的，那么单线程的JS是怎么完成非阻塞的完成异任务的呢?-->事件循环
1. Node环境中，只有JS 线程。
2. 在浏览器环境中，有JS 引擎线程和渲染线程，且两个线程互斥。

js是单线程语言，浏览器只分配给js一个主线程，用来执行任务（函数），但一次只能执行一个任务，这些任务形成一个任务队列排队等候执行，但前端的某些任务是非常耗时的，比如网络请求，定时器和事件监听，如果让他们和别的任务一样，都老老实实的排队等待执行的话，执行效率会非常的低，甚至导致页面的假死。

所以，浏览器为这些耗时任务开辟了另外的线程，主要包括http请求线程，浏览器定时触发器，浏览器事件触发线程，这些任务是异步的。

那么问题来了，这些异步任务完成后，主线程怎么知道呢？

浏览器提供一些异步的WebAPI例如DOM操作，setTimeout，XHR等，JS通过事件循环机制（event loop）调用这些API的回调。答案就是回调函数，整个程序是事件驱动的，每个事件都会绑定相应的回调函数，举个例子，有段代码设置了一个定时器:
```js
setTimeout(function(){
    console.log(time is out);
}，1000）;
```
执行这段代码的时候，浏览器异步执行计时操作，当1000ms到了后，会触发定时事件，这个时候，就会把回调函数放到任务队列里。整个程序就是通过这样的一个个事件驱动起来的。
所以说，js是一直是单线程的，实现异步的是浏览器。

## 浏览器event loop,宏任务是由宿主(Node、浏览器)发起的，而微任务由JavaScript自身发起
浏览器为了解决单线程的异步执行问题，引入了事件循环队列，任务又分为微任务和宏任务，微任务的优先级比宏任务高，只要微任务队列里面有任务，宏任务队列永远得不到执行。

微任务：（发起者: JS引擎）
1. Promise:new Promise().then 的回调,promise构造函数是同步执行:new Promise中传入的执行器函数是同步函数,在ES5之后，JavaScript引入了Promise，这样，不需要浏览器，JavaScript引擎自身也能够发起异步任务了。
首先Promise构造函数会立即执行，而Promise.then()内部的代码在当次事件循环的结尾立即执行(微任务)。
2. Vue nextTick 
```
api-nextTick.md
```
2. MutationObserver
4. process.nextTick（Node.js）

宏任务（发起者:宿主Node、浏览器）:
1. script 
2. setTimeout / setInterval 回调函数
3. setImmediate(node.js) 
4. I/O 和UI rendering 。

这里很多人会有个误区，认为微任务快于宏任务，其实是错误的。因为宏任务中包括了 script，浏览器会先执行一个宏任务，接下来有异步代码的话才会先执行微任务。

```
类型                宏          微

谁先运行	        后运行	    先运行
会触发新一轮Tick吗	会	        不会
```
### event loop
1. 首先执行同步代码，这属于宏任务,执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
```
初始执行的代码也是宏任务。最外层的上下文也是一个宏任务

是存在多个宏任务的, 然而每一次 loop 的时候只会并且先执行"最前面"的宏任务, 然后执行当前 loop 下所有的微任务, 所有微任务完毕之后, 进入下一次 loop, 执行接下来的宏任务, 重复上述过程。
所以也不能说先宏后微，执行完任务队列头的宏任务后就开始执行微任务队列中的微任务，直到微任务队列为空。
```
2. 当执行完所有`同步代码`后，执行栈为空，立即执行当前微任务队列中的所有微任务（依次执行）
宏任务结束后，会执行渲染，然后执行下一个宏任务，而微任务可以理解成在当前宏任务执行后立即执行的任务。
也就是说，当宏任务执行完，会在渲染前，将执行期间所产生的所有微任务都执行完。
```js
document.body.style = 'background:blue'
console.log(1);
Promise.resolve().then(()=>{    
  console.log(2);    
  document.body.style = 'background:black'
});
console.log(3);
// 1 3 2
```
2. 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
4. 然后开始下一轮 Event Loop，开始下一轮tick，执行宏任务中的异步代码（setTimeout等回调）。

JS引擎线程和GUI渲染线程是互斥的关系，浏览器为了能够使宏任务和DOM任务有序的进行，会在一个宏任务执行结果后，在下一个宏任务执行前，GUI渲染线程开始工作，对页面进行渲染。

宏任务-->渲染-->宏任务-->渲染-->渲染．．．
主代码块，setTimeout，setInterval等，都属于宏任务

第一个例子：
我们可以将这段代码放到浏览器的控制台执行以下，看一下效果：
我们会看到的结果是，页面背景会在瞬间变成灰色，以上代码属于同一次宏任务，所以全部执行完才触发页面渲染，渲染时GUI线程会将所有UI改动优化合并，所以视觉效果上，只会看到页面变成灰色。
```js
document.body.style = 'background:black';
document.body.style = 'background:red';
document.body.style = 'background:blue';
document.body.style = 'background:grey';
```

第二个例子：
我会看到，页面先显示成red背景，然后瞬间变成了黑色背景，这是因为以上代码属于两次宏任务，第一次宏任务执行的代码是将背景变成red，然后触发渲染，将页面变成red，再触发第二次宏任务将背景变成黑色。

貌似看不到red,太快？
```js
document.body.style = 'background:red';
setTimeout(function() {
  document.body.style = 'background:black'
}, 0)
// }, 10000)
```

# event loop题目
### 经典案例
```js
for (var i=1; i<=5; i++) { 
    setTimeout( function timer() {
        console.log(i); //输出6 6 6 6 6 6
    }, i*1000 );
}
因为：根据setTimeout定义的操作在函数调用栈清空之后才会执行的特点，for循环里定义了5个setTimeout操作。而当这些操作开始执行时，for循环的i值，已经先一步变成了6。因此输出结果总为6。
```
### 解决：
而我们知道在函数中闭包判定的准则，即执行时是否在内部定义的函数中访问了上层作用域的变量。因此我们需要包裹一层自执行函数为闭包的形成提供条件。
因此，我们只需要2个操作就可以完成题目需求，一是使用自执行函数提供闭包条件，二是传入i值并保存在闭包中。

//而我们想要让输出结果依次执行，我们就必须借助闭包的特性，每次循环时，将i值保存在一个闭包中，当setTimeout中定义的操作执行时，则访问对应闭包保存的i值即可。
```js
for (var i=1; i<=5; i++) { 
    (function(i) {
        setTimeout( function timer() {
            console.log(i);
        }, i*1000 );
    })(i)
}
```
### 解析
```
这道题涉及了异步、作用域、闭包

 setTimeout是异步执行，10ms后往任务队列里面添加一个任务，只有主线上的全部执行完，才会执行任务队列里的任务，当主线执行完成后，i是4，所以此时再去执行任务队列里的任务时，i全部是4了。对于打印4次是：

 每一次for循环的时候，setTimeout都执行一次，但是里面的函数没有被执行，而是被放到了任务队列里面，等待执行，for循环了4次，就放了4次，当主线程执行完成后，才进入任务队列里面执行。

（注意：for循环从开始到结束的过程，需要维持几微秒或几毫秒。)

 当我把var 变成let 时

 for(let i=0;i<=3;i++){ setTimeout(function() {  console.log(i)  }, 10);}

 打印出的是：0,1,2,3

 当解决变量作用域，

 因为for循环头部的let不仅将i绑定到for循环快中，事实上它将其重新绑定到循环体的每一次迭代中，确保上一次迭代结束的值重新被赋值。setTimeout里面的function()属于一个新的域，通过 var 定义的变量是无法传入到这个函数执行域中的，通过使用 let 来声明块变量，这时候变量就能作用于这个块，所以 function就能使用 i 这个变量了；这个匿名函数的参数作用域 和 for参数的作用域 不一样，是利用了这一点来完成的。这个匿名函数的作用域有点类似类的属性，是可以被内层方法使用的。
```
## 例子：面试题
```js
async function async1() {
    console.log("1.async1 start");
    await async2();
    console.log("2.async1 end");
}

async function async2() {
    console.log("3.async2");
}

console.log("4.script start");

setTimeout(() => {
    console.log('5.setTimeout');
}, 0);

async1();

new Promise((reslove) => {
    console.log("6.promise1");
    reslove();
}).then(() => {
    console.log("7.promise2");
})

console.log("8.script end");



/*
4.script start
1.async1 start
3.async2
6.promise1
8.script end
2.async1 end
7.promise2
5.setTimeout
* */
```


<br />

```js
const promise = new Promise((resolve, reject) => {
    console.log(1);
    resolve();
    console.log(2);
    reject('error');
})
promise.then(() => {
    console.log(3);
}).catch(e => console.log(e))
console.log(4);
/*
1
2
4
3
规则一，promise构造函数的代码会立即执行，then或者reject里面的代码会放入异步微任务队列，在宏任务结束后会立即执行。规则二：promise的状态一旦变更为成功或者失败，则不会再次改变，所以执行结果为：1,2,4,3。
*/
```

## async
这道题的坑就在于 async 中如果没有 await，那么它就是一个纯同步函数。
```js
async function async1() {
  console.log("AAAA");
  async2(); 
  console.log("BBBB");
}
async function async2() {
  console.log("CCCC");
}

console.log("DDDD");
setTimeout(function () {
  console.log("FFFF");
}, 0);
async1();
new Promise(function (resolve) {
  console.log("GGGG");
  resolve();
}).then(function () {
  console.log("HHHH");
});
console.log("IIII");
/*
DDDD

AAA

CCC
BBB

GGGG
IIII
HHHH
这道题的起始代码在第 9 行，输出DDDD
第 10 行计时器开启一个异步任务 t1（一个称呼），这个任务且为宏任务。
第 13 行函数async1执行，这个函数内没有 await 所以它其实就是一个纯同步函数，打印输出AAAA,
在async1中执行async2函数，因为async2的内部也没有 await，所以它也是个纯同步函数，打印输出CCCC
紧接着打印输出BBBB。
第 14 行 new Promise 执行里面的代码也是同步的,所以打印输出GGGG,resolve()调用的时候开启一个异步任务 t2（一个称呼），且这个任务 t2 是微任务，它的执行交给 then()中的第一个回调函数执行，且优先级高于宏任务（t1）执行。
第 20 行打印输出IIII,此时线程上的同步任务全部执行结束。
在执行任务队列中的异步任务时，微任务优先于宏任务执行，所以先执行微任务 t2 打印输出 HHHH,然后执行宏任务 t1 打印输出 FFFF
所以综上 结果输出是 DDDD AAAA CCCC BBBB GGGG IIII HHHH FFFF
*/
```


## 下面是道加强版的考题，大家可以试一试。
```js
async function async1() {
  await async2()
  console.log('1.async1 end')
}

async function async2() {
  console.log('2.async2 end')
}

async1()

setTimeout(function() {
  console.log('3.setTimeout')
}, 0)

new Promise(resolve => {
  console.log('4.Promise')
  resolve()
}).then(function() {
    console.log('5.promise1')
  }).then(function() {
    console.log('6.promise2')
  })

/*
2.async2 end
4.Promise
1.async1 end
5.promise1
6.promise2
3.setTimeout
*/
```

## 例子
```js
//例子2：
console.log('打印' + 1);

setTimeout(function () {
  console.log('打印setTimeout' + 2);
})

new Promise(function (resolve, reject) {
  console.log('打印' + 3);
  resolve()
}).then(function () {
  console.log('打印then(' + 4)
});;

console.log('打印' + 10);

let promiseA = new Promise(function (resolve, reject) {
  setTimeout(function () {
    console.log('打印setTimeout' + 5);
  });
  resolve()
})

promiseA.then(() => {
  console.log('打印then(' + 6)
});

setTimeout(function () {
  new Promise(function (resolve, reject) {
    console.log('打印setTimeout' + 7);
  });
})

/*
打印1
打印3
打印10
打印then(4
打印then(6
打印setTimeout2
打印setTimeout5
打印setTimeout7
*/
```

## 例子1
```js
console.log('打印' + 1);

setTimeout(function () {
  console.log('打印setTimeout' + 2);
})

new Promise(function (resolve, reject) {
  console.log('打印' + 3);
  resolve()
}).then(function () {
  console.log('打印then(' + 4)
});;

console.log('打印' + 10);

let promiseA = new Promise(function (resolve, reject) {
  setTimeout(function () {
    console.log('打印setTimeout' + 5);
  });
  resolve()
})

promiseA.then(() => {
  console.log('打印then(' + 6)
});

setTimeout(function () {
  new Promise(function (resolve, reject) {
    console.log('打印setTimeout' + 7);
  });
})
/*
打印1
打印3
打印10
打印then(4
打印then(6
打印setTimeout2
打印setTimeout5
打印setTimeout7
*/
```

## 例子2
```js
// 因为Promise定义之后便会立即执行，其后的.then()是异步里面的微任务。
setTimeout(() => {
  console.log('1.我是宏任务')
}, 0);

let promise = new Promise(resolve => {
  resolve();
  console.log('2.新建promise')
});

promise.then(value => {
  console.log('3.我是微任务')
});

console.log('4.主流程');


/*
2.新建promise
4.主流程
3.我是微任务
1.我是宏任务
*/ 
```

## 例子3
```js
setTimeout(() => {
  console.log("4");

  setTimeout(() => {
    console.log("8");
  }, 0);

  new Promise((r) => {
    console.log("5");//构造函数是同步的
    r();
  }).then(() => {
    console.log("7");//then()是异步的，这里已经入队
  });

  console.log("6");
}, 0);

new Promise((r) => {
  console.log("1");//构造函数是同步的
  r();
}).then(() => {
  console.log("3");//then()是异步的，这里已经入队
});

console.log("2");

/*
1
2
3
4
5
6
7
8
*/
```


## 小试牛刀
```js
setTimeout(function () {
    console.log('1');
});

new Promise(function(resolve,reject){
    console.log('2:',2)
    resolve(3)
}).then(function(val){
    console.log('3:',val);
})

/*
2: 2
3: 3
1
*/
```


## 例子
```js
setTimeout(function () {
  console.log("==a", a);
}, 0);

var a = 10;

console.log("===b", b);
console.log("=====fn", fn);

var b = 20;

function fn() {
  setTimeout(function () {
    console.log('setTImeout 10ms.');
  }, 10);
}

fn.toString = function () {
  return 30;
}

setTimeout(function () {
  console.log('setTimeout 20ms.');
}, 20);

fn();

/*打印：
fn();
===b undefined
=====fn ƒ fn() {
setTimeout(function () {
    console.log('setTImeout 10ms.');
  }, 10);
}

==a 10
setTImeout 10ms.
setTimeout 20ms.
*/
```