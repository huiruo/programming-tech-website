## workInProgress 构建
```js
  function createWorkInProgress(current, pendingProps) {
    var workInProgress = current.alternate;
    // 区分是在mount时还是在update时
    if (workInProgress === null) {
      // We use a double buffering pooling technique because we know that we'll
      // only ever need at most two versions of a tree. We pool the "other" unused
      // node that we're free to reuse. This is lazily created to avoid allocating
      // extra objects for things that are never updated. It also allow us to
      // reclaim the extra memory if needed.
      console.log('==createWorkInProgress-->,没有就创建一个')
      workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode);
      console.log('==createWorkInProgress-->,没有就创建一个返回值', workInProgress)
      debugger
      workInProgress.elementType = current.elementType;
      workInProgress.type = current.type;
      workInProgress.stateNode = current.stateNode;

      {
        // DEV-only fields
        workInProgress._debugSource = current._debugSource;
        workInProgress._debugOwner = current._debugOwner;
        workInProgress._debugHookTypes = current._debugHookTypes;
      }
      console.log('==createWorkInProgress-->,workInProgress.alternate指定为current')
      workInProgress.alternate = current;
      current.alternate = workInProgress;
    } else {
      // 复用属性
      workInProgress.pendingProps = pendingProps; // Needed because Blocks store data on type.

      workInProgress.type = current.type; // We already have an alternate.
      // Reset the effect tag.

      workInProgress.flags = NoFlags; // The effects are no longer valid.

      workInProgress.subtreeFlags = NoFlags;
      workInProgress.deletions = null;

      {
        // We intentionally reset, rather than copy, actualDuration & actualStartTime.
        // This prevents time from endlessly accumulating in new commits.
        // This has the downside of resetting values for different priority renders,
        // But works for yielding (the common case) and should support resuming.
        workInProgress.actualDuration = 0;
        workInProgress.actualStartTime = -1;
      }
    } // Reset all effects except static ones.
    // Static effects are not specific to a render.


    workInProgress.flags = current.flags & StaticMask;
    // 复用属性
    workInProgress.childLanes = current.childLanes;
    workInProgress.lanes = current.lanes;
    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue; // Clone the dependencies object. This is mutated during the render phase, so
    // it cannot be shared with the current fiber.

    var currentDependencies = current.dependencies;
    workInProgress.dependencies = currentDependencies === null ? null : {
      lanes: currentDependencies.lanes,
      firstContext: currentDependencies.firstContext
    }; // These will be overridden during the parent's reconciliation

    workInProgress.sibling = current.sibling;
    workInProgress.index = current.index;
    workInProgress.ref = current.ref;

    {
      workInProgress.selfBaseDuration = current.selfBaseDuration;
      workInProgress.treeBaseDuration = current.treeBaseDuration;
    }

    {
      workInProgress._debugNeedsRemount = current._debugNeedsRemount;

      switch (workInProgress.tag) {
        case IndeterminateComponent:
        case FunctionComponent:
        case SimpleMemoComponent:
          workInProgress.type = resolveFunctionForHotReloading(current.type);
          break;

        case ClassComponent:
          workInProgress.type = resolveClassForHotReloading(current.type);
          break;

        case ForwardRef:
          workInProgress.type = resolveForwardRefForHotReloading(current.type);
          break;
      }
    }

    return workInProgress;
  }
```

赋值：调用 prepareFreshStack
```js
  function renderRootSync(root, lanes) {

    var prevExecutionContext = executionContext;
    executionContext |= RenderContext;
    var prevDispatcher = pushDispatcher(); // If the root or lanes have changed, throw out the existing stack
    // and prepare a fresh one. Otherwise we'll continue where we left off.

    if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
      {
        if (isDevToolsPresent) {
          var memoizedUpdaters = root.memoizedUpdaters;

          if (memoizedUpdaters.size > 0) {
            restorePendingUpdaters(root, workInProgressRootRenderLanes);
            memoizedUpdaters.clear();
          } // At this point, move Fibers that scheduled the upcoming work from the Map to the Set.
          // If we bailout on this work, we'll move them back (like above).
          // It's important to move them now in case the work spawns more work at the same priority with different updaters.
          // That way we can keep the current update and future updates separate.


          movePendingFibersToMemoized(root, lanes);
        }

      }

      workInProgressTransitions = getTransitionsForLanes();

      console.log('workInProgress', workInProgress, root)
      debugger
      console.log('render调用 prepareFreshStack前',workInProgress)
      prepareFreshStack(root, lanes);
      console.log('workInProgress', workInProgress, root)
      console.log('render调用 prepareFreshStack后',workInProgress)
    }
```

### workInProgress 构建2：beginWork 第一次会调用updateHostRoot进行初始化:updateHostRoot

第二次才走 mountIndeterminateComponent 执行code()函数,此时的workInProgress.type 才有值
```js
  function beginWork(current, workInProgress, renderLanes) {
    console.log('workInProgress', workInProgress, root)
    debugger
    workInProgress.lanes = NoLanes;
    console.log('%c=beginWork()===start1-初始化', 'color:magenta', { getFiberName: getFiberName(workInProgress), current, renderLanes, workInProgress })
    switch (workInProgress.tag) {
      case IndeterminateComponent:
        {
          console.log('%c=beginWork()==end 2 mountIndeterminateComponent', 'color:magenta', workInProgress)
          console.log(`%c=探究初始和hook=调用mountIndeterminateComponent`, 'color:blueviolet', workInProgress.type)
          return mountIndeterminateComponent(current, workInProgress, workInProgress.type, renderLanes);
      }
      case HostRoot:
        console.log('%c=beginWork()=end 6第一次会走这里初始化workInProgress', 'color:magenta')
        console.log('%c=beginWork()=end 6 updateHostRoot', 'color:magenta')
        return updateHostRoot(current, workInProgress, renderLanes);
    }
  }
```

### 重点构建子节点：
reconcileChildren(current, workInProgress, nextChildren, renderLanes)-->reconcileChildren

```js
function updateHostRoot(current, workInProgress, renderLanes) {
  pushHostRootContext(workInProgress);

  if (current === null) {
    throw new Error('Should have a current fiber. This is a bug in React.');
  }

  var nextProps = workInProgress.pendingProps;
  var prevState = workInProgress.memoizedState;
  var prevChildren = prevState.element;
  cloneUpdateQueue(current, workInProgress);
  processUpdateQueue(workInProgress, nextProps, null, renderLanes);
  var nextState = workInProgress.memoizedState;
  var root = workInProgress.stateNode;
  // being called "element".


  var nextChildren = nextState.element;

  if (prevState.isDehydrated) {
  } else {
      // Root is not dehydrated. Either this is a client-only root, or it
      // already hydrated.
      resetHydrationState();

      if (nextChildren === prevChildren) {
        return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
      }

      console.log('=reconcileChildren 9')
      debugger
      reconcileChildren(current, workInProgress, nextChildren, renderLanes);
      console.log('%c=updateHostRoot:构建之后workInProgress.child', 'color:black', { child })
  }
  console.log('%c=updateHostRoot:最后返回workInProgress.child', 'color:black', workInProgress.child)

  return workInProgress.child;
}
```

```js
function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    console.log('%c=reconcileChildren mount', 'blueviolet');
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
    console.log('%c=reconcileChildren mount 返回值workInProgress.child', 'blueviolet', workInProgress.child);
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.
    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    console.log('%c=reconcileChildren update', 'yellow');
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
  }
}
```

很长的函数: reconcileChildren->reconcileChildFibers
```js
  function ChildReconciler(shouldTrackSideEffects) {
    // 省略
    function reconcileChildFibers(returnFiber, currentFirstChild, newChild, lanes) {
      // This function is not recursive.
      // If the top level item is an array, we treat it as a set of children,
      // not as a fragment. Nested arrays on the other hand will be treated as
      // fragment nodes. Recursion happens at the normal flow.
      // Handle top level unkeyed fragments as if they were arrays.
      // This leads to an ambiguity between <>{[...]}</> and <>...</>.
      // We treat the ambiguous cases above the same.
      var isUnkeyedTopLevelFragment = typeof newChild === 'object' && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null;

      console.log('%c=reconcileChildFibers A', 'blueviolet');

      if (isUnkeyedTopLevelFragment) {
        newChild = newChild.props.children;
      } // Handle object types


      if (typeof newChild === 'object' && newChild !== null) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes));

          case REACT_PORTAL_TYPE:
            return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, lanes));

          case REACT_LAZY_TYPE:
            var payload = newChild._payload;
            var init = newChild._init; // TODO: This function is supposed to be non-recursive.

            return reconcileChildFibers(returnFiber, currentFirstChild, init(payload), lanes);
        }

        if (isArray(newChild)) {
          return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
        }

        if (getIteratorFn(newChild)) {
          return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
        }

        throwOnInvalidObjectType(returnFiber, newChild);
      }

      if (typeof newChild === 'string' && newChild !== '' || typeof newChild === 'number') {
        return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, lanes));
      }

      {
        if (typeof newChild === 'function') {
          warnOnFunctionType(returnFiber);
        }
      } // Remaining cases are all treated as empty.


      return deleteRemainingChildren(returnFiber, currentFirstChild);
    }

    return reconcileChildFibers;
  }
```

## beginWork第二次之case IndeterminateComponent
第二次beginWork进入case IndeterminateComponent 执行 mountIndeterminateComponent(),可见深度遍历从父级组件开始

首先要注意的是，虽然 App 是一个 FunctionComponent，但是在 first paint 的时候，React 判断其为 IndeterminateComponent

对于 FunctionComponent，在第一次识别的时候会被认为是 IndeterminateComponent

一个函数，只要返回的是一个对象且对象中有 render 方法，就认为是 ClassComponent，否则就是 FunctionComponent

```js
    switch (workInProgress.tag) {
      case IndeterminateComponent:
        {
          console.log('%c=beginWork()==end 2 mountIndeterminateComponent', 'color:magenta')
          console.log(`%c=探究初始和hook=调用mountIndeterminateComponent`, 'color:blueviolet')
          return mountIndeterminateComponent(current, workInProgress, workInProgress.type, renderLanes);
        }
```

```js
function beginWork(current, workInProgress, renderLanes) {
    workInProgress.lanes = NoLanes;
    console.log('%c=beginWork()===start1-初始化', 'color:magenta', { getFiberName: getFiberName(workInProgress), current, renderLanes, workInProgress })
    switch (workInProgress.tag) {
      case IndeterminateComponent:
        {
          console.log('%c=beginWork()==end 2 mountIndeterminateComponent', 'color:magenta')
          console.log(`%c=探究初始和hook=调用mountIndeterminateComponent`, 'color:blueviolet')
          return mountIndeterminateComponent(current, workInProgress, workInProgress.type, renderLanes);
        }

      case LazyComponent:
        {
          var elementType = workInProgress.elementType;
          console.log('%c=beginWork()=end 3 mountLazyComponent', 'color:magenta')
          return mountLazyComponent(current, workInProgress, elementType, renderLanes);
        }

      case FunctionComponent:
        {
          var Component = workInProgress.type;
          var unresolvedProps = workInProgress.pendingProps;
          var resolvedProps = workInProgress.elementType === Component ? unresolvedProps : resolveDefaultProps(Component, unresolvedProps);
          console.log('%c=beginWork()=end 4只有更新才会调用updateFunctionComponent', 'color:magenta')
          return updateFunctionComponent(current, workInProgress, Component, resolvedProps, renderLanes);
        }

      case ClassComponent:
        {
          var _Component = workInProgress.type;
          var _unresolvedProps = workInProgress.pendingProps;

          var _resolvedProps = workInProgress.elementType === _Component ? _unresolvedProps : resolveDefaultProps(_Component, _unresolvedProps);
          console.log('%c=beginWork()=end 5 updateClassComponent', 'color:magenta')
          return updateClassComponent(current, workInProgress, _Component, _resolvedProps, renderLanes);
        }

      case HostRoot:
        console.log('%c=beginWork()=end 6 updateHostRoot', 'color:magenta')
        return updateHostRoot(current, workInProgress, renderLanes);

      case HostComponent:
        console.log(`%c=beginWork()=end 7 updateHostComponent$1,即原生 DOM 组件对应的 Fiber节点:`, 'color:magenta', { type: workInProgress.type })
        return updateHostComponent$1(current, workInProgress, renderLanes);

      case HostText:
        console.log('%c=beginWork()=end 8 updateHostText$1', 'color:magenta')
        return updateHostText$1(current, workInProgress);

      case SuspenseComponent:
        console.log('%c=beginWork()=end 9 updateSuspenseComponent', 'color:magenta')
        return updateSuspenseComponent(current, workInProgress, renderLanes);

      case HostPortal:
        console.log('%c=beginWork()=end 10 updatePortalComponent', 'color:magenta')
        return updatePortalComponent(current, workInProgress, renderLanes);

      case ForwardRef:
        {
          var type = workInProgress.type;
          var _unresolvedProps2 = workInProgress.pendingProps;

          var _resolvedProps2 = workInProgress.elementType === type ? _unresolvedProps2 : resolveDefaultProps(type, _unresolvedProps2);

          console.log('%c=beginWork()=end 11 updateForwardRef', 'color:magenta')
          return updateForwardRef(current, workInProgress, type, _resolvedProps2, renderLanes);
        }

      case Fragment:
        console.log('%c=beginWork()=end 12 updateFragment', 'color:magenta')
        return updateFragment(current, workInProgress, renderLanes);

      case Mode:
        console.log('%c=beginWork()=end 13 updateMode', 'color:magenta')
        return updateMode(current, workInProgress, renderLanes);

      case Profiler:
        console.log('%c=beginWork()=end 14 updateProfiler', 'color:magenta')
        return updateProfiler(current, workInProgress, renderLanes);

      case ContextProvider:
        console.log('%c=beginWork()=end 15 updateContextProvider', 'color:magenta')
        return updateContextProvider(current, workInProgress, renderLanes);

      case ContextConsumer:
        console.log('%c=beginWork()=end 16 updateContextConsumer', 'color:magenta')
        return updateContextConsumer(current, workInProgress, renderLanes);

      case MemoComponent:
        {
          var _type2 = workInProgress.type;
          var _unresolvedProps3 = workInProgress.pendingProps; // Resolve outer props first, then resolve inner props.

          var _resolvedProps3 = resolveDefaultProps(_type2, _unresolvedProps3);

          {
            if (workInProgress.type !== workInProgress.elementType) {
              var outerPropTypes = _type2.propTypes;

              if (outerPropTypes) {
                checkPropTypes(outerPropTypes, _resolvedProps3, // Resolved for outer only
                  'prop', getComponentNameFromType(_type2));
              }
            }
          }

          _resolvedProps3 = resolveDefaultProps(_type2.type, _resolvedProps3);
          console.log('%c=beginWork()=end 17 updateMemoComponent', 'color:magenta')
          return updateMemoComponent(current, workInProgress, _type2, _resolvedProps3, renderLanes);
        }

      case SimpleMemoComponent:
        {
          console.log('%c=beginWork()=end 18 updateSimpleMemoComponent', 'color:magenta')
          return updateSimpleMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
        }

      case IncompleteClassComponent:
        {
          var _Component2 = workInProgress.type;
          var _unresolvedProps4 = workInProgress.pendingProps;

          var _resolvedProps4 = workInProgress.elementType === _Component2 ? _unresolvedProps4 : resolveDefaultProps(_Component2, _unresolvedProps4);
          console.log('%c=beginWork()=end 19 mountIncompleteClassComponent', 'color:magenta')
          return mountIncompleteClassComponent(current, workInProgress, _Component2, _resolvedProps4, renderLanes);
        }

      case SuspenseListComponent:
        {
          console.log('%c=beginWork()=end 20 updateSuspenseListComponent', 'color:magenta')
          return updateSuspenseListComponent(current, workInProgress, renderLanes);
        }

      case ScopeComponent:
        {

          break;
        }

      case OffscreenComponent:
        {
          console.log('%c=beginWork()=end 21 updateOffscreenComponent', 'color:magenta')
          return updateOffscreenComponent(current, workInProgress, renderLanes);
        }
    }
    throw new Error("Unknown unit of work tag (" + workInProgress.tag + "). This error is likely caused by a bug in " + 'React. Please file an issue.');
  }
}
```

### 重点：code函数初始化在renderWithHooks这里执行

mountIndeterminateComponent 
* 调用  renderWithHooks 生成 value
* 执行 reconcileChildren(null, workInProgress, value, renderLanes) 参数value


关键的函数 renderWithHooks；而在 renderWithHooks 中，我们会根据组件处于不同的状态，给 ReactCurrentDispatcher.current 挂载不同的 dispatcher 。而在first paint 时，挂载的是HooksDispatcherOnMountInDEV

HooksDispatcherOnMountInDEV 里就是组件 first paint 的时候所用到的各种 hooks
```js
function mountIndeterminateComponent(_current, workInProgress, Component, renderLanes) {
    // 省略
    setIsRendering(true);
    ReactCurrentOwner$1.current = workInProgress;
    console.log(`%c=探究初始和hook=mountIndeterminateComponent调用renderWithHooks 1`, 'color:blueviolet', { workInProgress, Component, props, context, renderLanes })
    value = renderWithHooks(null, workInProgress, Component, props, context, renderLanes);
    console.log(`%c=探究初始和hook=mountIndeterminateComponent调用renderWithHooks 返回值`, 'color:blueviolet', { value })
    // 省略

   if (getIsHydrating() && hasId) {
        pushMaterializedTreeId(workInProgress);
      }
      console.log('%c=reconcileChildren 12:重点，mountIndeterminateComponent调用reconcileChildren', 'color:red')
      reconcileChildren(null, workInProgress, value, renderLanes);

      {
        validateFunctionComponentInDev(workInProgress, Component);
      }

      return workInProgress.child;
    }
  }
}
```
```js
function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
    // 省略：
    console.log(`%c=探究初始和hook=renderWithHooks重点，调用函数组件，里面执行各种 React Hook==start并返回 ReactElement`, 'color:blueviolet', Component)
    var children = Component(props, secondArg); // Check if there was a render phase update
    console.log(`%c=探究初始和hook=renderWithHooks重点,返回 ReactElement==end`, 'color:blueviolet', { children })
    // 省略：
    return children;
}
```

初始化-->mountChildFibers
```js
function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    console.log('%c=reconcileChildren mount', 'blueviolet');
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
    console.log('%c=reconcileChildren mount 返回值workInProgress.child', 'blueviolet',workInProgress.child);
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.
    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    console.log('%c=reconcileChildren update', 'yellow');
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
  }
}
```


### ChildReconciler
从该函数名就能看出这是Reconciler模块的核心部分。那么他究竟做了什么呢？
* 对于 mount 的组件，他会创建新的子 Fiber 节点；
* 对于 update 的组件，他会将当前组件与该组件在上次更新时对应的 Fiber 节点比较（也就是俗称的Diff 算法），将比较的结果生成新 Fiber 节点。

不论走哪个逻辑，最终他会生成新的子 Fiber 节点并赋值给workInProgress.child，作为本次 beginWork 返回值，并作为下次performUnitOfWork执行时workInProgress的传参。

mountChildFibers与reconcileChildFibers这两个方法的逻辑基本一致。唯一的区别是：reconcileChildFibers 会为生成的 Fiber 节点带上effectTag属性，而 mountChildFibers 不会。
```js
var mountChildFibers = ChildReconciler(false);

// 这个代码很长 1k
function ChildReconciler(shouldTrackSideEffects) {

}
```

root.render(React.createElement(Test, null));
调用的参数是：React.createElement(Test, null)处理之后的：
```js
var ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,
      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,
      // Record the component responsible for creating this element.
      _owner: owner
    };

    return element;
}
```

## 第三次 beginWork
此时构建 code() 生成的节点
```js
      case HostComponent:
        console.log(`%c=beginWork()=end 7 updateHostComponent$1,即原生 DOM 组件对应的 Fiber节点:`, 'color:magenta', { type: workInProgress.type })
        return updateHostComponent$1(current, workInProgress, renderLanes);
```

此时 workInProgress
```
actualDuration:0
actualStartTime:-1
alternate:null
child:null
childLanes:0
deletions: null
dependencies: null
elementType:"div"
flags: 0
index : 0
key : null
lanes : 0
memoizedProps:null
memoizedState:null
mode:1
pendingProps:{id: 'div1', className: 'c1', children: Array(4)}
ref:null
return:FiberNode {tag: 0, key: null, stateNode: null, elementType: ƒ, type: ƒ, …}
selfBaseDuration:0,
sibling:null
stateNode:null
subtreeFlags:0
tag:5
treeBaseDuration:0
type:"div"
updateQueue:null
```

```js
function updateHostComponent$1(current, workInProgress, renderLanes) {
  pushHostContext(workInProgress);

  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress);
  }

  var type = workInProgress.type;
  var nextProps = workInProgress.pendingProps;
  var prevProps = current !== null ? current.memoizedProps : null;
  var nextChildren = nextProps.children;
  var isDirectTextChild = shouldSetTextContent(type, nextProps);

  if (isDirectTextChild) {
    // We special case a direct text child of a host node. This is a common
    // case. We won't handle it as a reified child. We will instead handle
    // this in the host environment that also has access to this prop. That
    // avoids allocating another HostText fiber and traversing it.
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    // If we're switching from a direct text child to a normal child, or to
    // empty, we need to schedule the text content to be reset.
    workInProgress.flags |= ContentReset;
  }

  markRef$1(current, workInProgress);
  console.log('=reconcileChildren 11')
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}
```