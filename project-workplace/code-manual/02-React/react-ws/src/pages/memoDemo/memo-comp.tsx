import React, { memo } from 'react';

interface MemoParentProps {
  info: any
  onClick: any
}
/**
 * 注释
 */
export function MemoComp(props: MemoParentProps) {
  const { info } = props

  console.log('MemoParent-render')
  return (
    <>
      <div>{info.name}</div>
      <div>{info.age}</div>
    </>
  );
}

export const WrapMemo = memo(MemoComp);