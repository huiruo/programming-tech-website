import { createStore, combineReducers, applyMiddleware } from 'redux';
// import logger from 'redux-logger';
import thunk from 'redux-thunk';
import userStore from './user.store';
// import { composeWithDevTools } from 'redux-devtools-extension';

const reducer = combineReducers({
  userStore,
});

// const enhancers = process.env.APP_ENV === 'dev' ? composeWithDevTools(
//   applyMiddleware(thunk, logger)
// ) : applyMiddleware(thunk);

const enhancers = applyMiddleware(thunk)

console.log('=createStore=start:')
const store: any = createStore(reducer, enhancers);
console.log('=createStore=end:store', store)

export default store;
