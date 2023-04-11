---
title: api-useRef
sidebar_position: 57
---

# useRef
对于useRef(1)，memoizedState保存{current: 1}。

* mount 时：把传进来的 value 包装成一个含有 current 属性的对象，然后放在 memorizedState 属性上。

* update 时：直接返回，没做特殊处理

对于设置了 ref 的节点，什么时候 ref 值会更新？
组件在 commit 阶段的 mutation 阶段执行 DOM 操作，所以对应 ref 的更新也是发生在 mutation 阶段。

当 ref 对象内容发生变化时，`useRef` 并不会通知你。变更 `.current` 属性不会引发组件重新渲染。

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。返回的 ref 对象在组件的整个生命周期内保持不变。


一个常见的用例便是命令式地访问子组件：
```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```