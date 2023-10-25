---
title: api-useCallback
sidebar_position: 52
---

# useCallback
对于useCallback(callback, [depA])，memoizedState保存[callback, depA]。与useMemo的区别是，useCallback保存的是callback函数本身，而useMemo保存的是callback函数的执行结果。

* mount 时：在 memorizedState 上放了一个数组，第一个元素是传入的回调函数，第二个是传入的 deps。
* update 时：更新的时候把之前的那个 memorizedState 取出来，和新传入的 deps 做下对比，如果没变，那就返回之前的回调函数，否则返回新传入的函数。

useCallback() 起到了缓存的作用，即便父组件渲染了，useCallback() 包裹的函数也不会重新生成，会返回上一次的函数引用。

通过源码不难发现，useCallback 实现是通过暂存定义的函数，根据前后依赖比较是否更新暂存的函数，最后返回这个函数，从而产生闭包达到记忆化的目的。 这就直接导致了我想使用 useCallback 获取最新 state 则必须要将这个 state 加入依赖，从而产生新的函数。
```js
// 装载阶段
function mountCallback(callback, deps) {
  // 获取对应的 hook 节点
  var hook = mountWorkInProgressHook();
  // 依赖为 undefined，则设置为 null
  var nextDeps = deps === undefined ? null : deps;
  // 将当前的函数和依赖暂存
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

// 更新阶段
function updateCallback(callback, deps) {
  var hook = updateWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  // 获取上次暂存的 callback 和依赖
  var prevState = hook.memoizedState;

  if (prevState !== null) {
    if (nextDeps !== null) {
      var prevDeps = prevState[1];
      // 将上次依赖和当前依赖进行浅层比较，相同的话则返回上次暂存的函数
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }

  // 否则则返回最新的函数
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function areHookInputsEqual(nextDeps, prevDeps) {
  {
    if (ignorePreviousDependencies) {
      // Only true when this component is being hot reloaded.
      return false;
    }
  }

  if (prevDeps === null) {
    {
      error('%s received a final argument during this render, but not during ' + 'the previous render. Even though the final argument is optional, ' + 'its type cannot change between renders.', currentHookNameInDev);
    }

    return false;
  }

  {
    // Don't bother comparing lengths in prod because these arrays should be
    // passed inline.
    if (nextDeps.length !== prevDeps.length) {
      error('The final argument passed to %s changed size between renders. The ' + 'order and size of this array must remain constant.\n\n' + 'Previous: %s\n' + 'Incoming: %s', currentHookNameInDev, "[" + prevDeps.join(', ') + "]", "[" + nextDeps.join(', ') + "]");
    }
  }

  for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (objectIs(nextDeps[i], prevDeps[i])) {
      continue;
    }

    return false;
  }

  return true;
}
```

## 组件需要类似useCallback 的函数吗？还是类组件每次刷新不会生成新的函数？
在React类组件中，函数是否会被重新创建取决于函数的定义和组件的重新渲染方式。与函数组件不同，类组件没有像useCallback这样的Hook，但你可以手动控制函数的重新创建。

在类组件中，通常情况下，每当组件重新渲染时，与该组件关联的函数也会重新创建。这是因为函数通常是在组件的方法或渲染函数中定义的，每次组件重新渲染时，这些函数都会重新创建。

如果你希望防止函数在每次重新渲染时都重新创建，你可以将函数定义移到类的构造函数中，这样它将只在组件实例创建时被定义一次。例如：
```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.myFunction = this.myFunction.bind(this);
  }

  myFunction() {
    // Your function logic here
  }

  render() {
    // ...
  }
}
```

## useCallback的使用场景1：
父组件包含子组件，子组件接收一个函数作为 props ；通常而言，如果父组件更新了，子组件也会执行更新；但是大多数场景下，更新是没有必要的，我们可以借助 useCallback 来返回函数，然后把这个函数作为 props 传递给子组件；这样，子组件就能避免不必要的更新。
```js
//使用useCallback之后，仅当 count 发生变化时Child组件才会重新渲染，而val变化时，Child 组件是不会重新渲染的
function Parent() {
    const [count, setCount] = useState(1);
    const [val, setValue] = useState('');
 
    const getNum = useCallback(() => {
        return Array.from({length: count * 100}, (v, i) => i).reduce((a, b) => a+b)
    }, [count])
 
    return <div>
        <Child getNum={getNum} />
        <div>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <input value={val} onChange={event => setValue(event.target.value)}/>
        </div>
    </div>;
}
 
const Child = React.memo(function ({ getNum }: any) {
    return <h4>总和：{getNum()}</h4>
})
```

## useCallback的使用场景2：
当 DemoComponent 组件自身或跟随父组件触发 render 时，handleClick 函数会被重新创建。 每次 render 时 ChildComponent 参数中会接受一个新的 onClick 参数，这会直接击穿 React.memo，导致性能优化失效，并联动一起 render。

当然，官方文档指出，在组件内部中每次跟随 render 而重新创建函数的开销几乎可以忽略不计。若不将函数传给自组件，完全没有任何问题，而且开销更小。
```js
const ChildComponent = React.memo(() => {
  // ...
  return <div>Child</div>;
});

function DemoComponent() {
  const [count, setCount] = React.useState(0);
  function handleClick() {
    // 业务逻辑
  }
  return <ChildComponent onClick={handleClick} />;
}
```

`用useCallback包裹：`
如果去除依赖，这时内部逻辑取得的 count 的值永远为初始值即 0，也就是拿不到最新的值。
如果将内部的逻辑作为 function 提取出来作为依赖，这会导致 useCallback 失效。
```js
const ChildComponent = React.memo(() => {
  // ...
  return <div>Child</div>;
});

function DemoComponent() {
  const [count, setCount] = React.useState(0);
  
  const handleClick = React.useCallback(() => {
    // 业务逻辑
    doSomething(count);
  }, []);

  return <ChildComponent onClick={handleClick} />;
}
```

### useCallback配合memo()使用
momo()一般配合useCallback() 或则：useMemo()起到了缓存的作用，即便父组件渲染了，useCallback() 包裹的函数也不会重新生成，会返回上一次的函数引用。
```js
// 父组件
import React, { useCallback } from 'react'
 
function ParentComp () {
  const [ name, setName ] = useState('hi~')
  // 每次父组件渲染，返回的是同一个函数引用
  const changeName = useCallback((newName) => setName(newName), [])  
 
  return (
    <div>
      <button onClick={increment}>点击次数：{count}</button>
      <ChildComp name={name} onClick={changeName}/>
    </div>
  );
}


// 子
import React, { memo } from 'react'
  const ChildComp = memo(function ({ name, onClick }) {

  return <>
    <div>Child Comp ... {name}</div>
    <button onClick={() => onClick('hello')}>改变 name 值</button>
  </>
})
```