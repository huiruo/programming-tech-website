import React from 'react';
import Redux1 from './redux1';
import Redux2 from './redux2';

// interface Props {
//   test: React.ReactNode
// }

/**
 * Code annotation
 */
export function ReduxPage() {

  return (
    <div>
      父组件
      <Redux1 />
      <Redux2 />
    </div>
  );
}