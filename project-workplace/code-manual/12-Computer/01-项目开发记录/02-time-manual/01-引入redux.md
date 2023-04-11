## redux
```
"redux": "^4.1.1",
"redux-logger": "^3.0.6",
"redux-thunk": "^2.3.0",
"react-redux": "^7.2.5",

@types/redux-logger

yarn add redux
yarn add redux-logger
yarn add redux-thunk
yarn add react-redux
yarn add @types/redux-logger
```

## Redux DevTools
```
npm install redux-devtools-extension -D
或则用yarn:
yarn add redux-devtools-extension -D
```

## 例子：
```js
/*
const store = createStore(reducer, composeWithDevTools());
const store = createStore(reducer, applyMiddleware(thunk, logger));
const store = createStore(reducer, applyMiddleware(thunk));
const store = createStore(reducer, composeWithDevTools(
  applyMiddleware(thunk, logger)
));

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('process.env.APP_ENV', process.env.APP_ENV);
*/

// const enhancers = process.env.NODE_ENV === 'development' ? composeWithDevTools(
const enhancers = process.env.APP_ENV === 'dev' ? composeWithDevTools(
  applyMiddleware(thunk, logger)
) : applyMiddleware(thunk);

const store = createStore(reducer, enhancers);
```
