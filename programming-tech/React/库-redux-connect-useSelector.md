
## redux 中 createStore 代码的简化版:
通过闭包创建 state，同时对外暴露更新 state 数据( dispatch 方法)和获取 state 数据( getState 方法 ) 的实现。
```js
function createStore (reducer, preloadedState, enhancer) {
  let currentReducer = reducer                // 存放 reducer
  let currentState = preloadedState           // 闭包，存放 state
  let currentListeners = []
  let nextListeners = currentListeners        // 存放所有的 listener
  let isDispatching = false

  function getState () {
    return currentState                       // 返回闭包中 state 的结果
  }

  function subscribe (listener) {
    nextListeners.push(listener)              // 新增 listener

    return function unsubscribe () {
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)          // 移除 listener
    }
  }

  function dispatch (action) {
    if (isDispatching) {
      // 防止在 reducer 中再次执行 dispatch
      throw new Error('Reducers may not dispatch actions.')
    }
    try {
      // 执行 dispatch 时，dispatch 为 true
      // 相当于锁住了该状态，比如，防止在 reducer 中再次执行 dispatch
      isDispatching = true
      // 将闭包的 state, 和 action 进行计算，从而更新 state
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    // 在 dispatch 之后，通知所有的 listener
    const listeners = (currentListeners = nextListeners)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    return action
  }

  dispatch({ type: `@@redux/INIT+随机数` })

  return {
    dispatch,
    subscribe,
    getState
  }
}
```

## redux 和 context
App根节点组件提供的`Context`对象可以看成是App级的全局作用域，所以，我们利用App根节点组件提供的`Context`对象创建一些App级的全局数据。现成的例子可以参考react-redux，以下是`<Provider />`组件源码的核心实现：

App的根组件用`<Provider />`组件包裹后，本质上就为App提供了一个全局的属性`store`，相当于在整个App范围内，共享`store`属性。当然，`<Provider />`组件也可以包裹在其他组件中，在组件级的全局范围内共享`store`。
```js
export function createProvider(storeKey = 'store', subKey) {
    const subscriptionKey = subKey || `${storeKey}Subscription`

    class Provider extends Component {
        getChildContext() {
          return { [storeKey]: this[storeKey], [subscriptionKey]: null }
        }

        constructor(props, context) {
          super(props, context)
          this[storeKey] = props.store;
        }

        render() {
          return Children.only(this.props.children)
        }
    }

    // ......

    Provider.propTypes = {
        store: storeShape.isRequired,
        children: PropTypes.element.isRequired,
    }
    Provider.childContextTypes = {
        [storeKey]: storeShape.isRequired,
        [subscriptionKey]: subscriptionShape,
    }

    return Provider
}

export default createProvider()
```


selectorFactoryOptions的对象最终交给 defaultSelectorFactory 使用
```js
const childPropsSelector = useMemo(() => {
  // The child props selector needs the store reference as an input.
  // Re-create this selector whenever the store changes.
  return defaultSelectorFactory(store.dispatch, selectorFactoryOptions);
}, [store]);
```

1. childPropsSelector就是最终返回真正需要值的函数（它真的是高阶函数的终点了~）
2. defaultSelectorFactory函数做了什么，它实际叫finalPropsSelectorFactory
```js
function defaultSelectorFactory(dispatch, _ref) {
  let {
    initMapStateToProps,
    initMapDispatchToProps,
    initMergeProps
  } = _ref,
    options = _objectWithoutPropertiesLoose(_ref, _excluded_selectorFactory);

  const mapStateToProps = initMapStateToProps(dispatch, options);
  const mapDispatchToProps = initMapDispatchToProps(dispatch, options);
  const mergeProps = initMergeProps(dispatch, options);

  if (process.env.NODE_ENV !== 'production') {
    verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps);
  }

  return pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
}
```

```js
function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, {
  areStatesEqual,
  areOwnPropsEqual,
  areStatePropsEqual
}) {
  let hasRunAtLeastOnce = false;
  let state;
  let ownProps;
  let stateProps;
  let dispatchProps;
  let mergedProps;

  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState;
    ownProps = firstOwnProps;
    stateProps = mapStateToProps(state, ownProps);
    dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps);
    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);
    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewState() {
    const nextStateProps = mapStateToProps(state, ownProps);
    const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;
    if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleSubsequentCalls(nextState, nextOwnProps) {
    const propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
    const stateChanged = !areStatesEqual(nextState, state, nextOwnProps, ownProps);
    state = nextState;
    ownProps = nextOwnProps;
    if (propsChanged && stateChanged) return handleNewPropsAndNewState();
    if (propsChanged) return handleNewProps();
    if (stateChanged) return handleNewState();
    return mergedProps;
  }

  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
  };
}
```

## pureFinalPropsSelectorFactory
`mapStateToProps、mapDispatchToProps、mergeProps是会返回各自最终值的函数。更多应该关注的重点是 pureFinalPropsSelectorFactory 函数`

它的闭包hasRunAtLeastOnce用以区分是否首次调用，首次和后续是不同的函数，如果是首次调用则是使用handleFirstCall函数，它里面产生stateProps、产生dispatchProps，然后将它们放入mergeProps计算出最终的 props，同时把hasRunAtLeastOnce设置为true，表示已经不是第一次执行了。

后续调用都走handleSubsequentCalls，它的主要目的是如果 state 和 props 都没有变化则使用缓存数据（state、props 是否变化的判断方法是外部传进来的，组件当然能知道自己有没有变化），如果 state、props 都有变化或者只是其中一个有变化，再分别调用各自的函数（里面主要是根据静态属性dependsOnOwnProps判断是否要重新执行）得到新值。

于是childPropsSelector函数就是返回的pureFinalPropsSelector函数，内部访问了闭包，闭包保存了持久值，从而在组件多次执行的情况下，可以决定是否需要使用缓存来优化性能。

selector 相关的分析完了。

### 总结：childPropsSelector就是返回 selector
总的来说，如果想实现一个最简单的selector，只需要
```js
const selector = (state, ownProps) => {
  const stateProps = mapStateToProps(reduxState);
  const dispatchProps = mapDispatchToProps(reduxDispatch);
  const actualChildProps = mergeProps(stateProps, dispatchProps, ownProps);
  return actualChildProps;
};
```

那为什么 react-redux 会写的如此复杂呢。就是为了connect组件在多次执行时能利用细粒度缓存的 mergedProps 值提升性能，React 只能做到在wrapperProps不变时使用 memo，但难以做更细粒度的区分，比如知道 selector 是否依赖 props，从而就算 props 变化了也不需要更新。要实现这一点需要大量嵌套的高阶函数储存持久化的闭包中间值，才能在组件多次执行时不丢失状态从而判断更新。

下面我们准备讲点别的了，如果你对一系列调用栈有点头晕，你只要记住看到了childPropsSelector就是返回 selector 后的值就好了


## connect函数
WrappedComponent 就是用户传入的业务组件，ContextToUse.Provider会将该 connect 的subscription传给下层，如果业务组件里还有 connect 就可以嵌套订阅。是否需要 context 透传是由shouldHandleStateChanges变量决定的，如果没有mapStateToProps的话，它则是false。也就是说如果连mapStateToProps都没有，那这个组件及其子组件也就没有订阅 redux 的必要。

```js
function connect(mapStateToProps, mapDispatchToProps, mergeProps, {
  // The `pure` option has been removed, so TS doesn't like us destructuring this to check its existence.
  // @ts-ignore
  pure,
  areStatesEqual = strictEqual,
  areOwnPropsEqual = shallowEqual,
  areStatePropsEqual = shallowEqual,
  areMergedPropsEqual = shallowEqual,
  // use React's forwardRef to expose a ref of the wrapped component
  forwardRef = false,
  // the context consumer to use
  context = ReactReduxContext
} = {}) {
  // if (process.env.NODE_ENV !== 'production') {
  if (pure !== undefined && !hasWarnedAboutDeprecatedPureOption) {
    hasWarnedAboutDeprecatedPureOption = true;
    warning('The `pure` option has been removed. `connect` is now always a "pure/memoized" component');
  }
  // }
  const Context = context;
  const initMapStateToProps = mapStateToPropsFactory(mapStateToProps);
  const initMapDispatchToProps = mapDispatchToPropsFactory(mapDispatchToProps);
  const initMergeProps = mergePropsFactory(mergeProps);
  const shouldHandleStateChanges = Boolean(mapStateToProps);

  console.log('%c=react-redux=connect执行wrapWithConnect', 'color:chartreuse')

  const wrapWithConnect = WrappedComponent => {
    // if (process.env.NODE_ENV !== 'production' && !isValidElementType(WrappedComponent)) {
    //   throw new Error(`You must pass a component to the function returned by connect. Instead received ${stringifyComponent(WrappedComponent)}`);
    // }

    const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    const displayName = `Connect(${wrappedComponentName})`;
    const selectorFactoryOptions = {
      shouldHandleStateChanges,
      displayName,
      wrappedComponentName,
      WrappedComponent,
      // @ts-ignore
      initMapStateToProps,
      // @ts-ignore
      initMapDispatchToProps,
      initMergeProps,
      areStatesEqual,
      areStatePropsEqual,
      areOwnPropsEqual,
      areMergedPropsEqual
    };

    console.log('%c=react-redux=connect返回selectorFactoryOptions', 'color:chartreuse', selectorFactoryOptions)

    function ConnectFunction(props) {
      console.log('%c=react-redux=ConnectFunction正式执行', 'color:chartreuse')
      const [propsContext, reactReduxForwardedRef, wrapperProps] = useMemo(() => {
        // Distinguish between actual "data" props that were passed to the wrapper component,
        // and values needed to control behavior (forwarded refs, alternate context instances).
        // To maintain the wrapperProps object reference, memoize this destructuring.
        const {
          reactReduxForwardedRef
        } = props,
          wrapperProps = _objectWithoutPropertiesLoose(props, _excluded);

        return [props.context, reactReduxForwardedRef, wrapperProps];
      }, [props]);
      const ContextToUse = useMemo(() => {
        // Users may optionally pass in a custom context instance to use instead of our ReactReduxContext.
        // Memoize the check that determines which context instance we should use.
        return propsContext && propsContext.Consumer && // @ts-ignore
          isContextConsumer( /*#__PURE__*/React.createElement(propsContext.Consumer, null)) ? propsContext : Context;
      }, [propsContext, Context]); // Retrieve the store and ancestor subscription via context, if available

      const contextValue = useContext(ContextToUse); // The store _must_ exist as either a prop or in context.
      // We'll check to see if it _looks_ like a Redux store first.
      // This allows us to pass through a `store` prop that is just a plain value.

      const didStoreComeFromProps = Boolean(props.store) && Boolean(props.store.getState) && Boolean(props.store.dispatch);
      const didStoreComeFromContext = Boolean(contextValue) && Boolean(contextValue.store);

      if (process.env.NODE_ENV !== 'production' && !didStoreComeFromProps && !didStoreComeFromContext) {
        throw new Error(`Could not find "store" in the context of ` + `"${displayName}". Either wrap the root component in a <Provider>, ` + `or pass a custom React context provider to <Provider> and the corresponding ` + `React context consumer to ${displayName} in connect options.`);
      } // Based on the previous check, one of these must be true


      const store = didStoreComeFromProps ? props.store : contextValue.store;
      const getServerState = didStoreComeFromContext ? contextValue.getServerState : store.getState;
      const childPropsSelector = useMemo(() => {
        // The child props selector needs the store reference as an input.
        // Re-create this selector whenever the store changes.
        return defaultSelectorFactory(store.dispatch, selectorFactoryOptions);
      }, [store]);
      const [subscription, notifyNestedSubs] = useMemo(() => {
        console.log('=react-redux=ConnectFunction=阅的重点')
        if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY; // This Subscription's source should match where store came from: props vs. context. A component
        // connected to the store via props shouldn't use subscription from context, or vice versa.

        const subscription = createSubscription(store, didStoreComeFromProps ? undefined : contextValue.subscription); // `notifyNestedSubs` is duplicated to handle the case where the component is unmounted in
        // the middle of the notification loop, where `subscription` will then be null. This can
        // probably be avoided if Subscription's listeners logic is changed to not call listeners
        // that have been unsubscribed in the  middle of the notification loop.

        const notifyNestedSubs = subscription.notifyNestedSubs.bind(subscription);
        return [subscription, notifyNestedSubs];
      }, [store, didStoreComeFromProps, contextValue]); // Determine what {store, subscription} value should be put into nested context, if necessary,
      // and memoize that value to avoid unnecessary context updates.

      const overriddenContextValue = useMemo(() => {
        if (didStoreComeFromProps) {
          // This component is directly subscribed to a store from props.
          // We don't want descendants reading from this store - pass down whatever
          // the existing context value is from the nearest connected ancestor.
          return contextValue;
        } // Otherwise, put this component's subscription instance into context, so that
        // connected descendants won't update until after this component is done


        return _extends({}, contextValue, {
          subscription
        });
      }, [didStoreComeFromProps, contextValue, subscription]); // Set up refs to coordinate values between the subscription effect and the render logic

      const lastChildProps = useRef();
      const lastWrapperProps = useRef(wrapperProps);
      const childPropsFromStoreUpdate = useRef();
      const renderIsScheduled = useRef(false);
      const isProcessingDispatch = useRef(false);
      const isMounted = useRef(false);
      const latestSubscriptionCallbackError = useRef();
      useIsomorphicLayoutEffect(() => {
        isMounted.current = true;
        return () => {
          isMounted.current = false;
        };
      }, []);
      const actualChildPropsSelector = useMemo(() => {
        const selector = () => {
          // Tricky logic here:
          // - This render may have been triggered by a Redux store update that produced new child props
          // - However, we may have gotten new wrapper props after that
          // If we have new child props, and the same wrapper props, we know we should use the new child props as-is.
          // But, if we have new wrapper props, those might change the child props, so we have to recalculate things.
          // So, we'll use the child props from store update only if the wrapper props are the same as last time.
          if (childPropsFromStoreUpdate.current && wrapperProps === lastWrapperProps.current) {
            return childPropsFromStoreUpdate.current;
          } // TODO We're reading the store directly in render() here. Bad idea?
          // This will likely cause Bad Things (TM) to happen in Concurrent Mode.
          // Note that we do this because on renders _not_ caused by store updates, we need the latest store state
          // to determine what the child props should be.


          return childPropsSelector(store.getState(), wrapperProps);
        };

        return selector;
      }, [store, wrapperProps]); // We need this to execute synchronously every time we re-render. However, React warns
      // about useLayoutEffect in SSR, so we try to detect environment and fall back to
      // just useEffect instead to avoid the warning, since neither will run anyway.

      const subscribeForReact = useMemo(() => {
        console.log('=react-redux=这里订阅了更新，并且返回一个注销订阅的函数')
        const subscribe = reactListener => {
          if (!subscription) {
            return () => { };
          }

          return subscribeUpdates(shouldHandleStateChanges, store, subscription, // @ts-ignore
            childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, isMounted, childPropsFromStoreUpdate, notifyNestedSubs, reactListener);
        };

        return subscribe;
      }, [subscription]);
      useIsomorphicLayoutEffectWithArgs(captureWrapperProps, [lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, childPropsFromStoreUpdate, notifyNestedSubs]);
      let actualChildProps;

      try {
        // console.log("actualChildProps = useSyncExternalStore_connect1:", useSyncExternalStore)
        actualChildProps = useSyncExternalStore( // TODO We're passing through a big wrapper that does a bunch of extra side effects besides subscribing
          // actualChildProps = useSyncExternalStore_connect( // TODO We're passing through a big wrapper that does a bunch of extra side effects besides subscribing
          subscribeForReact, // TODO This is incredibly hacky. We've already processed the store update and calculated new child props,
          // TODO and we're just passing that through so it triggers a re-render for us rather than relying on `uSES`.
          actualChildPropsSelector, getServerState ? () => childPropsSelector(getServerState(), wrapperProps) : actualChildPropsSelector);
      } catch (err) {
        if (latestSubscriptionCallbackError.current) {
          ;
          err.message += `\nThe error may be correlated with this previous error:\n${latestSubscriptionCallbackError.current.stack}\n\n`;
        }

        throw err;
      }

      useIsomorphicLayoutEffect(() => {
        latestSubscriptionCallbackError.current = undefined;
        childPropsFromStoreUpdate.current = undefined;
        lastChildProps.current = actualChildProps;
      }); // Now that all that's done, we can finally try to actually render the child component.
      // We memoize the elements for the rendered child component as an optimization.

      const renderedWrappedComponent = useMemo(() => {
        return (
          /*#__PURE__*/
          // @ts-ignore
          React.createElement(WrappedComponent, _extends({}, actualChildProps, {
            ref: reactReduxForwardedRef
          }))
        );
      }, [reactReduxForwardedRef, WrappedComponent, actualChildProps]); // If React sees the exact same element reference as last time, it bails out of re-rendering
      // that child, same as if it was wrapped in React.memo() or returned false from shouldComponentUpdate.

      const renderedChild = useMemo(() => {
        if (shouldHandleStateChanges) {
          // If this component is subscribed to store updates, we need to pass its own
          // subscription instance down to our descendants. That means rendering the same
          // Context instance, and putting a different value into the context.
          return /*#__PURE__*/React.createElement(ContextToUse.Provider, {
            value: overriddenContextValue
          }, renderedWrappedComponent);
        }

        return renderedWrappedComponent;
      }, [ContextToUse, renderedWrappedComponent, overriddenContextValue]);
      return renderedChild;
    }

    const _Connect = React.memo(ConnectFunction);

    // Add a hacky cast to get the right output type
    const Connect = _Connect;
    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = ConnectFunction.displayName = displayName;

    if (forwardRef) {
      const _forwarded = React.forwardRef(function forwardConnectRef(props, ref) {

        console.log('%c=react-redux=ConnectFunction注入ConnectFunction1=createElement(Connect)', 'color:chartreuse')
        // @ts-ignore
        return /*#__PURE__*/React.createElement(Connect, _extends({}, props, {
          reactReduxForwardedRef: ref
        }));
      });

      const forwarded = _forwarded;
      forwarded.displayName = displayName;
      forwarded.WrappedComponent = WrappedComponent;
      // return hoistStatics(forwarded, WrappedComponent);
      return hoistNonReactStatics(forwarded, WrappedComponent);
    }

    // return hoistStatics(Connect, WrappedComponent);
    console.log('%c=react-redux=ConnectFunction注入ConnectFunction2=hoistNonReactStatics(Connect', 'color:chartreuse')
    return hoistNonReactStatics(Connect, WrappedComponent);
  };
  console.log('%c=react-redux=Connect函数返回', 'color:chartreuse', { wrapWithConnect })
  return wrapWithConnect;
}
```


### ConnectFunction订阅的重点
```js
function ConnectFunction(props) {
  // 省略代码
  const [subscription, notifyNestedSubs] = useMemo(() => {
    console.log('=react-redux=ConnectFunction=阅的重点')
    if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY; // This Subscription's source should match where store came from: props vs. context. A component
    // connected to the store via props shouldn't use subscription from context, or vice versa.

    const subscription = createSubscription(store, didStoreComeFromProps ? undefined : contextValue.subscription); // `notifyNestedSubs` is duplicated to handle the case where the component is unmounted in
    // the middle of the notification loop, where `subscription` will then be null. This can
    // probably be avoided if Subscription's listeners logic is changed to not call listeners
    // that have been unsubscribed in the  middle of the notification loop.

    const notifyNestedSubs = subscription.notifyNestedSubs.bind(subscription);
    return [subscription, notifyNestedSubs];
  }, [store, didStoreComeFromProps, contextValue]); // Determine what {store, subscription} value should be put into nested context, if necessary,
}
```

通过 createSubscription 函数创建了一个订阅实例，createSubscription 的细节上面讲过了，它里面有一个嵌套订阅的逻辑，这里就会用到。createSubscription 的第 3 个参数传入了 context 里的 subscription 订阅实例，根据嵌套订阅逻辑（忘了的可以回头看看函数创建了一个订阅实例，createSubscription 的第 3 个参数起到了什么作用），这个 connect 里的订阅回调实际上是注册给父级的这个contextValue.subscription的，如果这个父级是顶层的 Provider，那么它的订阅回调才真正注册给redux，如果父级还不是顶层的话，那么还是会像这样一层层的嵌套注册回调。通过这个实现了『父级先更新-子级后更新』从而避免过期 props 和僵尸节点问题。

为了让子级 connect 的订阅回调注册给自己，于是用自己的 subscription 生成了一个新的 ReactReduxContextValue: overriddenContextValue，以便后续的嵌套注册。

然后定义了一批『持久化数据』（不会随着组件重复执行而初始化），这些数据主要为了将来的『更新判断』和『由父组件带动的更新、来自 store 的更新不重复发生』，后面会用到它们。
```js
function ConnectFunction(props) {
  // 省略代码
  const lastChildProps = useRef();
  const lastWrapperProps = useRef(wrapperProps);
  const childPropsFromStoreUpdate = useRef();
  const renderIsScheduled = useRef(false);
  const isProcessingDispatch = useRef(false);
  const isMounted = useRef(false);
  const latestSubscriptionCallbackError = useRef();
}
```

前面只看到了 subscription 的创建，并没有具体更新相关的，接下来的代码会走到。
subscribeForReact后面再看，里面主要是判断是否要更新的，它是发起更新的主要入口。

useIsomorphicLayoutEffectWithArgs 是一个工具函数，内部是useIsomorphicLayoutEffect，这个函数前面也讲过。它们最终做的是：将第 2 个数组参数的每项作为参数给第一个参数调用，第 3 个参数是useIsomorphicLayoutEffect的缓存依赖。

被执行的第一个参数captureWrapperProps，它主要功能是判断如果是来自 store 的更新，则在更新完成后（比如 useEffect）触发subscription.notifyNestedSubs，通知子订阅更新。

接着它想生成actualChildProps，也就是 select 出来的业务组件需要的 props，其中主要使用了useSyncExternalStore，如果你追到useSyncExternalStore的代码里看，会发现它是一个空方法，直接调用会抛出错误，所以它是由外部注入的。在入口index.ts里，initializeConnect(useSyncExternalStore)对它进行初始化了，useSyncExternalStore来自 React 。所以actualChildProps实际是React.useSyncExternalStore( subscribeForReact, actualChildPropsSelector, getServerState ? () => childPropsSelector(getServerState(), wrapperProps) : actualChildPropsSelector)的结果。

useSyncExternalStore是 react18 的新 API，前身是useMutableSource，为了防止在 concurrent 模式下，任务中断后第三方 store 被修改，恢复任务时出现tearing从而数据不一致。外部 store 的更新可以通过它引起组件的更新。在react-redux8之前，是由useReducer手动实现的，这是react-redux8首次使用新 API。这也意味着你必须跟着使用 React18+。但我认为其实 react-redux8 可以用 shim: import { useSyncExternalStore } from 'use-syncexternal-store/shim';来做到向下兼容。

useSyncExternalStore第一个参数是一个订阅函数，订阅触发时会引起该组件的更新，第二个函数返回一个 immutable 快照，用于标记该不该更新，以及得到返回的结果。
```js
function ConnectFunction(props) {
  // 省略代码
  const subscribeForReact = useMemo(() => {
  const subscribe = reactListener => {
    if (!subscription) {
      return () => { };
    }

    return subscribeUpdates(shouldHandleStateChanges, store, subscription, // @ts-ignore
      childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, isMounted, childPropsFromStoreUpdate, notifyNestedSubs, reactListener);
  };

  return subscribe;
}, [subscription]);

useIsomorphicLayoutEffectWithArgs(captureWrapperProps, [lastWrapperProps, lastChildProps, renderIsScheduled, wrapperProps, childPropsFromStoreUpdate, notifyNestedSubs]);

}
```

### 下面看看订阅函数 subscribeForReact 做了什么
首先用 useMemo 缓存了函数，用 useCallback 也可以，而且个人觉得useCallback更符合语义。这个函数实际调用的是subscribeUpdates，那我们再看看subscribeUpdates。
```js
const subscribeForReact = useMemo(() => {
  console.log('=react-redux=这里订阅了更新，并且返回一个注销订阅的函数')
  const subscribe = reactListener => {
    if (!subscription) {
      return () => { };
    }

    return subscribeUpdates(shouldHandleStateChanges, store, subscription, // @ts-ignore
      childPropsSelector, lastWrapperProps, lastChildProps, renderIsScheduled, isMounted, childPropsFromStoreUpdate, notifyNestedSubs, reactListener);
  };

  return subscribe;
}, [subscription]);
```

其中的重点是checkForUpdates，它里面获取了最新的 Store 状态: latestStoreState（注意这里依然是手动获取的，将来 react-redux 会把它交给uSES做）、最新的要交给业务组件的 props: newChildProps，如果 childProps 和上一次一样，那么不会更新，只会通知子 connect 尝试更新。如果 childProps 变了，则会调用 React.useSyncExternalStore 传入的更新方法，这里叫additionalSubscribeListener，它会引起组件更新。react-redux8 以前这里用的是 useReducer 的 dispatch。checkForUpdates会被交给subscription.onStateChange，前面我们分析过，subscription.onStateChange最终会在 redux store 更新的时候被嵌套调用。

subscribeUpdates函数里面还调用了subscription.trySubscribe()将onStateChange收集到父级订阅中。接着调用了 checkForUpdates 以防首次渲染时数据就变了。最后返回了一个注销订阅的函数。

由上述分析可知，组件实际的更新是checkForUpdates完成的。它会由两个途径调用：
1. redux store 更新后，被父级级联调用
2. 组件自身 render（父级 render 带动、组件自身 state 带动），同时 useSyncExternalStore 的快照发生了变化，导致调用

我们会发现在一次总更新中，单个 connect 的 checkForUpdates 是会被多次调用的。比如一次来自 redux 的更新导致父级 render 了，它的子元素有 connect 组件，一般我们不会对 connect 组件做 memo，于是它也会被 render，正好它的 selectorProps 也变化了，所以在 render 期间checkForUpdates调用。当父级更新完成后，触发自身 listeners，导致子 connect 的checkForUpdates再次被调用。这样不会让组件 re-render 多次吗？当初我首次看代码的时候，就有这样的疑问。经过大脑模拟各种场景的代码调度，发现它是这样避免重复 render 的，归纳起来可以分为这几种场景：

1. 来自 redux store 更新，且自身的 stateFromStore 有更新
2. 来自 redux store 更新，且自身的 stateFromStore 没有更新
3. 来自父组件 render 的更新，且自身的 stateFromStore 有更新
4. 来自父组件 render 的更新，且自身的 stateFromStore 没有更新
5. 来自 自身 state 的更新，且自身的 stateFromStore 有更新
5. 来自 自身 state 的更新，且自身的 stateFromStore 没有更新

其中 6 的 stateFromStore 和 props 都没有变化，actualChildProps直接使用缓存结果，并不会调用checkForUpdates，不会担心多次 render 的问题

1 和 2 的更新来自 redux store，所以必然是父组件先更新（除非该 connect 是除 Provider 的顶层）该 connect 后更新，connect render 时，来自父组件的 props 可能变了，自身的 stateFromStore 可能也变了，于是checkForUpdates被调用，useRef childPropsFromStoreUpdate被设置新的 childProps，中断当前 render，重新 render,组件在 render 中获得新 childProps 值。接着由父 connect 组件的 useEffect 带来第二波checkForUpdates，这时 childProps 已经和上一次没有不同了，所以并不会更新，只是触发更底层子 connect 的checkForUpdates，更底层 connect 逻辑同理。

3 和 4 类型的更新其实是 1 和 2 中的一部分，就不细讲了。

5 类型的更新可能发生在同时调用了 setState 和 redux dispatch，根据 react-redux 的嵌套策略，redux dispatch 的更新肯定发生在 setState 之后的，在 render 过程中childPropsSelector(store.getState(), wrapperProps)获取到最新的childProps，它显然是变了。于是checkForUpdates，后续的 redux dispatch 更新childProps已经和上次相同了，所以只走notifyNestedSubs。

至此所有场景所有链路的更新都有了闭环。

## useSelector
用法：
```js
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

源码:
```js
function createSelectorHook(context = ReactReduxContext) {
  const useReduxContext = context === ReactReduxContext ? useDefaultReduxContext : () => useContext(context);
  return function useSelector(selector, equalityFn = refEquality) {
    if (process.env.NODE_ENV !== 'production') {
      if (!selector) {
        throw new Error(`You must pass a selector to useSelector`);
      }

      if (typeof selector !== 'function') {
        throw new Error(`You must pass a function as a selector to useSelector`);
      }

      if (typeof equalityFn !== 'function') {
        throw new Error(`You must pass a function as an equality function to useSelector`);
      }
    }

    const {
      store,
      subscription,
      getServerState
    } = useReduxContext();
    const selectedState = useSyncExternalStoreWithSelector(subscription.addNestedSub, store.getState, getServerState || store.getState, selector, equalityFn);
    useDebugValue(selectedState);
    return selectedState;
  };
}

const useSelector = /*#__PURE__*/createSelectorHook();
```

useSelector是由createSelectorHook()创建的

和connect一样，通过ReactReduxContext拿到 Provider 的 store 等数据。

useSyncExternalStoreWithSelector同样是空方法，被/src/index.ts设置为import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector'的useSyncExternalStoreWithSelector，和useSyncExternalStore作用类似。它直接订阅给了redux.store.subscribe。redux store 更新时，会触发使用它的组件更新，从而拿到新的selectedState。

hooks 只是状态逻辑，它不能像connect组件那样做到给子组件提供 Context，于是它只能平级的直接订阅在 redux 里，这就是文章开头部分讲到的『僵尸节点』问题时提到的：hooks 没有嵌套订阅的原因。useSelector的代码比 7 版本的简洁多了，可以发现去除了非生产环境代码后并没有多少，相比之下 7 版本的要冗长不少（165 行），有兴趣的可以去看看。

### 衍生出来的 React 原理
useSelector和 7 版本还有一个重要区别！了解它可以帮助你知道更多 React 内部的细节！

在 7 版本里，注册订阅是在 useEffect/useLayoutEffect里执行的。而根据 React 的 fiber 架构逻辑，它会以前序遍历的顺序遍历 fiber 树，首先使用 beginWork 处理 fiber，当到了叶子节点时调用 completeWork，其中 completeWork 会将诸如 useEffect、useLayoutEffect等放入 effectList，将来在 commit 阶段顺序执行。而按照前序遍历的顺序，completeWork是自下而上的，也就是说子节点的useEffect会比父节点先执行，于是在 7 版本里，子组件 hooks 比父组件更早注册，将来执行时也更早执行，这就典型地陷入了开头说的『stale props』、『zombie children』问题。

因为我知道 React 的内部机制，所以刚开始我认为 react-redux7 的 hooks 是会出 bug 的，于是我通过npm link用几个测试用例本地跑了代码，结果出乎我意料，listener确实被调用了多次，这意味着有多个 connect 组件将会更新，就当我以为子组件将先于父组件被更新时，但最终 render 只有一次，是由最上层的父 connect render 的，它将带动下面的子 connect 更新。

这就引出了 React 的批量更新策略。比如 React16 里面，所有的 React 事件、生命周期都被装饰了一个逻辑，开头会设置一个锁，于是里面的所有 setState 这样的更新操作都不会真的发起更新，等代码的最后放开锁，再批量的一起更新。于是 react-redux 正好借用这个策略，让需要更新的组件整体自上而下的批量更新了，这源于它的一处不起眼的地方：setBatch(batch)，而我也是因为没注意这里的用处，而误判它会出问题，setBatch(batch)实际做了什么后面会讲到。

关于批量更新，再举个例子，比如 A 有子组件 B，B 有子组件 C，分别顺序调用 C、B、A 的 setState，正常来说 C、B、A 会被按顺序各自更新一次，而批量更新会将三次更新合并成一个，直接从组件 A 更新一次，B 和 C 就顺带被更新了。

不过这个批量更新策略的『锁』是在同一个『宏任务』里的，如果代码中有异步任务，那么异步任务中的 setState 是会『逃脱』批量更新的，也就是说这种情况下每次 setState 就会让组件更新一次。比如 react-redux 不能保证用户不会在一个请求回调里调用dispatch（实际上这么做太普遍了），所以 react-redux 在/src/index.ts中做了setBatch(batch)操作，batch来自import { unstable_batchedUpdates as batch } from './utils/reactBatchedUpdates'，unstable_batchedUpdates 是由 react-dom 提供的手动批量更新方法，可以帮助脱离管控的 setState 重新批量更新。在Subscription.ts中的createListenerCollection里用到了batch：
```js
const batch = getBatch();
// ............
return {
  notify() {
    batch(() => {
      let listener = first;
      while (listener) {
        listener.callback();
        listener = listener.next;
      }
    });
  },
};
```

所以subscription里的listeners的notify方法，是会对所有的更新订阅手动批量更新的。从而在 react-redux7 中，就算 hooks 注册的订阅是自下而上的，也不会引起问题。

而 react-redux8 直接使用新 API useSyncExternalStoreWithSelector订阅，是在 render 期间发生的，所以订阅的顺序是自上而下的，避免了子订阅先执行的问题。但是 8 版本依然有上述batch的逻辑，代码和 7 一模一样，因为批量更新能节省不少性能。

## 最后的部分是useDispatch
useDispatch非常简单，就是通过useStore()拿到 redux store，然后返回store.dispatch，用户就能使用这个dispatch派发action了。

```js
function createDispatchHook(context = ReactReduxContext) {
  const useStore = // @ts-ignore
  context === ReactReduxContext ? useDefaultStore : createStoreHook(context);
  return function useDispatch() {
    const store = useStore(); // @ts-ignore

    return store.dispatch;
  };
}
```