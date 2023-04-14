---
title: commit阶段-useLayoutEffect-useEffect
sidebar_position: 4
---

# commit流程图

## useLayoutEffect流程图
```mermaid
flowchart TD
A0("commitRootImpl(root,recoverableErrors,transitions,renderPriorityLevel)")--阶段3开始-->A3

A3("commitLayoutEffects(finishedWork, root, lanes)")-->c1(commitLayoutEffects_begin)--循环nextEffect-->c2("commitLayoutMountEffects_complete(subtreeRoot, root, committedLanes)")--循环nextEffect-->c3(commitLayoutEffectOnFiber代码很长)

c3--case为SimpleMemoComponent-->c4(commitHookEffectListMount执行useLayoutEffect的回调函数)--执行useLayoutEffect-->c5("effect.destroy = create()")
```

## useEffect 流程图
```mermaid
flowchart TD
A1(useEffect)--初始化-->A2("mountEffect(create,deps)")-->A3("mountEffect(create,deps)")

B1("commitRootImpl(root,recoverableErrors,..)")-->B2("scheduleCallback$")--回调调用-->b1("flushPassiveEffects()")-->b2("return flushPassiveEffectsImpl()")

b2-->b3("flushPassiveEffectsImpl()")-->b4("commitPassiveMountEffects(root,root.current,lanes,transitions)")

b4-->b5("commitPassiveMountEffects_begin(finishedWork,root,committedLanes,committedTransitions)")-->b6("commitPassiveMountEffects_complete(subtreeRoot,root, committedLanes,committedTransitions)")

b6-->b7("commitPassiveMountOnFiber(root,fiber,committedLanes,committedTransitions)")

b7-->b8("commitHookEffectListMount执行useLayoutEffect的回调函数")--执行useLayoutEffect-->c5("effect.destroy = create()")
```


## useLayoutEffect比先执行useEffect
useLayoutEffect和useEffect的代码是一样的两个都是在commitRootImpl开始调用，区别主要是：
* 执行时机不同；
* useEffect是异步， useLayoutEffect是同步，会阻塞渲染

useLayoutEffect
* 会在commit阶段的layout阶段同步执行
* useLayoutEffect 会同步地执行它的响应函数和上一次的销毁函数，即会阻塞住 DOM渲染。
* useLayoutEffects中适合进行一些可能影响dom的操作，因为在其create中可以获取到最新的dom树且由于此时浏览器未进行绘制（本轮事件循环尚未结束），因此不会有中间状态的产生，可以有效的避免闪动问题。因此当业务中出现需要在effect中修改视图，且执行的上一帧中视图变更，就可以考虑是否将逻辑放入useLayoutEffect中处理。
```
当然，useLayoutEffect的使用也应当是谨慎的。由于js线程和渲染进程是互斥的，因此useLayoutEffects中不宜加入很耗时的计算，否则会导致浏览器没有时间重绘而阻塞渲染，上述使用useLayoutEffect的demo中加入了200ms延迟，可以明显的感受到每次点击更新的延迟。除此之外的绝大部分场景下二者的行为都是一致的，因此业务开发中的大部分场景应优先使用useEffect。
```

useEffect
* 会在commit阶段的layout阶段异步执行,主要原因是防止同步执行时阻塞浏览器渲染。
```
摘录自 React 文档 effect 的执行时机 ：
与 componentDidMount、componentDidUpdate 不同的是，在浏览器完成布局与绘制之后，传给 useEffect 的函数会延迟调用。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因此不应在函数中执行阻塞浏览器更新屏幕的操作。
```

详细看下面:useEffect之执行:开始执行和useLayoutEffect 同在commitRootImpl

## useLayoutEffect执行
具体要配合commit阶段参考：[commit阶段](./render阶段结束后-进入commit阶段)

### commitLayoutEffects调用commitLayoutEffects_begin
```js
function commitLayoutEffects(finishedWork, root, committedLanes) {
  inProgressLanes = committedLanes;
  inProgressRoot = root;
  nextEffect = finishedWork;
  console.log('-副作用,commit第3阶段,处理执行DOM操作后的操作,并调用commitLayoutEffects_begin参数', { finishedWork, root, committedLanes })
  commitLayoutEffects_begin(finishedWork, root, committedLanes);
  inProgressLanes = null;
  inProgressRoot = null;
}
```

### commitLayoutEffects_begin从上往下遍历effectList,最终执行commitLayoutMountEffects_complete
根据 nextEffect = fiber.return 这段代码可以看出 commitLayoutMountEffects_complete 会从下往上 遍历 effectList 。在该方法中会执行 commitLayoutEffectOnFiber 方法。
```js
function commitLayoutMountEffects_complete(subtreeRoot, root, committedLanes) {
  while (nextEffect !== null) {
    var fiber = nextEffect;

    if ((fiber.flags & LayoutMask) !== NoFlags) {
      var current = fiber.alternate;
      setCurrentFiber(fiber);

      try {
        console.log('commitLayoutMountEffects_complete循环nextEffect调用:commitLayoutEffectOnFiber')
        commitLayoutEffectOnFiber(root, current, fiber, committedLanes);
      } catch (error) {
        captureCommitPhaseError(fiber, fiber.return, error);
      }

      resetCurrentFiber();
    }

    if (fiber === subtreeRoot) {
      nextEffect = null;
      return;
    }

    var sibling = fiber.sibling;

    if (sibling !== null) {
      sibling.return = fiber.return;
      nextEffect = sibling;
      return;
    }

    nextEffect = fiber.return;
  }
}
```

### commitLayoutEffectOnFiber这个代码很长
commitLayoutEffectOnFiber根据不同tag进入不同case一共做了两件事：
1. 调用生命周期钩子和 hook 相关操作:调用 commitHookEffectListMount
3.  此外还会执行commitUpdateQueue，该方法用于执行我们在this.setState中指定的callback
4. commitAttachRef（赋值 ref）
5. 对于class组件则会根据current是否存在来决定执行ComponentDidMount还是ComponentDidUpdate，
6. 这里传入方法的flag是useLayoutEffect对应的flag，因此我们可以明确，useLayoutEffect的回调函数会在layout阶段同步执行。

以case SimpleMemoComponent 为例子：
```js
function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork, committedLanes) {
  if ((finishedWork.flags & LayoutMask) !== NoFlags) {
    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent:
        {
          if (!offscreenSubtreeWasHidden) {
            // At this point layout effects have already been destroyed (during mutation phase).
            // This is done to prevent sibling component effects from interfering with each other,
            // e.g. a destroy function in one component should never override a ref set
            // by a create function in another component during the same commit.
            if (finishedWork.mode & ProfileMode) {
              try {
                startLayoutEffectTimer();
                // 执行useLayoutEffect的回调
                console.log('commitLayoutEffectOnFiber-case等于SimpleMemoComponent为例：调用commitHookEffectListMount 2')
                commitHookEffectListMount(Layout | HasEffect, finishedWork);
              } finally {
                recordLayoutEffectDuration(finishedWork);
              }
            } else {
              console.log('commitLayoutEffectOnFiber-case等于SimpleMemoComponent为例：调用commitHookEffectListMount 2')
              commitHookEffectListMount(Layout | HasEffect, finishedWork);
            }
          }

          break;
        }

      case ClassComponent:
        {
          var instance = finishedWork.stateNode;

          if (finishedWork.flags & Update) {
            if (!offscreenSubtreeWasHidden) {
              if (current === null) {
                // We could update instance props and state here,
                // but instead we rely on them being set during last render.
                // TODO: revisit this when we implement resuming.
                {
                  if (finishedWork.type === finishedWork.elementType && !didWarnAboutReassigningProps) {
                    if (instance.props !== finishedWork.memoizedProps) {
                      error('Expected %s props to match memoized props before ' + 'componentDidMount. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
                    }

                    if (instance.state !== finishedWork.memoizedState) {
                      error('Expected %s state to match memoized state before ' + 'componentDidMount. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.state`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
                    }
                  }
                }

                if (finishedWork.mode & ProfileMode) {
                  try {
                    startLayoutEffectTimer();
                    // 根据current是否存在执行不同生命周期
                    instance.componentDidMount();
                  } finally {
                    recordLayoutEffectDuration(finishedWork);
                  }
                } else {
                  instance.componentDidMount();
                }
              } else {
                var prevProps = finishedWork.elementType === finishedWork.type ? current.memoizedProps : resolveDefaultProps(finishedWork.type, current.memoizedProps);
                var prevState = current.memoizedState; // We could update instance props and state here,
                // but instead we rely on them being set during last render.
                // TODO: revisit this when we implement resuming.

                {
                  if (finishedWork.type === finishedWork.elementType && !didWarnAboutReassigningProps) {
                    if (instance.props !== finishedWork.memoizedProps) {
                      error('Expected %s props to match memoized props before ' + 'componentDidUpdate. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
                    }

                    if (instance.state !== finishedWork.memoizedState) {
                      error('Expected %s state to match memoized state before ' + 'componentDidUpdate. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.state`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
                    }
                  }
                }

                if (finishedWork.mode & ProfileMode) {
                  try {
                    startLayoutEffectTimer();
                    instance.componentDidUpdate(prevProps, prevState, instance.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    recordLayoutEffectDuration(finishedWork);
                  }
                } else {
                  instance.componentDidUpdate(prevProps, prevState, instance.__reactInternalSnapshotBeforeUpdate);
                }
              }
            }
          } // TODO: I think this is now always non-null by the time it reaches the
          // commit phase. Consider removing the type check.


          var updateQueue = finishedWork.updateQueue;

          if (updateQueue !== null) {
            {
              if (finishedWork.type === finishedWork.elementType && !didWarnAboutReassigningProps) {
                if (instance.props !== finishedWork.memoizedProps) {
                  error('Expected %s props to match memoized props before ' + 'processing the update queue. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.props`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
                }

                if (instance.state !== finishedWork.memoizedState) {
                  error('Expected %s state to match memoized state before ' + 'processing the update queue. ' + 'This might either be because of a bug in React, or because ' + 'a component reassigns its own `this.state`. ' + 'Please file an issue.', getComponentNameFromFiber(finishedWork) || 'instance');
                }
              }
            } // We could update instance props and state here,
            // but instead we rely on them being set during last render.
            // TODO: revisit this when we implement resuming.


            commitUpdateQueue(finishedWork, updateQueue, instance);
          }

          break;
        }

      case HostRoot:
        {
          // TODO: I think this is now always non-null by the time it reaches the
          // commit phase. Consider removing the type check.
          var _updateQueue = finishedWork.updateQueue;

          if (_updateQueue !== null) {
            var _instance = null;

            if (finishedWork.child !== null) {
              switch (finishedWork.child.tag) {
                case HostComponent:
                  _instance = getPublicInstance(finishedWork.child.stateNode);
                  break;

                case ClassComponent:
                  _instance = finishedWork.child.stateNode;
                  break;
              }
            }

            commitUpdateQueue(finishedWork, _updateQueue, _instance);
          }

          break;
        }

      case HostComponent:
        {
          var _instance2 = finishedWork.stateNode; // Renderers may schedule work to be done after host components are mounted
          // (eg DOM renderer may schedule auto-focus for inputs and form controls).
          // These effects should only be committed when components are first mounted,
          // aka when there is no current/alternate.

          if (current === null && finishedWork.flags & Update) {
            var type = finishedWork.type;
            var props = finishedWork.memoizedProps;
            commitMount(_instance2, type, props);
          }

          break;
        }

      case HostText:
        {
          // We have no life-cycles associated with text.
          break;
        }

      case HostPortal:
        {
          // We have no life-cycles associated with portals.
          break;
        }

      case Profiler:
        {
          {
            var _finishedWork$memoize2 = finishedWork.memoizedProps,
              onCommit = _finishedWork$memoize2.onCommit,
              onRender = _finishedWork$memoize2.onRender;
            var effectDuration = finishedWork.stateNode.effectDuration;
            var commitTime = getCommitTime();
            var phase = current === null ? 'mount' : 'update';

            {
              if (isCurrentUpdateNested()) {
                phase = 'nested-update';
              }
            }

            if (typeof onRender === 'function') {
              onRender(finishedWork.memoizedProps.id, phase, finishedWork.actualDuration, finishedWork.treeBaseDuration, finishedWork.actualStartTime, commitTime);
            }

            {
              if (typeof onCommit === 'function') {
                onCommit(finishedWork.memoizedProps.id, phase, effectDuration, commitTime);
              } // Schedule a passive effect for this Profiler to call onPostCommit hooks.
              // This effect should be scheduled even if there is no onPostCommit callback for this Profiler,
              // because the effect is also where times bubble to parent Profilers.


              enqueuePendingPassiveProfilerEffect(finishedWork); // Propagate layout effect durations to the next nearest Profiler ancestor.
              // Do not reset these values until the next render so DevTools has a chance to read them first.

              var parentFiber = finishedWork.return;

              outer: while (parentFiber !== null) {
                switch (parentFiber.tag) {
                  case HostRoot:
                    var root = parentFiber.stateNode;
                    root.effectDuration += effectDuration;
                    break outer;

                  case Profiler:
                    var parentStateNode = parentFiber.stateNode;
                    parentStateNode.effectDuration += effectDuration;
                    break outer;
                }

                parentFiber = parentFiber.return;
              }
            }
          }

          break;
        }

      case SuspenseComponent:
        {
          commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
          break;
        }

      case SuspenseListComponent:
      case IncompleteClassComponent:
      case ScopeComponent:
      case OffscreenComponent:
      case LegacyHiddenComponent:
        {
          break;
        }

      default:
        throw new Error('This unit of work tag should not have side-effects. This error is ' + 'likely caused by a bug in React. Please file an issue.');
    }
  }

  if (!offscreenSubtreeWasHidden) {
    {
      if (finishedWork.flags & Ref) {
        commitAttachRef(finishedWork);
      }
    }
  }
}
```

### useLayoutEffect和useEffect最后都是在commitHookEffectListMount() 执行
commitHookEffectListMount(Layout | HasEffect, finishedWork)会执行 useLayoutEffect 的回调函数。

## useEffect 异步调用分为三步：
1. before mutation 阶段在scheduleCallback 中调度flushPassiveEffects；
2. layout 阶段之后将effectList赋值给rootWithPendingPassiveEffects；
3. scheduleCallback触发flushPassiveEffects，flushPassiveEffects内部遍历rootWithPendingPassiveEffects。

### 如何异步调度
在这几行代码内，scheduleCallback 方法由Scheduler 模块提供，用于以某个优先级异步调度一个回调函数。
```js
// 调度 useEffect
if ((effectTag & Passive) !== NoEffect) {
  if (!rootDoesHavePassiveEffects) {
    rootDoesHavePassiveEffects = true;
    scheduleCallback(NormalSchedulerPriority, () => {
      // 触发 useEffect
      flushPassiveEffects();
      return null;
    });
  }
}
```
在此处，被异步调度的回调函数就是触发 useEffect 的方法flushPassiveEffects。

在flushPassiveEffects 方法内部会从全局变量rootWithPendingPassiveEffects 获取 effectList。
在我们讲到，effectList中 保存了需要执行副作用的 Fiber 节点。其中副作用包括：
- 插入 DOM 节点（Placement）
- 更新 DOM 节点（Update）
- 删除 DOM 节点（Deletion）

除此外，当一个FunctionComponent含有useEffect或useLayoutEffect，他对应的 Fiber 节点也会被赋值 effectTag。你可以从 这里 看到 hook 相关的 effectTag。

在flushPassiveEffects 方法内部会遍历 rootWithPendingPassiveEffects（即 effectList）执行 effect 回调函数。

如果在此时直接执行，rootWithPendingPassiveEffects === null。

那么 rootWithPendingPassiveEffects 会在何时赋值呢？

在上一节layout 之后的代码片段中会根据 rootDoesHavePassiveEffects === true ? 决定是否赋值 rootWithPendingPassiveEffects。
```js
const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;
if (rootDoesHavePassiveEffects) {
  rootDoesHavePassiveEffects = false;
  rootWithPendingPassiveEffects = root;
  pendingPassiveEffectsLanes = lanes;
  pendingPassiveEffectsRenderPriority = renderPriorityLevel;
}
```


## useEffect初始化
create：使用者传入的回调函数；
deps：使用者传入的数组依赖；
```js
useEffect: function (create, deps) {
  currentHookNameInDev = 'useEffect';
  mountHookTypesDev();
  checkDepsAreArrayDev(deps);
  return mountEffect(create, deps);
}

function mountEffect(create, deps) {
  if ((currentlyRenderingFiber$1.mode & StrictEffectsMode) !== NoMode) {
    return mountEffectImpl(MountPassiveDev | Passive | PassiveStatic, Passive$1, create, deps);
  } else {
    return mountEffectImpl(Passive | PassiveStatic, Passive$1, create, deps);
  }
}
```

```js
function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  console.log('=副作用:mountEffectImpl-hook初始化')
  var hook = mountWorkInProgressHook();
  console.log('=副作用:mountEffectImpl-判断是否有传入deps，如果有会作为下次更新的deps')
  var nextDeps = deps === undefined ? null : deps;
  console.log('=副作用:mountEffectImpl-给hook所在的fiber打上有副作用的更新的标记')
  currentlyRenderingFiber$1.flags |= fiberFlags;
  console.log('=副作用:mountEffectImpl-将副作用操作存放到fiber.memoizedState.hook.memoizedState中')
  hook.memoizedState = pushEffect(HasEffect | hookFlags, create, undefined, nextDeps);
}
```

### useEffect之pushEffect 存放副作用更新
上面这段代码除了初始化副作用的结构代码外，都是我们前面讲过的操作闭环链表，向链表末尾添加新的effect，该effect.next指向firstEffect，并且链表当前的指针指向最新添加的effect。

useEffect的初始化就这么简单，简单总结一下：给hook所在的fiber打上副作用更新标记，并且fiber.memoizedState.hook.memoizedState和fiber.updateQueue存储了相关的副作用，这些副作用通过闭环链表的结构存储
```js
function pushEffect(tag, create, destroy, deps) {
  var effect = {
    tag: tag,
    create: create,
    destroy: destroy,
    deps: deps,
    // Circular
    next: null
  };
  var componentUpdateQueue = currentlyRenderingFiber$1.updateQueue;

  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber$1.updateQueue = componentUpdateQueue;
    console.log('%c=副作用:pushEffect-effect.next = effect形成环形链表1', 'color:chartreuse')
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    var lastEffect = componentUpdateQueue.lastEffect;

    if (lastEffect === null) {
      console.log('%c=副作用:pushEffect-effect.next = effect形成环形链表2', 'color:chartreuse')
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      console.log('%c=副作用:pushEffect-effect.next = effect形成环形链表3', 'color:chartreuse')
      var firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
  console.log('=副作用:pushEffect-返回值', { effect })
  return effect;
}
```

### useEffect之更新useEffect-->不一定会调用updateEffectImpl
updateWorkInProgressHook主要功能就是创建一个带有回调函数的newHook去覆盖之前的hook

它会判断两次依赖数组中的值是否有变化以及deps是否是空数组来决定返回true和false，返回true表明这次不需要调用回调函数。
现在我们明白了两次pushEffect的异同，if内部的pushEffect是不需要调用的回调函数， 外面的pushEffect是需要调用的。

不管useEffect里的deps有没有变化都会为回调函数创建effect并添加到effect链表和fiber.updateQueue中，但是React会根据effect.tag来决定该effect是否要添加到副作用执行队列中去执行。
```js
function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
}
```

## useEffect之执行:开始执行useEffect,同在commitRootImpl
![](../assets/img-react/useEffect-执行流程.png)
首先在mutation之前阶段，基于副作用创建任务并放到taskQueue中，同时会执行requestHostCallback，这个方法就涉及到了异步了，它首先考虑使用MessageChannel实现异步，其次会考虑使用setTimeout实现。使用MessageChannel时，requestHostCallback会马上执行port.postMessage(null);，这样就可以在异步的第一时间执行workLoop，workLoop会遍历taskQueue，执行任务，如果是useEffect的effect任务，会调用flushPassiveEffects。

可能有人会疑惑为什么优先考虑MessageChannel？

回答：首先我们要明白React调度更新的目的是为了时间分片，意思是每隔一段时间就把主线程还给浏览器，避免长时间占用主线程导致页面卡顿。使用MessageChannel和SetTimeout的目的都是为了创建宏任务，因为宏任务会在当前微任务都执行完后，等到浏览器主线程空闲后才会执行。不优先考虑setTimeout的原因是，setTimeout执行时间不准确，会造成时间浪费，即使是setTimeout(fn, 0)。

`scheduleCallback将执行useEffect的动作作为一个任务去调度，这个任务会异步调用`
```js
function commitRootImpl(root, recoverableErrors, transitions, renderPriorityLevel) {
  // 省略
  console.log(`%c=副作用:commitRootImpl务，如果是useEffect的effect任务，会调用flushPassiveEffects`, 'color:yellow', (finishedWork.subtreeFlags & PassiveMask) !== NoFlags || (finishedWork.flags & PassiveMask) !== NoFlags)
  if ((finishedWork.subtreeFlags & PassiveMask) !== NoFlags || (finishedWork.flags & PassiveMask) !== NoFlags) {
    if (!rootDoesHavePassiveEffects) {
      rootDoesHavePassiveEffects = true;
      // to store it in pendingPassiveTransitions until they get processed
      // We need to pass this through as an argument to commitRoot
      // because workInProgressTransitions might have changed between
      // the previous render and commit if we throttle the commit
      // with setTimeout

      pendingPassiveTransitions = transitions;
      scheduleCallback$1(NormalPriority, function () {
        console.log(`%c=副作用:commitRootImpl调用flushPassiveEffects-2`, 'color:yellow')
        flushPassiveEffects(); // This render triggered passive effects: release the root cache pool
        // *after* passive effects fire to avoid freeing a cache pool that may
        // be referenced by a node in the tree (HostRoot, Cache boundary etc)

        return null;
      });
    }
  }
  // 省略
}
```

```js
function scheduleCallback$1(priorityLevel, callback) {
  {
    // If we're currently inside an `act` scope, bypass Scheduler and push to
    // the `act` queue instead.
    var actQueue = ReactCurrentActQueue$1.current;

    if (actQueue !== null) {
      actQueue.push(callback);
      return fakeActCallbackNode;
    } else {
      return scheduleCallback(priorityLevel, callback);
    }
  }
}
```

### useEffect之执行:flushPassiveEffects调用flushPassiveEffects 
```js
function flushPassiveEffects() {
  // Returns whether passive effects were flushed.
  // TODO: Combine this check with the one in flushPassiveEFfectsImpl. We should
  // probably just combine the two functions. I believe they were only separate
  // in the first place because we used to wrap it with
  // `Scheduler.runWithPriority`, which accepts a function. But now we track the
  // priority within React itself, so we can mutate the variable directly.
  console.log(`%c=副作用:flushPassiveEffects return bool`, 'color:yellow', { rootWithPendingPassiveEffects: rootWithPendingPassiveEffects !== null })
  if (rootWithPendingPassiveEffects !== null) {
    var renderPriority = lanesToEventPriority(pendingPassiveEffectsLanes);
    var priority = lowerEventPriority(DefaultEventPriority, renderPriority);
    var prevTransition = ReactCurrentBatchConfig$3.transition;
    var previousPriority = getCurrentUpdatePriority();

    try {
      ReactCurrentBatchConfig$3.transition = null;
      setCurrentUpdatePriority(priority);
      console.log(`%c=副作用:flushPassiveEffects 调用return flushPassiveEffectsImpl()`, 'color:yellow')
      return flushPassiveEffectsImpl();
    } finally {
      setCurrentUpdatePriority(previousPriority);
      ReactCurrentBatchConfig$3.transition = prevTransition; // Once passive effects have run for the tree - giving components a
    }
  }

  return false;
}
```

```js
function commitPassiveMountEffects(root, finishedWork, committedLanes, committedTransitions) {
  nextEffect = finishedWork;
  console.log(`%c=副作用:commitPassiveMountEffects调用commitPassiveMountEffects_begin`, 'color:yellow')
  commitPassiveMountEffects_begin(finishedWork, root, committedLanes, committedTransitions);
}

function commitPassiveMountEffects_begin(subtreeRoot, root, committedLanes, committedTransitions) {
  while (nextEffect !== null) {
    var fiber = nextEffect;
    var firstChild = fiber.child;

    if ((fiber.subtreeFlags & PassiveMask) !== NoFlags && firstChild !== null) {
      firstChild.return = fiber;
      nextEffect = firstChild;
    } else {
      console.log(`%c=副作用:commitPassiveMountEffects_begin调用commitPassiveMountEffects_complete`, 'color:yellow')
      commitPassiveMountEffects_complete(subtreeRoot, root, committedLanes, committedTransitions);
    }
  }
}

function commitPassiveMountEffects_complete(subtreeRoot, root, committedLanes, committedTransitions) {
  while (nextEffect !== null) {
    var fiber = nextEffect;

    if ((fiber.flags & Passive) !== NoFlags) {
      setCurrentFiber(fiber);

      try {
        console.log(`%c=副作用:commitPassiveMountEffects_complete调用commitPassiveMountOnFiber`, 'color:yellow')
        commitPassiveMountOnFiber(root, fiber, committedLanes, committedTransitions);
      } catch (error) {
        captureCommitPhaseError(fiber, fiber.return, error);
      }

      resetCurrentFiber();
    }

    if (fiber === subtreeRoot) {
      nextEffect = null;
      return;
    }

    var sibling = fiber.sibling;

    if (sibling !== null) {
      sibling.return = fiber.return;
      nextEffect = sibling;
      return;
    }

    nextEffect = fiber.return;
  }
}
```

## useEffect之执行:最后一步commitPassiveMountOnFiber
最后一步调用:commitPassiveMountOnFiber-->commitHookEffectListMount-->最后执行 useLayoutEffect 的回调函数。

```js
function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
      {
        if (finishedWork.mode & ProfileMode) {
          startPassiveEffectTimer();

          try {
            console.log(`%c=副作用:commitPassiveMountOnFiber case为SimpleMemoComponent','color:yellow','%c调用commitHookEffectListMount 1`, 'color:red')
            commitHookEffectListMount(Passive$1 | HasEffect, finishedWork);
          } finally {
            recordPassiveEffectDuration(finishedWork);
          }
        } else {
          console.log('%c=副作用:commitPassiveMountOnFiber case为SimpleMemoComponent%c调用commitHookEffectListMount 2', 'color:yellow', 'color:red')
          commitHookEffectListMount(Passive$1 | HasEffect, finishedWork);
        }

        break;
      }
  }
}
```

## commitHookEffectListMount effect的执行函数
```js
function commitHookEffectListMount(flags, finishedWork) {
  var updateQueue = finishedWork.updateQueue;
  var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;

  if (lastEffect !== null) {
    var firstEffect = lastEffect.next;
    var effect = firstEffect;

    console.log('%ccommitHookEffectListMount开始循环effect !== firstEffect', 'color:red')
    do {
      if ((effect.tag & flags) === flags) {
        {
          if ((flags & Passive$1) !== NoFlags$1) {
            markComponentPassiveEffectMountStarted(finishedWork);
          } else if ((flags & Layout) !== NoFlags$1) {
            markComponentLayoutEffectMountStarted(finishedWork);
          }
        } // Mount

        // create即我们在副作用中指定的回调
        var create = effect.create;

        {
          if ((flags & Insertion) !== NoFlags$1) {
            setIsRunningInsertionEffect(true);
          }
        }
        console.log('commitHookEffectListMount执行Effect:', { create })
        effect.destroy = create();

        {
          if ((flags & Insertion) !== NoFlags$1) {
            setIsRunningInsertionEffect(false);
          }
        }

        {
          if ((flags & Passive$1) !== NoFlags$1) {
            markComponentPassiveEffectMountStopped();
          } else if ((flags & Layout) !== NoFlags$1) {
            markComponentLayoutEffectMountStopped();
          }
        }

        {
          // 执行回调得到销毁函数，赋值给destroy，将来会在commitHookEffectListUnmount中执行
          var destroy = effect.destroy;

          if (destroy !== undefined && typeof destroy !== 'function') {
            var hookName = void 0;

            if ((effect.tag & Layout) !== NoFlags) {
              hookName = 'useLayoutEffect';
            } else if ((effect.tag & Insertion) !== NoFlags) {
              hookName = 'useInsertionEffect';
            } else {
              hookName = 'useEffect';
            }

            var addendum = void 0;

            if (destroy === null) {
              addendum = ' You returned null. If your effect does not require clean ' + 'up, return undefined (or nothing).';
            } else if (typeof destroy.then === 'function') {
              addendum = '\n\nIt looks like you wrote ' + hookName + '(async () => ...) or returned a Promise. ' + 'Instead, write the async function inside your effect ' + 'and call it immediately:\n\n' + hookName + '(() => {\n' + '  async function fetchData() {\n' + '    // You can await here\n' + '    const response = await MyAPI.getData(someId);\n' + '    // ...\n' + '  }\n' + '  fetchData();\n' + "}, [someId]); // Or [] if effect doesn't need props or state\n\n" + 'Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching';
            } else {
              addendum = ' You returned: ' + destroy;
            }

            error('%s must not return anything besides a function, ' + 'which is used for clean-up.%s', hookName, addendum);
          }
        }
      }

      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```
