---
title: useLayoutEffect和useEffect
sidebar_position: 54
---

# useLayoutEffect
其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。

渲染前执行的useLayoutEffect,在commit阶段的layout阶段同步执行

## useLayoutEffect 优缺点:useLayoutEffect发生在页面渲染到屏幕(用户可见)之前，useEffect发生在那之后
useLayoutEffect 与 componentDidMount、componentDidUpdate 生命周期钩子是【异步微任务】，在渲染线程被调用之前就执行。这意味着回调内部执行完才会更新渲染页面，没有二次渲染问题。
* 优点： 没有二次渲染问题，页面视觉行为一致。
* 缺点: 在回调内部有一些运行耗时很长的代码或者循环时，页面因为需要等 JS 执行完之后才会交给渲染线程绘制页面，等待时期就是白屏效果，即阻塞了渲染。

所以不要在useLayoutEffect做太多事情，阻塞渲染

## 详细
```
02-1-commit阶段-useLayoutEffect-useEffect.md
```