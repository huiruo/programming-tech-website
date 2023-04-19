---
title: useEffect
sidebar_position: 6
---

# useEffect
memoizedState保存包含useEffect回调函数、依赖项等的链表数据结构effect。effect链表同时会保存在fiber.updateQueue中。

mount 时和 update 时涉及的主要方法都是 pushEffect，update 时判断依赖是否变化的原理和useCallback 一致。像上面提到的 memoizedState 存的是创建的 effect 对象的环状链表。

pushEffect 的作用：是创建 effect 对象，并将组件内的 effect 对象串成环状单向链表，放到fiber.updateQueue上面。即 effect 除了保存在 fiber.memoizedState 对应的 hook 中，还会保存在 fiber 的 updateQueue 中。

hook 内部的 effect 主要是作为上次更新的 effect，为本次创建 effect 对象提供参照（对比依赖项数组），updateQueue 的 effect 链表会作为最终被执行的主体，带到 commit 阶段处理。即 fiber.updateQueue 会在本次更新的 commit 阶段中被处理，其中 useEffect 是异步调度的，而 useLayoutEffect 的 effect 会在 commit 的 layout 阶段同步处理。等到 commit 阶段完成，更新应用到页面上之后，开始处理 useEffect 产生的 effect，简单说：

* useEffect 是异步调度，等页面渲染完成后再去执行，不会阻塞页面渲染。
* useLayoutEffect 是在 commit 阶段新的 DOM 准备完成，但还未渲染到屏幕前，同步执行。

## effect是个回调函数是【异步宏任务】，会在微任务执行完后
防止渲染帧时间太长，React 将状态导致的副作用 useEffect 放在了额外的帧里执行，所以 useEffect 是一个名副其实的异步函数。

根据 JS 线程与 GUI 渲染线程互斥原则，在 JS 中页面的渲染线程需要当前事件循环的宏任务与微任务都执行完，才会执行渲染线程，渲染页面后，退出渲染线程，控制权交给 JS 线程，再执行下一轮事件循环。

* 好处：这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因为绝大多数操作不应阻塞浏览器对屏幕的渲染更新。

* 坏处：产生二次渲染问题，第一次渲染的是旧的状态，接着下一个事件循环中，执行改变状态的函数，组件又携带新的状态渲染，在视觉上，就是二次渲染。

* 执行第一个宏任务
* 执行第一个宏任务产生的所有微任务
* 【第一次渲染】
* 检索出第一个 useEffect（该 useEffect 会在 “第一次渲染后，至在第二次渲染前“ 被执行）
* 执行第二个宏任务
* 执行第二个宏任务产生的所有微任务
* 【第二次渲染】
* 检索出第二个 useEffect（该 useEffect 会在 “第二次渲染后，至在第三次渲染前“ 被执行）

## effect 的执行时机
useEffect 需要先调度，在Layout 阶段完成后再异步执行。
请记得 React 会等待浏览器完成画面渲染之后才会延迟调用 `useEffect`，因此会使得额外操作很方便

useLayoutEffect生命周期钩子是【异步微任务】，在渲染线程被调用之前就执行。这意味着回调内部执行完才会更新渲染页面，没有二次渲染问题。
* 好处：没有二次渲染问题，页面视觉行为一致。

* 坏处：在回调内部有一些运行耗时很长的代码或者循环时，页面因为需要等 JS 执行完之后才会交给渲染线程绘制页面，等待时期就是白屏效果，即阻塞了渲染。

## useEffect的执行顺序问题，如果父组件和子组件同时存在useEffect执行先后？
答：子组件的useEffect先走
```
useEffect的执行是在commit之后，React的commit阶段是干什么的？简单来说，就是将DOM渲染到页面上。那么我们是否可以想到，useEffect其实是在页面已经渲染结束后，再触发的？
```

问题1-解析：按照这个执行逻辑来看的话：
* 父组件进入commit阶段，发现有Son组件需要渲染。

* 开始进行Son的生命周期, Son进入commit阶段，执行子组件的useEffect，Son渲染结束

* 父组件进行commit阶段，渲染完成，执行useEffect


## useEffect模拟生命周期的
* 第二个参数传递一个空数组, 模拟 componentDidMount

* 第二个参数传递依赖项，模拟 componentDidUpdate

* 第二个参数传递一个空数组，并且里面通过return的形式去调用一个方法，模拟 componentWillUnmount

```js
// 1. componentDidMount 和 componentWillUnmount
// 通过使用 Hook，你可以把组件内相关的副作用组织在一起（例如创建订阅及取消订阅），而不要把它们拆分到不同的生命周期函数里
useEffect(()=>{
    console.log('componentDidMount')
    return () => {
        console.log('will unmount');
    }
}, [])

// 2. componentDidUpdate 1
useEffect(()=>{
  document.title = `You clicked ${count} times`;
  return()=>{
    // componentWillUnmount 执行的内容       
  }
}, [count])

// 3. componentDidUpdate 2
useEffect(() => console.log('mounted or updated'));

// shouldComponentUpdate, 只有 Parent 组件中的 count state 更新了，Child 才会重新渲染，否则不会。
/*
* React.memo 包裹一个组件来对它的 props 进行浅比较,但这不是一个 hooks，因为它的写法和 hooks 不同,其实React.memo 等效于 PureComponent，但它只比较 props。
* */ 
function Parent() {
  	const [count,setCount] = useState(0);
  	const child = useMemo(()=> <Child count={count} />, [count]);

  	return <>{count}</>
}

function Child(props) {
    return <div>Count:{props.count}</div>
}
```

### React 16.8 +
- 挂载
  1. `constructor`构造函数
  2. `getDerivedStateFromProps`
  3. `render`
  4. `componentDidMount`
- 更新
  1. `getDerivedStateFromProps`
  2. `shouldComponentUpdate`
  3. `render`
  4. `getSnapshotBeforeUpdate`
  5. `componentDidUpdate`
- 卸载
  1. `componentWillUnmount`

React从v16.3开始废弃 componentWillMount componentWillReceiveProps componentWillUpdate 三个钩子函数



## React 16中的生命周期方法与之前版本的生命周期方法有所变化
1. constructor(props)在组件创建时调用，初始化state或绑定事件处理程序。

2. static getDerivedStateFromProps(props, state),此生命周期方法在组件实例化和更新时都会被调用，用于计算和返回新的状态值。当我们接收到新的属性想去修改我们state，可以使用getDerivedStateFromProps

3. render(),此生命周期方法在组件实例化和更新时都会被调用，用于渲染组件。

4. componentDidMount() 在组件挂载后调用，通常用于执行异步操作或从服务器获取数据。

5. shouldComponentUpdate(nextProps, nextState)在组件更新前调用，true表示会触发重新渲染，false表示不会触发重新渲染，默认返回true。

6. getSnapshotBeforeUpdate(prevProps, prevState) 此生命周期方法在组件更新前调用，用于获取更新前的DOM状态。
```
该方法自React 17.0版本开始已被废弃。如果您尝试在React应用程序中使用getSnapshotBeforeUpdate方法，将会收到一个警告。

在React 17.0版本之后，建议使用componentDidUpdate生命周期方法替代getSnapshotBeforeUpdate方法，因为这个方法有更好的可读性和更清晰的用法。

如果您在React 17.0版本之前编写了代码，并且仍然需要使用getSnapshotBeforeUpdate方法，则可以继续使用它。然而，建议在未来的版本中尽早更新代码，以避免可能的问题和错误。
```

7. componentDidUpdate(prevProps, prevState, snapshot) 在组件更新后调用，通常用于更新DOM或执行一些副作用操作。

8. componentWillUnmount() 在组件卸载时调用，用于清除定时器、取消订阅等操作。

注意：在React 17中，`getDerivedStateFromProps`已被废弃，并且组件的不安全生命周期方法（如`componentWillMount`、`componentWillReceiveProps`和`componentWillUpdate`）已被删除。

### getDerivedStateFromProps
/dəˈrīv/
父组件是否传递props，getDerivedStateFromProps()都会被执行。Derived，英文翻译为“衍生的”。顾名思义，就是对props进行加工，然后生成新的state数据。

在React 17中，官方推荐使用静态方法getDerivedStateFromProps替代原来的生命周期方法componentWillReceiveProps。而在React 18中，官方已经将getDerivedStateFromProps标记为弃用方法，建议使用其他替代方案，如组合、状态提升或钩子函数等。
```js
import React, { useState, useEffect } from 'react';

function MyComponent(props) {
  const [state, setState] = useState(props.initialState);

  useEffect(() => {
    setState(props.initialState);
  }, [props.initialState]);
}
```

在挂载角度来看的话，排在render之前。
```js
constructor => getDerivedStateFromProps => render => componentDidMount
```

在更新角度（无论state/props引起的更新）来看的话，排在shouldComponentUpdate之前。
```js
getDerivedStateFromProps => shouldComponentUpdate => render => getSnapshotBeforeUpdate => componentDidUpdate
```

使用例子：组件会根据传入的props更新内部的state状态。在getDerivedStateFromProps方法中，检查props.count是否与state.count相同，如果不同，则返回一个新的状态对象，将props.count更新到组件的状态中。在render方法中，组件会根据最新的state状态来渲染组件。

如果props传入的内容不需要影响到你的state，那么就需要返回一个null
```js
class MyComponent extends React.Component {
  static getDerivedStateFromProps(props, state) {
    // 根据props更新state中的count状态
    if (props.count !== state.count) {
      return {
        count: props.count,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      count: props.count,
    };
  }

  render() {
    return (
      <div>
        Count: {this.state.count}
      </div>
    );
  }
}
```