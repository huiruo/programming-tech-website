---
title: api-useContext
sidebar_position: 53
---

# useContext
任意一个后代元素都可以直接取到上下文的内容 不需要层层传递

很多优秀的React组件都通过Context来完成自己的功能，

```
比如react-redux的`<Provider/>`，就是通过`Context`提供一个全局态的`store`，拖拽组件react-dnd，通过`Context`在组件中分发DOM的Drag和Drop事件。

路由组件react-router通过`Context`管理路由状态等等。在React组件开发中，如果用好`Context`，可以让你的组件变得强大，而且灵活。


调用了 `useContext` 的组件总会在 context 值变化时重新渲染。
当组件上层最近的 <MyContext.Provider> 更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext provider 的 context value 值。

即使祖先使用 React.memo 或 shouldComponentUpdate，也会在组件本身使用 useContext 时重新渲染。

如果重渲染组件的开销较大，你可以 [通过使用 memoization 来优化]

接收一个 context 对象`React.createContext` 的返回值,并返回该 context 的当前值。

别忘记 `useContext` 的参数必须是 *context 对象本身*：
```

```
- **正确：** `useContext(MyContext)`
- **错误：** `useContext(MyContext.Consumer)`
- **错误：** `useContext(MyContext.Provider)`
```
```js
const value = useContext(MyContext);
```

## 案例：在孙子组件中使用爷爷组件中定义的变量n,并且进行+1操作
```js
import React, { createContext, useContext, useReducer, useState } from 'react'
import ReactDOM from 'react-dom'

// 创造一个上下文
const C = createContext(null);

function App(){

  const [n,setN] = useState(0)

  return(
    // 指定上下文使用范围，使用provider,并传入读数据和写入据
    <C.Provider value={{n,setN}}>
      这是爷爷
      <Baba></Baba>
    </C.Provider>
  )
}

function Baba(){

  return(
    <div>
      这是爸爸
      <Child></Child>
    </div>
  )
}

function Child(){
  // 使用上下文，因为传入的是对象，则接受也应该是对象
  const {n,setN} = useContext(C)

  const add=()=>{
    setN(n=>n+1)
  };

  return(
    <div>
      这是儿子:n:{n}
      <button onClick={add}>+1</button>
    </div>
  )
}

ReactDOM.render(<App />,document.getElementById('root'));
```


## 使用 Context、useContext 和 useReducer 来管理状态
Context是 React 官方提供的一个管理数据的方法，他可以让我们避免一级一级地把数据沿着组件树传下来，详情可以参考官方文档
useReducer 则是 hooks 提供的一个类似于 redux 的 api，让我们可以通过 action 的方式来管理 context，或者 state

### 1-1.reducer.js
```js
import React, { useReducer } from "react";

const initialState = 0;
const myContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case "reset":
      return initialState;
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const ContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <myContext.Provider value={{ state, dispatch }}>
      {props.children}
    </myContext.Provider>
  );
};

export { reducer, myContext, ContextProvider }; 
```
我们将所有需要用到 context 的组件放入到Context.Provider的子元素中，这样就可以获取到状态 state 和方法 dispatch。 

### 1-2.Counter.js
子组件中只需要通过useContext API获取这个状态
```js
import React, { useContext } from "react";
import { myContext } from "./reducer";

function Counter() {

  const { state, dispatch } = useContext(myContext);

  return (
    <div>
      Counter Count: {state.count}
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </div>
  );
}

export default Counter;
```

### 1-3.CounterTest.js 
```js
import React, { useContext } from "react";
import { myContext } from "./reducer";

function CounterTest() {
  const { state, dispatch } = useContext(myContext);
  return (
    <div>
      CounterTest Count: {state.count}
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </div>
  );
}

export default CounterTest;
```
 
### 1-4.index.js 
```js
import React from "react";
import { ContextProvider } from "./reducer";
import Counter from "./Counter";
import CounterTest from "./CounterTest";

const App = () => {
  return (
    <div className="App">
      <ContextProvider>
        <Counter />
        <CounterTest />
      </ContextProvider>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```