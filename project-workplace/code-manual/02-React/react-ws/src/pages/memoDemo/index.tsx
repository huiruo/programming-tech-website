import React, { useCallback, useMemo, useState } from 'react';
import { WrapMemo } from './memo-comp';
// 这样不使用meomo将造成子组件渲染
// import { MemoComp as WrapMemo } from './memo-comp';

/**
 * 注释
 */
export function MemoDemo() {
  const [count, setCount] = useState(0)

  const [name, setName] = useState('hi~')

  const [age, setAge] = useState(20)

  /*
  React.memo() 失效了？？？
  
  分析下原因：
  
  1.点击父组件按钮，改变了父组件中 count 变量值（父组件的 state 值），进而导致父组件重新渲染；
  2.父组件重新渲染时，会重新创建 changeName 函数，即传给子组件的 onClick 属性发生了变化，导致子组件渲染；
  
  感觉一切又说的过去，由于子组件的 props 改变了，所以子组件渲染了，没问题呀！
  
  回过头想一想，我们只是点击了父组件的按钮，并未对子组件做任何操作，压根就不希望子组件的 props 有变化。
  
  useCallback 钩子进一步完善这个缺陷。 
  修改父组件的 changeName 方法，用 useCallback 钩子函数包裹一层。
  此时点击父组件按钮，控制台不会打印子组件被渲染的信息了。
  究其原因：useCallback() 起到了缓存的作用，即便父组件渲染了，useCallback() 包裹的函数也不会重新生成，会返回上一次的函数引用。
    */
  const onChangeName = useCallback((newName: any) => setName(newName), [])
  const onIncrement = () => setCount(count + 1)

  /*
  下面例子中，父组件在调用子组件时传递 info 属性，info 的值是个对象字面量，点击父组件按钮时，发现控制台打印出子组件被渲染的信息。
 分析原因跟调用函数是一样的：

  1.点击父组件按钮，触发父组件重新渲染；
  2.父组件渲染，const info = { name, age } 一行会重新生成一个新对象，导致传递给子组件的 info 属性值变化，进而导致子组件重新渲染。 
  使用 useMemo 对对象属性包一层。
  再次点击父组件按钮，控制台中不再打印子组件被渲染的信息了。
  */
  const info = useMemo(() => ({ name, age }), [name, age])   // 包一层

  return <div>
    <button onClick={onIncrement}>点击次数：{count}</button>
    <WrapMemo info={info} onClick={onChangeName} />
  </div>;
}
