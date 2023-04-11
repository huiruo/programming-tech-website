import React, { memo, useEffect } from 'react';

/**
 * 注释
 */
type MyProps = {
  addItem: () => void
  children: string
  // children: JSX.Element  //如果是节点的话优化不生效
}
export const ListItem = memo((props: MyProps) => {
  let addItem = props.addItem

  useEffect(() => {
    console.log('子组件ListItem 加载')
  }, [])

  useEffect(() => {
    console.log('子组件render', props.children)
  })

  return (
    <div onClick={addItem}> {props.children} </div>
  )
})
