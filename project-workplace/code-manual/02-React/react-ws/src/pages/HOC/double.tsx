import React, { useState, useRef } from 'react'

export const double = (WrappedComponent: any) => {

  return (props: any, ref: any) => {

    const [bg, setBg] = useState('#090')

    const WrappedComponentRef = useRef()

    const { count } = props

    const divClick = () => {
      setBg('#900')
      console.log(WrappedComponentRef.current)
    }

    return (
      <WrappedComponent ref={WrappedComponentRef} divClick={divClick} bg={bg} count={count * 2} />
    )
  }
}
