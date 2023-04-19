---
title: useLayoutEffect和useEffect
sidebar_position: 54
---

## useLayoutEffect
useEffect是异步的，useLayoutEffect是同步

useLayoutEffect 的回调函数用于执行副作用操作，可以在 DOM 更新前同步执行，清除函数用于清除副作用操作，可以在组件卸载时执行或在下一次回调函数执行之前执行。这两个函数结合使用，可以保证组件的副作用操作得到正确的管理和清理。

`useLayoutEffect发生在页面渲染到屏幕(用户可见)之前，useEffect发生在那之后`
useLayoutEffect 与 componentDidMount、componentDidUpdate 生命周期钩子是【异步微任务】，在渲染线程被调用之前就执行。这意味着回调内部执行完才会更新渲染页面，没有二次渲染问题。
* 优点： 没有二次渲染问题，页面视觉行为一致。
* 缺点: 在回调内部有一些运行耗时很长的代码或者循环时，页面因为需要等 JS 执行完之后才会交给渲染线程绘制页面，等待时期就是白屏效果，即阻塞了渲染。

渲染前执行的useLayoutEffect,在commit阶段的layout阶段同步执行,最后，浏览器执行渲染流程；
```js
import { useLayoutEffect, useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    document.title = `Count: ${count}`;

    return () => {
      document.title = 'Cleanup';
    };
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

```