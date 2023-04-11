import React, { useState } from 'react';
import CountView from './count-view';

/**
 * 注释
 */
export function HOC() {
  const [count, setCount] = useState(1)

  const onClick = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <h1>HocDemo测试</h1>

      <CountView count={count} />

      <button onClick={() => onClick()}>点击</button>
    </div>
  )
}