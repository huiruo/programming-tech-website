---
title: 基础-自定义hooks
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

## 例子
还是上面的例子，我们把取数据的逻辑抽出来：
```js
// useFetch.tsx
import { useState, useEffect } from "react";

export default function useFetch(url) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => setData(data));
  }, [] );

  return data;
}
```

在其他组件中引用：
```js
import React from "react";
import useFetch from "./useFetch";

export default function DataLoader(props) {

  const data = useFetch("http://localhost:3001/links/");

  return (
    <div>
      <ul>
        {data.map(el => (
          <li key={el.id}>{el.title}</li>
        ))}
      </ul>
    </div>
  );
}
```