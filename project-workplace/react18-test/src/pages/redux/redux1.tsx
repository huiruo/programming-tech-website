import React, { useState } from 'react';
import { connect } from 'react-redux';
import { onIncreaseAction } from '../../store/userActions';

interface Props {
  test: React.ReactNode
}

/**
 * Code annotation
 */
function Redux1(props: any) {
  const [val, setVal] = useState(1)

  const { increaseVal } = props

  const onIncrease = () => {
    props.onIncreaseAction && props.onIncreaseAction(increaseVal + 1)
  }

  console.log('=Redux1 render:', props)

  return (
    <div>
      同级组件
      <button onClick={onIncrease}>增加</button>
    </div>
  );
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onIncreaseAction: (data: string) => dispatch(onIncreaseAction(data)),
  };
};

const mapStateToProps = (state: any) => {
  return {
    increaseVal: state.userStore.increaseVal
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Redux1);
