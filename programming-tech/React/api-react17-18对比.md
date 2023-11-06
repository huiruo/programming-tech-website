
## 1.setState自动批处理
* 在React17默认情况下，在promise、setTimeout、原生事件处理函数中、或任何其它事件内的更新都不会进行批处理。

* 在React18以后,所有更新都会自动进行批处理。多次更新将会合并成一次更新，从而降低渲染次数提高性能。
```js
// 退出批处理，需要使用flushSync
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

const App: React.FC = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  return (
    <div
      onClick={() => {
        flushSync(() => {
          setCount1(count => count + 1);
        });
        // 第一次更新
        flushSync(() => {
          setCount2(count => count + 1);
        });
        // 第二次更新
      }}
    >
      <div>count1： {count1}</div>
      <div>count2： {count2}</div>
    </div>
  );
};

export default App;
```

## Concurrent Mode(并发模式)
并发模式可帮助应用保持响应，并根据用户的设备性能和网速进行适当的调整，该模式通过使渲染可中断来修复阻塞渲染限制。在 Concurrent 模式中，React 可以同时更新多个状态。

react17 和 react18的区别就是：从同步不可中断更新变成了异步可中断更新。

开启并发模式：

在React18中提供了新的root Api，我们只需要把render改成ReactDOM.createRoot(root).render(<App />) 就可以开启并发模式。

开启并发模式就一定开启并发更新吗？
>在React18中开启并发模式不一定开启并发更新，而是否开启并发更新的依据是是否使用并发特性。

并发特性指的是开启并发模式才能使用的特性，比如下面介绍的：
```
startTranstion
useTranstion
useDeferredValue
```

### Transition:
在大屏幕视图更新的时，startTransition 能够保持页面有响应，这个 api 能够把 React 更新标记成一个特殊的更新类型 transitions ，在这种特殊的更新下，React 能够保持视觉反馈和浏览器的正常响应。
1. startTransition:
startTransition(scope)

scope 是一个回调函数，里面的更新任务都会被标记成过渡更新任务，过渡更新任务在渲染并发场景下，会被降级更新优先级，中断更新。
```js
// startTranstion的回调包裹的setState触发的渲染标记为不紧急渲染。这些渲染可能被其他紧急渲染所抢占。
startTransition(()=>{
   /* 更新任务 */
  func（）
})
```

2.  useTranstion
在低优先级还没执行的时候，怎么知道过渡任务处于什么状态，这时候就可以使用useTranstion这个Hooks。useTranstion执行返回一个数组，数组有两个状态值。

第一个状态值： 当处于过渡状态的标记。

第二个状态值： 可以理解为startTranstion，将任务标记为过渡任务。
```js
import { useTranstion } from 'react';

const [isPending, startTrastion] = useTranstion();
```

3. useDeferredValue
返回一个延时响应的值可以让一个state延时生效，只有当前没有紧急更新的任务时，该值才会变为最新的值。和startttanstion一样都是标记为非紧急更新。

useTranstion和useDeferredValue异同：
相同点： useDeferredValue本质上和内部实现与useTranstion一样都是标记成了过度更新任务。

不同点：useTranstion是把startTranstion内部的更新任务变成了过度任务transtion，而useDeferredValue是把原值通过过度任务得到新的值，这个值作为延时状态，一个是处理逻辑，一个是生产一个新的状态。

## api
### useId
```js
const id = useId();
```
支持同一个组件在客户端和服务端生成相同的唯一的 ID，避免 hydration 的不兼容，这解决了在 React 17 及 17 以下版本中已经存在的问题。

### useInsertionEffect
```
在dom生成之后，useLayoutEffect之前，它的工作原理大致合useLayoutEffect相同，只是此时无法访问DOM节点的引用，一般用于提前注入<style>脚本。
```