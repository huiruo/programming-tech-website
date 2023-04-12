---
title: bind-call-apply
sidebar_position: 9
---

## bind() 第一个参数为null
首先bind，第一个传null不改变this指向，而且可以在后续的调用中去传入参数
```js
function multiply (x, y, z) {
  // 2,3,4
  console.log({x, y, z})
  return x * y * z;
}

// 例如这里第一次就传了x的值，那么y,z的值就后续调用里面传入的。
// call, apply, bind 都是用来改变this指向的。js是静态作用域，this语法可以看作动态作用域。
const double = multiply.bind(null, 2);
 
// Outputs: 24
console.log(double(3, 4));
```

### react 源码中的useState
dispatchSetState.bind(null, currentlyRenderingFiber$1, queue)

利用bind返回dispatch函数

这也是为什么虽然 dispatchSetState 本身需要三个参数，但我们使用的时候都是 setState(params)，只用传一个参数的原因。
```js
function mountState(initialState) {
  var hook = mountWorkInProgressHook();

  if (typeof initialState === 'function') {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }

  hook.memoizedState = hook.baseState = initialState;
  var queue = {
    pending: null,
    interleaved: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState
  };
  hook.queue = queue;

  var dispatch = queue.dispatch = dispatchSetState.bind(null, currentlyRenderingFiber$1, queue)
  console.log('=useState=dom=利用bind返回dispatch:', { dispatch })
  return [hook.memoizedState, dispatch];
}
```

## bind()
bind方法和call很相似，第一参数也是this的指向，后面传入的也是一个参数列表(但是这个参数列表可以分多次传入，call则必须一次性传入所有参数)，但是它改变this指向后不会立即执行，而是返回一个永久改变this指向的函数。

## call方法的第一个参数也是this的指向，后面传入的是一个参数列表（注意和apply传参的区别）。
当一个参数为null或undefined的时候，表示指向window（在浏览器中），和apply一样，call也只是临时改变一次this指向，并立即执行

## call()和apply()都具有实效性
* apply方法改变this指向后原函数会立即执行，且此方法只是临时改变thi指向一次。apply(obj,[param,param]) 传参是以参数数组

```js
function foo(name1, name2) {
  console.log('this', this);
  if (name1 || name2) {
    console.log("apply和call得区别：", "name1:", name1, "name2:", name2);
  }
}

var fruit = "apple";

// this Window
foo(); // apple 注意：这是在浏览中运行结果，在node中为 undefined

var pack = {
  fruit: "orange",
  foo: foo,
};

// this {fruit: 'orange', foo: ƒ}
pack.foo(); // "orange"

// this {fruit: 'orange', foo: ƒ}
foo.apply(pack, ["name1", "name2"]); // orange

// this {fruit: 'orange', foo: ƒ}
foo.call(pack, "name3", "name3"); // orange
```

* 例子:apply改变了this,但是再次调用还是指向原本的作用域,即只有时效性
```js
function FnA() {
  this.flag = "A";
  this.tip = function () {
    console.log("log1", this.flag);
  };
}

function FnB() {
  this.flag = "B";
}

const objA = new FnA();
const objB = new FnB();

objA.tip.apply(objB); // log1 B
objA.tip(); // log1 A,时效性，输出还是 A
```
