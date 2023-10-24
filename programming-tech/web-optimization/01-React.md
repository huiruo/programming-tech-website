---
title: React
sidebar_position: 1
---

React 组件性能优化的核心是减少渲染真实 DOM 节点的频率，减少 Virtual DOM 比对的频率。

## 优化方式

### 在渲染期间执行了高开销的计算，可以使用 `memo`/`useMemo` 来进行优化
1. 优化之 shouldComponentUpdate 或则 React.memo
通过 compare 比较新旧 props 是否“相同”，选择是重新渲染组件还是跳过渲染组件的操作并直接复用最近一次渲染的结果。

参考：[api-memo 和 shouldComponentUpdate](../React/api-memo和shouldComponentUpdate)

纯组件只能进行浅层比较，要进行深层比较，使用 shouldComponentUpdate，它用于编写自定义比较逻辑

>注意：shouldComponentUpdate 刚好与 memo 相反,shouldComponentUpdate 返回 true 重新渲染组件，返回 false 阻止重新渲染
```js
function isEqual(prevProps, nextProps) {
  if (prevProps.seconds === nextProps.seconds) {
    // isEqual 返回 true 时，不会触发 render
    return true;
  } else {
    // false render
    return false;
  }
}
export default React.memo(Child, isEqual);
```

2. `hooks优化：`
    1. 使用 useMemo 缓存计算结果，监测值不变化不重新计算
    参考：[api-useMemo](../React/api-useMemo)
    2.  使用 useCallback 缓存函数，使得重新渲染总得到相同的函数
    参考：[api-useMemo](../React/api-useMemo)

### 减少嵌套节点/组件

因为 react 每个节点都会触发 beginWork; 
>类似在vue 中,创建好 vnode,调用 patch 进行组件内容的渲染,vnode.children 递归调用 patch(null,child,container)

- 拆分组件:当触发更新的时候节点都会 beginWork-->completeWork,所以尽量把大组件抽离成组件
- 所以减少嵌套组件，嵌套节点很重要
- 或则使用虚拟列表

## 使用组件懒加载可以减少 bundle 文件大小

```
见webpack
```

```js
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

const Home = lazy(() => import(/* webpackChunkName: "Home" */ "./Home"));
const List = lazy(() => import(/* webpackChunkName: "List" */ "./List"));

const App = () => (
  <BrowserRouter>
    <Link to="/">Home</Link>
    <Link to="/list">List</Link>

    <Switch>
      <Suspense fallback={<div>Loading</div>}>
        <Route path="/" component={Home} exact />
        <Route path="/list" component={List} />
      </Suspense>
    </Switch>
  </BrowserRouter>
);
```

### 根据条件进行组件懒加载

适用于组件不会随条件频繁切换的情况

```js
const App = () => {
  let LazyComponent = null;
  if (xxx) {
    LazyComponent = lazy(() => import(/* webpackChunkName: "Home" */ "./Home"));
  } else {
    LazyComponent = lazy(() => import(/* webpackChunkName: "List" */ "./List"));
  }
  return (
    <Suspense fallback={<div>Loading</div>}>
      <LazyComponent />
    </Suspense>
  );
};

export default App;
```

## 优化之避免使用内联样式属性

内联 style 会被编译为 JavaScript 代码, 通过 JavaScript 代码将样式规则映射到元素的身上, 浏览器就会花费更多的时间执行脚本和渲染 UI, 从而增加了组件的渲染时间.

内联样式为 JavaScript 对象, backgroundColor 需要被转换为等效的 CSS 样式规则, 然后将其应用到元素, 这样涉及到脚本的执行.

```js
function App() {
  return <div style={{ backgroundColor: "yellow" }}>App works</div>;
}
```

## 优化之使用Fragment避免额外`<div>`

React 推出了 fragment 占位符标记替代使用`<div>`. 使用占位符标记既满足了拥有共同父级的要求又不会多出额外的无意义标记.

```js
const App = () => (
  <>
    <div>message a</div>
    <div>message b</div>
  </>
);
```

```js
function App() {
  return (
    <>
      <div>message a</div>
      <div>message b</div>
    </>
  );
}

import { Fragment } from "react";
function App() {
  return (
    <Fragment>
      <div>message a</div>
      <div>message b</div>
    </Fragment>
  );
}
```

## react 优化之为列表数据添加唯一标识
当需要渲染列表数据时，我们应该为每一个列表项添加key 属性，key 属性的值必须是唯一的
key属性可以让 React 直接了当的知道哪些列表项发生了变化，从而避免了React 内部逐一遍历 Virtual DOM 查找变化所带来的性能消耗，避免了元素因为位置变化而导致的重新创建
当列表数据没有唯一标识时，可以临时使用索引作为 key属性的值，但是仅限于列表项是静态的，不会被动态改变

比如不会对列表项进行排序或者过滤，不会从顶部或者中间添加或者删除项目

如果没有唯一标识发生以上行为时，索引会被更改，更新就不会变高效

[不要把index当成list-key](../React/key为index带来的问题/注意点-不要把index当成list-key)

[实战](../React/key为index带来的问题/实战)

## react 优化:在 react17 中 在请求的 async 或 promise then 函数,使用 unstable_batchedUpdates

legacy 模式在合成事件中有自动批处理的功能，但仅限于一个浏览器任务。非 React 事件想使用这个功能必须使用 unstable_batchedUpdates

- 1.当直接调用时 this.setState 时，为异步更新；
- 2.当在异步函数的回调中调用 this.setState，则为同步更新；
- 3.当放在自定义 DOM 事件的处理函数中时，也是同步更新。

参考：[setState异步-同步](../React/setState异步-同步)

1. 只要进入了 react 的调度流程，那就是异步的；只要你没有进入 react 的调度流程，那就是同步的。
2. 什么东西不会进入 react 的调度流程？ setTimeout、 setInterval 、直接在 DOM 上绑定原生事件、Promise 的回调等，这些都不会走 React 的调度流程。在这种情况下调用 setState ，那这次 setState 就是同步的。 否则就是异步的。
3. setState 同步执行的情况下， DOM 也会被同步更新，也就意味着如果多次 setState ，会导致多次更新，这是毫无意义并且浪费性能的。

所以，在请求的 async 或 promise then 函数,使用 unstable_batchedUpdates

```js
const btn2 = () => {
  setTimeout(() => {
    unstable_batchedUpdates(() => {
      setCount((prev) => prev + 1);
      setCount((prev) => prev + 2);
    });
  }, 0);
};
```

## react 优化之扩展：使用 react18 能增强渲染性能

react 18 中是批处理

>每当你使用setState来改变任何函数中的变量时，React不是在每个setState上进行渲染，而是收集所有的setStates，然后一起执行它们。这就是所谓的批处理。

因为它避免了不必要的重新渲染。它还可以防止你的组件呈现 半成品状态，即只有一个状态变量被更新

react18 其他属性:

- React18 就统一的采用更新策略，可以不用考虑 render 渲染次数，带来的性能问题。
- 用 Transition API 进行并发控制,其中一个 API 是 startTransition，它允许开发者向 React 指出哪些动作可能会阻塞线程并导致屏幕上的滞后。
- 函数调用和事件的自动批处理，以提高应用内的性能
- 用 Suspense 为 SSR 提供更快的页面加载。

## react 优化之扩展：PureComponent

什么是纯组件?

纯组件会对组件输入数据进行浅层比较，如果当前输入数据和上次输入数据相同，组件不会重新渲染

什么是浅层比较?

比较引用数据类型在内存中的引用地址是否相同，比较基本数据类型的值是否相同

如何实现纯组件?

类组件继承 PureComponent 类，函数组件使用 memo 方法

为什么不直接进行 diff 操作，而是要先进行浅层比较，浅层比较难道没有性能消耗吗

>和进行dff 比较操作相比，浅层比较将消耗更少的性能。diff 操作会重新遍历整颗 virtualDOM 树,而浅层比较只操作当前组件的state和props

## react 优化之卸载组件前进行清理操作

在组件中为 window 注册的全局事件、定时器等，在组件卸载前要清理掉，防止组件卸载后继续执行影响应用性能

```js
const App = () => {
  useEffect(() => {
    let timer = setInterval(() => {
      // ...
    }, 1000);

    return () => clearInterval(timer); // 清理！
  }, []);
  return (
    <button
      onClick={() =>
        ReactDOM.unmountComponentAtNode(document.getElementById("root"))
      }
    >
      unmount!!
    </button>
  );
};
```