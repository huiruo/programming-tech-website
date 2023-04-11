import React, { forwardRef } from 'react'
import { double } from './double'

/**
 * 高阶组件
 */
const CountView = (props: any, ref: any) => {

  const { count, bg, divClick } = props

  return (
    <div
      onClick={divClick}
      ref={ref}
      style={{
        width: '50px',
        height: '50px',
        background: bg,
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {count}
    </div>
  )
}

export default double(forwardRef(CountView))