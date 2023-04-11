import React from 'react';
import { useState, useRef, useEffect } from 'react'

let countTimer: any = null
/**
 * 计时器
 * 正确写法是setInterval只定义一次，它的回调函数保存状态的更新，
 * 重点是把count更新和setInterval定义分开。
 */
export function CountTimer() {

  let [count, setCount] = useState(0)
  let intervalCb: any = useRef(null)

  useEffect(() => {
    intervalCb.current = () => {
      setCount(count + 1)
    }
  }, [count])

  useEffect(() => {
    function itvFn() {
      intervalCb.current()
    }
    countTimer = window.setInterval(itvFn, 1000)

    return () => window.clearInterval(countTimer)
  }, [])

  const handleStop = () => {
    window.clearInterval(countTimer)
  }

  return (
    <React.Fragment>
      <div >{count}</div>
      <div onClick={() => handleStop()}>停止计时</div>
    </React.Fragment>
  )
}
