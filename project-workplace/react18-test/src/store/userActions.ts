import { Dispatch } from 'redux';

const ON_INCREASE = 'ON_INCREASE';

export {
  ON_INCREASE,
};


export const onIncreaseAction = (data: string) => (dispatch: Dispatch) => {
  dispatch({
    type: ON_INCREASE,
    payload: data
  });
};
