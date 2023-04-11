import React from 'react';
import { connect } from 'react-redux';

interface Props {
  test?: React.ReactNode
  increaseVal?: number
}

/**
 * Code annotation
 */
function Redux2(props: Props) {
  const { increaseVal } = props

  console.log('=Redux2 render:', props)
  return (
    <div>
      同级组件,增加的值：<span>
        {increaseVal}
      </span>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    increaseVal: state.userStore.increaseVal
  };
};

export default connect(mapStateToProps, null)(Redux2);
