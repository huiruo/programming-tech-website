---
title: api-自定义hooks
sidebar_position: 58
---

## 自定义hooks
在组件之间重用一些状态逻辑。有两种主流方案来解决这个问题：

* 高阶组件

* 自定义 Hook 可以让你在不增加组件的情况下达到同样的目的。

### 定义
需要注意的是，自定义 Hook 的名称必须以 "use" 开头，并且只能在函数组件中使用。这是因为 React 会根据 Hook 的名称来判断它是否是一个 Hook

通过使用自定义 Hook，我们可以更加方便地实现类似于 HOC 的功能，从而避免了 HOC 带来的一些问题，例如：命名冲突、props 的传递问题等。同时，自定义 Hook 也可以更加方便地复用逻辑代码，使得代码更加简洁、易于维护和重用。


在上面的代码中，我们定义了一个 useLogging Hook，它接收一个 componentName 参数，并使用 useEffect Hook 来模拟 componentDidMount 和 componentWillUnmount 方法。在 useEffect 回调函数中打印日志，以便于跟踪组件的生命周期。

在 MyComponent 组件中，我们调用了 useLogging 自定义 Hook，并将组件名称作为参数传递给它。这样，在 MyComponent 组件渲染时，useLogging Hook 就会被调用，并在 useEffect 回调函数中打印日志。
```js
import React, { useState, useEffect } from 'react';

function useLogging(componentName) {
  useEffect(() => {
    console.log(`Component ${componentName} mounted`);
    return () => {
      console.log(`Component ${componentName} will unmount`);
    };
  }, [componentName]);
}

function MyComponent(props) {
  useLogging('MyComponent');

  return <div>{props.text}</div>;
}

export default MyComponent;
```

### 场景
例如：
我们介绍了一个叫 `FriendStatus` 的组件，它通过调用 `useState` 和 `useEffect` 的 Hook 来订阅一个好友的在线状态。假设我们想在另一个组件里重用这个订阅逻辑。

首先，我们把这个逻辑抽取到一个叫做 `useFriendStatus` 的自定义 Hook 里：

这两个组件的 state 是完全独立的。Hook 是一种复用*状态逻辑*的方式，它不复用 state 本身。事实上 Hook 的每次*调用*都有一个完全独立的 state —— 因此你可以在单个组件中多次调用同一个自定义 Hook。

自定义 Hook 更像是一种约定而不是功能。如果函数的名字以 “`use`” 开头并调用其他 Hook，我们就说这是一个自定义 Hook。 `useSomething` 的命名约定可以让我们的 linter 插件在使用 Hook 的代码中找到 bug。

你可以创建涵盖各种场景的自定义 Hook，如表单处理、动画、订阅声明、计时器，甚至可能还有更多我们没想到的场景
```js
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}

//它将 friendID 作为参数，并返回该好友是否在线：
```

现在我们可以在两个组件中使用它：
```js
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

在 JavaScript 中，你可以使用自定义钩子（Custom Hooks）来处理各种与组件逻辑和状态管理相关的任务。自定义钩子是一种函数，通常以 "use" 开头，它可以在多个组件中共享和重用逻辑。以下是一些常见的用例，可以使用自定义钩子来处理：

### 1. **状态管理**:
   - 创建一个自定义钩子来管理组件的状态。这可以帮助你更容易地共享状态逻辑并将其重用在多个组件中。
```js
import { useState, useEffect } from 'react'
import { setCookie, getCookie, deleteCookie } from 'cookies-next'

interface TokenHelpers {
  // eslint-disable-next-line no-unused-vars
  setToken: (newToken: string) => void
  deleteCookie: () => void
}

type UseTokenReturn = [string | null, TokenHelpers]

function useToken(): UseTokenReturn {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const tokenFromCookie = getCookie('token')
    if (tokenFromCookie) {
      setToken(tokenFromCookie as string)
    }
  }, [])

  const tokenHelpers: TokenHelpers = {
    setToken: (newToken: string) => {
      setCookie('token', newToken)
      setToken(newToken)
    },
    deleteCookie: () => {
      deleteCookie('token')
      setToken(null)
    },
  }

  return [token, tokenHelpers]
}

export default useToken
```


### 使用自定义hooks 传递兄弟组件状态
传递兄弟组件状态通常需要使用上下文（Context）来实现。

创建自定义钩子:
首先，创建一个自定义钩子，用于管理共享状态。这个自定义钩子可以使用 React 上下文来共享状态。
```js
import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export function useStateProvider() {
  const [state, setState] = useState(initialState);

  return { state, setState };
}

export function StateProvider({ children }) {
  const value = useStateProvider();
  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export function useStateValue() {
  return useContext(StateContext);
}
```

```js
// 在组件中使用自定义钩子
function App() {
  return (
    <div>
      <StateProvider>
        <ComponentA />
        <ComponentB />
      </StateProvider>
    </div>
  );
}

// 在子组件中使用共享状态:
import React from 'react';
import { useStateValue } from './YourStateProvider';

function ComponentA() {
  const { state, setState } = useStateValue();

  // 在 ComponentA 中使用 state 和 setState
  return (
    <div>
      <button onClick={() => setState(newState)}>Update State</button>
    </div>
  );
}

function ComponentB() {
  const { state } = useStateValue();

  // 在 ComponentB 中使用 state
  return <div>{state}</div>;
}
```


### 2. **数据获取**:
   - 使用自定义钩子来处理数据获取逻辑，例如从 API 获取数据或从本地存储中读取数据。
```js
const useFetchImg = (): [ImgType[], boolean, Error | null] => {
  const [data, setData] = useState<ImgType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true)

      try {
        console.log('useFetchImg==>')
        const data = await codePlatformApi.listImg()
        if (data.code === 1) {
          setData(data.data)
        } else {
          setError(data.msg)
        }
      } catch (error: unknown) {
        setError(error as Error)
      }

      setIsLoading(false)
    }

    fetchImages()
  }, [])

  return [data, isLoading, error]
}

export default useFetchImg

// 使用
const [images, isLoading] = useFetchImg()
```

### 3. **表单处理**:
   - 创建自定义钩子来简化表单处理逻辑，包括表单字段验证、状态管理和提交处理。

### 5. **定时器和周期性任务**:
   - 使用自定义钩子来处理定时器和周期性任务，以便执行周期性操作或定时刷新数据。

自定义钩子的原理很简单，它们实际上就是普通的 JavaScript 函数，只是遵循了特定的命名约定。这些函数可以包含任何你需要的逻辑，可以访问 React 钩子（如 `useState`、`useEffect` 等），并返回一些状态、函数或其他数据，以供组件使用。原理如下：

1. 创建自定义钩子函数，通常以 "use" 开头。例如，一个自定义钩子函数可以命名为 `useCustomHook`。

2. 在自定义钩子函数内部，你可以编写任何逻辑，包括状态管理、数据获取、事件监听等。你可以使用 React 钩子，如 `useState` 和 `useEffect`，来管理组件内部的状态和副作用。

3. 在自定义钩子函数的最后，返回需要在组件中使用的数据或函数。这可以是一个状态值、更新状态的函数、事件处理函数，或者任何你认为有用的数据。

4. 在组件中使用自定义钩子，只需在组件函数中调用它。自定义钩子会提供在自定义钩子中定义的数据和逻辑，以便组件可以访问和使用它们。

自定义钩子的优点在于，它们可以帮助你将组件的逻辑和状态拆分为可重用的部分，从而更好地组织和维护代码。此外，自定义钩子也可以在不同的组件中共享，提高代码的可维护性和可重用性。
