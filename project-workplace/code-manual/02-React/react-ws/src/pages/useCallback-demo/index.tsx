import React, { useState, useEffect, useCallback } from 'react';
import { ListItem } from './list-item';

let count = 0
/**
 * 注释
 */
export function UseCallbackDemo() {
  let [list, setList] = useState<string[]>([])
  let [name, setName] = useState<string>('Kevin');

  useEffect(() => {
    setList([
      '6点起床',
      '7点上班',
      '8点早会'
    ])
  }, []);

  /**
   * useCallback的第一个参数称为"内联回调函数"，第二个参数称为"依赖项"数组。
   * 返回的函数被称为memoized回调函数，该回调函数仅在某个依赖项改变时才会更新。
   *
   * 在子组件里面调用了useCallback返回的addI这个方法后，会执行内联回调函数；
   * 然后setState，整个组件更新，addI方法也会相应的更新。
   */
  const addI = useCallback(() => {
    list.push('行程 ' + count++);
    setList([...list])
  }, [list])

  const modifyName = () => {
    setName('K3VIN' + (++count))
  }

  return <div>
    {
      list.map((item, index) => {
        return (
          <ListItem key={index} addItem={addI}>
            {/*<span>{item}</span>*/}
            {item}
          </ListItem>
        )
      })
    }

    <div>
      <button onClick={() => addI()}>修改列表</button>
    </div>

    <div>
      现在的名字： {name}  <button onClick={modifyName}> 点击修改名字 </button>
    </div>
  </div>;
}
