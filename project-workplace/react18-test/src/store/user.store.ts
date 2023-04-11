import { ON_INCREASE } from "./userActions";

const initUserState = {
  increaseVal: 1
};
const userStore = (
  state = initUserState,
  action: any
) => {

  const { payload, type } = action;

  switch (type) {
    case ON_INCREASE:
      console.log('ON_INCREASE', payload);
      const userState = { ...state, increaseVal: action.payload };

      return userState;
    case ON_INCREASE:
      console.log('ON_INCREASE');

      return {};
    default:
      return state;
  }
};

export default userStore;
