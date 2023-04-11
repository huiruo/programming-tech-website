## html
```html
<script type="text/babel">
  function Test() {
    const [data, setData] = React.useState('改变我')

    const onClickText = () => {
      console.log('onClick');
      setData('努力')
    }

    return (
      <div>
        <button onClick={onClickText} className="btn">Click Me</button>
        <span>{data}</span>
      </div>
    )
  }

  // 17 写法
  // ReactDOM.render(<Test />, document.getElementById('root'))

  // 18 写法
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(<Test />);
</script>
```

## 第一步：createRoot
```js
function createRoot(container, options) {
  if (!isValidContainer(container)) {
    throw new Error('createRoot(...): Target container is not a DOM element.');
  }

  warnIfReactDOMContainerInDEV(container);
  var isStrictMode = false;
  var concurrentUpdatesByDefaultOverride = false;
  var identifierPrefix = '';
  var onRecoverableError = defaultOnRecoverableError;
  var transitionCallbacks = null;

  if (options !== null && options !== undefined) {
    {
      if (options.hydrate) {
        warn('hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.');
      } else {
        if (typeof options === 'object' && options !== null && options.$$typeof === REACT_ELEMENT_TYPE) {
          error('You passed a JSX element to createRoot. You probably meant to ' + 'call root.render instead. ' + 'Example usage:\n\n' + '  let root = createRoot(domContainer);\n' + '  root.render(<App />);');
        }
      }
    }

    if (options.unstable_strictMode === true) {
      isStrictMode = true;
    }

    if (options.identifierPrefix !== undefined) {
      identifierPrefix = options.identifierPrefix;
    }

    if (options.onRecoverableError !== undefined) {
      onRecoverableError = options.onRecoverableError;
    }

    if (options.transitionCallbacks !== undefined) {
      transitionCallbacks = options.transitionCallbacks;
    }
  }

  console.log('初始-->createRoot')
  var root = createContainer(container, ConcurrentRoot, null, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError);
  markContainerAsRoot(root.current, container);
  var rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
  listenToAllSupportedEvents(rootContainerElement);
  return new ReactDOMRoot(root);
}
```

## 第二步：在 return new ReactDOMRoot(root) 调用下面函数
```js
ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function (children) {
  var root = this._internalRoot;

  if (root === null) {
    throw new Error('Cannot update an unmounted root.');
  }

  {
    if (typeof arguments[1] === 'function') {
      error('render(...): does not support the second callback argument. ' + 'To execute a side effect after rendering, declare it in a component body with useEffect().');
    } else if (isValidContainer(arguments[1])) {
      error('You passed a container to the second argument of root.render(...). ' + "You don't need to pass it again since you already passed it to create the root.");
    } else if (typeof arguments[1] !== 'undefined') {
      error('You passed a second argument to root.render(...) but it only accepts ' + 'one argument.');
    }

    var container = root.containerInfo;

    if (container.nodeType !== COMMENT_NODE) {
      var hostInstance = findHostInstanceWithNoPortals(root.current);

      if (hostInstance) {
        if (hostInstance.parentNode !== container) {
          error('render(...): It looks like the React-rendered content of the ' + 'root container was removed without using React. This is not ' + 'supported and will cause errors. Instead, call ' + "root.unmount() to empty a root's container.");
        }
      }
    }
  }

  console.log('初始-->ReactDOMRoot.prototype.render');
  console.log('update-Container 1');
  updateContainer(children, root, null, null);
};
```