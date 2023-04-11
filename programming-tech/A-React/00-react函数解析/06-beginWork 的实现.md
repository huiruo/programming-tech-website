


在 beginWork 中有很多针对 fiber 的操作，所以在正式看 beginWork 的流程之前，先研究一下 Fiber 的结构。
```js
 type Fiber = {|
   // 表示Fiber的类型
   tag: WorkTag,
 
   // child 的唯一标识符
   key: null | string,
 
   // element.type 的值，用于在 diff 子项期间保留标识
   elementType: any,
   
   // 与 fiber 关联的函数或类
   type: any,
 
   // fiber 关联的局部状态
   stateNode: any,
 
   // 我们正在处理的东西的父对象。概念上与堆栈帧的返回地址相同。
   return: Fiber | null,
 
   // 用长子-兄弟链表表示法表示一棵Fiber树
   child: Fiber | null,
   sibling: Fiber | null,
   index: number,
   
   // 最后一个用于绑定本结点的 ref，不能绑定到函数式组件上。
   ref:
     | null
     | (((handle: mixed) => void) & {_stringRef: ?string, ...})
     | RefObject,
 
   // 等待 Fiber 处理的 props
   pendingProps: any,
   memoizedProps: any, //用于创建产出的 props
 
   // 状态更新和回调的队列
   updateQueue: mixed,
 
   // 用于创建输出的状态
   memoizedState: any,
 
   // fiber 的依赖项可能是 context 或 event
   dependencies: Dependencies | null,
 
   // 描述 fiber 和它的子树的性质的位域。比如 ConcurrentMode flag 表示子树默认情况下是异步的。当 fiber 被创建时，它的 mode 会继承父 fiber 的 mode，也可以在创建的时候添加更多的 flag，但是创建之后，在 fiber 的整个生命周期都不应该再被改变。
   mode: TypeOfMode,
 
   // Effect
   flags: Flags,
   subtreeFlags: Flags,
   deletions: Array<Fiber> | null,
                                     
   // 副作用 fiber 链表中当前 fiber 的 next 指针                      
   nextEffect: Fiber | null,
   // 副作用 fiber 链表的头指针                               
   firstEffect: Fiber | null,
   // 副作用 fiber 链表的尾指针
   lastEffect: Fiber | null,
 
   lanes: Lanes,
   childLanes: Lanes,
 
   // 这是 fiber 的更新合并后的版本                                 
   alternate: Fiber | null,
 
   // 省略调试相关和 profiler 相关字段
 |};
```

## beginWork 逻辑

1. 如果新旧 props 发生变化或者消费的 context 发生了改变，则 didReceiveUpdate = true
2. 否则，调 checkScheduledUpdateOrContext 函数，如果返回值为 false 并且 workInProgress.flags & DidCapture) === NoFlags，则设置 didReceiveUpdate 为 false，调用attemptEarlyBailoutIfNoScheduledUpdate 并返回其返回值

3. 根据 workInProgress.tag 的值调用不同的操作，其中函数组件的操作如下，关键是调用了 updateFunctionComponent 函数


PS：新 props 指 workInProgress.pendingProps，旧 props 指 current.memoizedProps，即便新旧 props 没有变化或者 context 没有改变，也不能立即得出 fiber 不需要更新的结论，因为如果第二次传递 error 或 suspense 边界，可能在 current 上不存在 work 的调度。所以需要调用 checkScheduledUpdateOrContext 进行检查。


## updateFunctionComponent
```js
 function updateFunctionComponent (
   current,
   workInProgress,
   Component,
   nextProps: any,
   renderLanes,
 ) {}
```

核心逻辑如下：

1. 处理 context（调 getUnmaskedContext、getMaskedContext 和 prepareToReadContext），然后执行 renderWithHooks 函数。
2. 如果 current 不为 null 且 didReceiveUpdate 为false，则执行 bailoutHooks 函数和 bailoutOnAlreadyFinishedWork 函数，并返回后者。
3.  如果 getIsHydrating() 为 true，并且 checkDidRenderIdHook() 为 true，则调用 pushMaterializedTreeId(workInProgress) 函数
4.  执行 reconcileChildren 函数
返回 workInProgress.child
