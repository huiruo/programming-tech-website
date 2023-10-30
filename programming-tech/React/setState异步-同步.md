---
title: setState异步-同步
sidebar_position: 5
---

## setState什么时候是异步?

由React控制内的事件处理函数(onChange、onClick等合成事件)，以及生命周期函数调用setState()为异步 。只要进入了 react 的调度流程，那就是异步的；

### 为什么是异步？
setState 里的逻辑其实是同步的，但是，调用 setState 时，react 会对这一系列的 setter 做合并处理，异步更新该函数式组件对应的 hooks 链表里面的值，然后触发重渲染（re-renders），从这个角度上来说，setState 确实是一个"异步"操作；

+ 多次执行setState 和 useState的set函数，组件只会重新渲染一次,<br/>
即是把一个同步代码中的多个setState合并成一次进行批量更新。

+ setState 和 useState中的set函数是异步执行的（不会立即更新state的结果）<br/>
不同的是，setState会更新当前作用域下的状态，但是set函数不会更新，只能在新渲染的组件作用域中访问到。<br/>
如果我们在同步函数或者在异步回调中调用 setCount 后，打印 count，都是旧值。
拿更新后的值的方法:
```js
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(val => {
    // do something
    return val + 1
  })
};
```

## 同步-在setTimeout，Promise.then等异步事件或者原生事件中
setState和useState的set函数是同步执行的（立即重新渲染组件）,每一次的执行都会调用一次render

结合实例来看，当点击增加会执行三次setAge
```js
const onClick = useCallback(() => {
  setAge(19);
  setAge(20);
  setAge(21);
}, []);
```
代码没有进入react的调度流程，那就是同步的,这些都不会走 React 的调度流程。在这种情况下调用 setState ，那这次 setState 就是同步的:
* setTimeout,setInterval
* 直接在 DOM 上绑定原生事件
* Promise 的回调等

>这种情况setState是同步的，意味着每执行一次setState时，都重新diff + dom修改

## React17的性能优化:React17根据情况而采用不同的更新策略
React17 和 React18 批量更新的策略是不同的。
* React18就统一的采用更新策略，可以不用考虑render渲染次数，带来的性能问题。
* React17根据情况而采用不同的更新策略，<br/>
setState 同步执行的情况下， DOM也会被同步更新，也就意味着如果多次 setState ，会导致多次更新，这是毫无意义并且浪费性能的。

在react17中提供了 `unstable_batchedUpdates` 函数，用来合并批量操作。在请求后台接口，返回数据时使用unstable_batchedUpdates函数来减少渲染次数，优化,
```js
const btn2 = () => {
  setTimeout(() => {
    unstable_batchedUpdates(() => {
      setCount(prev => prev + 1)
      setCount(prev => prev + 2)
    })
  }, 0)
}
```

## legacy模式和concurrent模式(并发)
在legacy模式中，更新可能为同步，也可能为异步；

在concurrent模式中，一定是异步。

### concurrent模式
通过ReactDOM.unstable_createRoot(rootNode).render(<App />)方式创建的应用，则为concurrent模式，这个模式目前只是一个实验阶段的产物

* createRoot调用createRootImpl创建fiberRootNode和rootNode
* 创建完Fiber节点后，调用ReactDOMRoot.prototype.render执行updateContainer，然后scheduleUpdateOnFiber异步调度performConcurrentWorkOnRoot进入render阶段和commit阶段

### legacy模式
通过ReactDOM.render(<App />, rootNode)方式创建应用，则为 legacy 模式

legacy 模式在合成事件中有自动批处理的功能，但仅限于一个浏览器任务。非 React 事件想使用这个功能必须使用 unstable_batchedUpdates

legacy模式是我们常用的，它构建dom的过程是同步的，所以在render的reconciler中，如果diff的过程特别耗时，那么导致的结果就是js一直阻塞高优先级的任务(例如用户的点击事件)，表现为页面的卡顿，无法响应

* render调用legacyRenderSubtreeIntoContainer，最后createRootImpl会调用到createFiberRoot创建fiberRootNode,然后调用createHostRootFiber创建rootFiber，其中fiberRootNode是整个项目的的根节点，rootFiber是当前应用挂在的节点，也就是ReactDOM.render调用后的根节点

* 创建完Fiber节点后，legacyRenderSubtreeIntoContainer调用updateContainer创建创建Update对象挂载到updateQueue的环形链表上，然后执行scheduleUpdateOnFiber调用performSyncWorkOnRoot进入render阶段和commit阶段