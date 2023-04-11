
## 1
两种模式会进入performSyncWorkOnRoot或者performConcurrentWorkOnRoot， 
这两个方法分别会调用workLoopSync或者workLoopConcurrent

scheduleCallback 进行对第二个参数进行调度，performConcurrentWorkOnRoot.bind(null, root) 最终会在某个时机被执行
```js
/*
在 ensureRootIsScheduled 中，如果 getHighestPriorityLane 调用的返回值不是 SyncLane的时候，则有以下代码：
*/
function ensureRootIsScheduled(){
  // ...
  newCallbackNode = scheduleCallback(schedulerPriorityLevel,performConcurrentWorkOnRoot.bind(null, root))

  root.callbackNode = newCallbackNode
}
```

## 两个函数区别 workLoopConcurrent workLoopSync
它们唯一的区别是是否调用shouldYield。如果当前浏览器帧没有剩余时间，shouldYield会中止循环，直到浏览器有空闲时间后再继续遍历。

workInProgress代表当前已创建的 workInProgress fiber。
```js
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}
```

## 函数内执行的关键函数
* flushPassiveEffects ：执行某些副作用
* ensureRootIsScheduled ：形成递归执行
* renderRootConcurrent ：与 renderRootSync 只能两选一，如果执行的是renderRootConcurrent ，最后会执行 finishConcurrentRender
* renderRootSync ： 与 renderRootConcurrent 二选一
* finishConcurrentRender ：执行完成并发渲染的后置操作（我估计是这样的）

```js
function performConcurrentWorkOnRoot(root, didTimeout) {
  {
    resetNestedUpdateFlag();
  } // Since we know we're in a React event, we can clear the current
  // event time. The next update will compute a new event time.

  console.log('performConcurrentWorkOnRoot:同步更新concurrent模式');
  currentEventTime = NoTimestamp;
  currentEventTransitionLane = NoLanes;

  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    throw new Error('Should not already be working.');
  } // Flush any pending passive effects before deciding which lanes to work on,
  // in case they schedule additional work.


  var originalCallbackNode = root.callbackNode;
  var didFlushPassiveEffects = flushPassiveEffects();

  if (didFlushPassiveEffects) {
    // Something in the passive effect phase may have canceled the current task.
    // Check if the task node for this root was changed.
    if (root.callbackNode !== originalCallbackNode) {
      // The current task was canceled. Exit. We don't need to call
      // `ensureRootIsScheduled` because the check above implies either that
      // there's a new task, or that there's no remaining work on this root.
      return null;
    }
  } // Determine the next lanes to work on, using the fields stored
  // on the root.


  var lanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);

  if (lanes === NoLanes) {
    // Defensive coding. This is never expected to happen.
    return null;
  } // We disable time-slicing in some cases: if the work has been CPU-bound
  // for too long ("expired" work, to prevent starvation), or we're in
  // sync-updates-by-default mode.
  // TODO: We only check `didTimeout` defensively, to account for a Scheduler
  // bug we're still investigating. Once the bug in Scheduler is fixed,
  // we can remove this, since we track expiration ourselves.


  var shouldTimeSlice = !includesBlockingLane(root, lanes) && !includesExpiredLane(root, lanes) && (!didTimeout);
  var exitStatus = shouldTimeSlice ? renderRootConcurrent(root, lanes) : renderRootSync(root, lanes);

  if (exitStatus !== RootInProgress) {
    if (exitStatus === RootErrored) {
      // If something threw an error, try rendering one more time. We'll
      // render synchronously to block concurrent data mutations, and we'll
      // includes all pending updates are included. If it still fails after
      // the second attempt, we'll give up and commit the resulting tree.
      var errorRetryLanes = getLanesToRetrySynchronouslyOnError(root);

      if (errorRetryLanes !== NoLanes) {
        lanes = errorRetryLanes;
        exitStatus = recoverFromConcurrentError(root, errorRetryLanes);
      }
    }

    if (exitStatus === RootFatalErrored) {
      var fatalError = workInProgressRootFatalError;
      prepareFreshStack(root, NoLanes);
      markRootSuspended$1(root, lanes);
      ensureRootIsScheduled(root, now());
      throw fatalError;
    }

    if (exitStatus === RootDidNotComplete) {
      // The render unwound without completing the tree. This happens in special
      // cases where need to exit the current render without producing a
      // consistent tree or committing.
      //
      // This should only happen during a concurrent render, not a discrete or
      // synchronous update. We should have already checked for this when we
      // unwound the stack.
      markRootSuspended$1(root, lanes);
    } else {
      // The render completed.
      // Check if this render may have yielded to a concurrent event, and if so,
      // confirm that any newly rendered stores are consistent.
      // TODO: It's possible that even a concurrent render may never have yielded
      // to the main thread, if it was fast enough, or if it expired. We could
      // skip the consistency check in that case, too.
      var renderWasConcurrent = !includesBlockingLane(root, lanes);
      var finishedWork = root.current.alternate;

      if (renderWasConcurrent && !isRenderConsistentWithExternalStores(finishedWork)) {
        // A store was mutated in an interleaved event. Render again,
        // synchronously, to block further mutations.
        exitStatus = renderRootSync(root, lanes); // We need to check again if something threw

        if (exitStatus === RootErrored) {
          var _errorRetryLanes = getLanesToRetrySynchronouslyOnError(root);

          if (_errorRetryLanes !== NoLanes) {
            lanes = _errorRetryLanes;
            exitStatus = recoverFromConcurrentError(root, _errorRetryLanes); // We assume the tree is now consistent because we didn't yield to any
            // concurrent events.
          }
        }

        if (exitStatus === RootFatalErrored) {
          var _fatalError = workInProgressRootFatalError;
          prepareFreshStack(root, NoLanes);
          markRootSuspended$1(root, lanes);
          ensureRootIsScheduled(root, now());
          throw _fatalError;
        }
      } // We now have a consistent tree. The next step is either to commit it,
      // or, if something suspended, wait to commit it after a timeout.


      root.finishedWork = finishedWork;
      root.finishedLanes = lanes;
      finishConcurrentRender(root, exitStatus, lanes);
    }
  }

  ensureRootIsScheduled(root, now());

  if (root.callbackNode === originalCallbackNode) {
    // The task node scheduled for this root is the same one that's
    // currently executed. Need to return a continuation.
    return performConcurrentWorkOnRoot.bind(null, root);
  }

  return null;
}
```

## renderRootConcurrent
这个函数实现的逻辑主要如下:
1. 记录原来的 executionContext， 然后给 executionContext 增加渲染上下文 RenderContext
2. 保存现场——将 dispatcher 存入栈
3. 如果有问题则重置 timer，并 prepareFreshStack
4. 执行一看就很关键的 workLoopConcurrent
5. 重置上下文依赖，即调用 resetContextDependencies
6. 回复现场——从栈中 pop dispatcher
7. 恢复原来的 executionContext
8. 如果 workInProgress 不为 null，然后返回 RootIncomplete 状态，否则重置 workInProgressRoot 和 workInProgressRootRenderLanes，返回 workInProgressRootExitStatus 状态

```js
function renderRootConcurrent(root, lanes) {
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
    resetRenderTimer();
    prepareFreshStack(root, lanes);
  }

  {
    markRenderStarted(lanes);
  }

  do {
    try {
      workLoopConcurrent();
      break;
    } catch (thrownValue) {
      handleError(root, thrownValue);
    }
  } while (true);

  resetContextDependencies();
  popDispatcher(prevDispatcher);
  executionContext = prevExecutionContext;


  if (workInProgress !== null) {
    // Still work remaining.
    {
      markRenderYielded();
    }

    return RootInProgress;
  } else {
    // Completed the tree.
    {
      markRenderStopped();
    } // Set this to null to indicate there's no in-progress render.


    workInProgressRoot = null;
    workInProgressRootRenderLanes = NoLanes; // Return the final exit status.

    return workInProgressRootExitStatus;
  }
}
```


## workLoopConcurrent
作用: 持续调用 performUnitOfWork 直到 workInProgress 为空或者 shouldYield 函数返回 false。
```
shouldYield 就是 scheduler 库里的 unstable_shouldYield 函数，该函数的作用是当处于需要中断 react的渲染，将控制交还给“主线程”的场景时返回 true，具体来说就是当前时间距离全局变量 startTime 的间隔小于帧最小间隔（约为 5ms）的时候返回 true。
```

## performUnitOfWork
主要是执行 beginWork 逻辑，然后将 workInProgress.pedingProps 的内容复制给 workInProgress.memoizedProps, 最后 ReactCurrentOwner.current 重置为 null。
```js
function performUnitOfWork (unitOfWork: Fiber): void {
  const current = unitOfWork.alternate
  setCurrentDebugFiberInDEV(unitOfWork)
  let next = beginWork(current, unitOfWork, subtreeRenderLanes)
  unitOfWork.memoizedProps = unitOfWork.pendingProps
  if (next === null) {
    completeUnitOfWork(unitOfWork)
  } else {
    workInProgress = next
  }

  ReactCurrentOwner.current = null
}
```

## beginWork
直到现在，我们仍没看到 react 是如何实现 dom 的更新的，dom diff 又是如何进行的，而这部分逻辑隐藏在 beginWork 之下，明天我们再来瞅一瞅 beginWork 的实现。
