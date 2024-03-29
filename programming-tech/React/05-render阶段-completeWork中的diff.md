---
title: render阶段-completeWork中的diff
sidebar_position: 8
---

## Diff

### diff比较发生在什么时候？
diff 算法发生在:beginWork 和 completeWork:
```js
reconcileChildFibers是React Diff真正的入口函数
```

[参考:render阶段-mountIndeterminateComponent构建fiber树](./render阶段-mountIndeterminateComponent构建fiber树)
```
### completeWork阶段:生成实例
```

[参考2:render阶段1-beginWork](./render阶段1-beginWork)
```
## beginWork第3步-Reconciliation-双缓存-diff
```

### 相关概念
React 17 diff 算法（协调算法）进行了优化，这个新的算法被称为"Concurrent Mode"（并发模式）。Concurrent Mode 使得 React 更具响应性，可以更好地处理大型应用程序，并改善了用户体验

1. **Concurrent Mode（并发模式）**:
   Concurrent Mode 是 React 17 中引入的新模式，它允许 React 在渲染和协调工作中更好地分配时间，从而提高应用程序的响应性。在 Concurrent Mode 中，React 会将工作分为多个优先级，以便更好地响应用户输入并在不阻塞主线程的情况下执行工作。这有助于防止页面卡死，即使在执行耗时操作时也能够保持用户界面的流畅性。

2. **Fiber架构**:
   在 Concurrent Mode 中，React 使用了 Fiber 架构。Fiber 是一种数据结构，用于表示组件树，并且允许 React 在执行渲染和协调工作时更好地控制任务的中断和继续。这允许 React 在不同优先级之间切换工作，以便及时响应用户操作。

3. **增量更新**:
   在 React 17 中，Diff 算法的一个重要变化是引入了增量更新。传统的 Diff 算法是一次性遍历整个虚拟 DOM 树，找到需要更新的节点，然后一次性更新它们。这在大型应用中可能会导致性能问题。在增量更新中，React 可以中断渲染和协调工作，以响应更高优先级的任务。这使得 React 能够更好地将工作分散到多个帧中，从而提高了用户界面的响应性。

4. **Batching（批处理）**:
   在 Concurrent Mode 中，React 会将多个状态更新合并为一个批处理，然后一次性更新虚拟 DOM。这可以减少渲染的次数，提高性能。React 会根据浏览器的空闲时间来安排批处理的执行。

5. **中断和继续**:
   Fiber 架构允许 React 在执行渲染和协调工作时中断当前任务，并在稍后继续。这有助于确保及时响应用户输入。React 可以根据任务的优先级来中断工作，以执行更高优先级的任务，然后在空闲时继续低优先级任务的执行。

## React Diff三大策略
1. tree diff;
2. component diff;
3. element diff;

PS: 之前H5开发遇到的State 更新但视图未更新的Bug就是element diff检测导致。解决方案：
1. 两种业务场景下的DOM节点尽量避免雷同； 
2. 两种业务场景下的DOM节点样式避免雷同；


当前存在一个DOM节点，触发了一次更新，那么在协调的过程中，会有四种节点和该节点相关联：
1. 该DOM节点本身
2. workInProgress fiber，更新过程中产生的workInProgress Tree中的fiber节点（即current fiber.alternate）
3. current fiber，在页面中已经渲染了的DOM节点对应的fiber节点（即workInProgress fiber.alternate，也就是上
   一次更新中产生的workInProgress fiber）
4. ReactElement，更新过程中，ClassComponent的render方法或FunctionComponent的调用结果。 ReactElement中包含描述DOM节点的信息。

### effectTag
用于保存要执行DOM操作的具体类型的。 effectTag通过二进制表示：
```js
//...
// 意味着该Fiber节点对应的DOM节点需要插入到页面中。
export const Placement = /*                    */ 0b000000000000010;
//意味着该Fiber节点需要更新。
export const Update = /*                       */ 0b000000000000100;
export const PlacementAndUpdate = /*           */ 0b000000000000110;
//意味着该Fiber节点对应的DOM节点需要从页面中删除。
export const Deletion = /*                     */ 0b000000000001000;
//...
```

## diff具体
diff 比较，在构建 workInProgress fiber tree 的过程中，判断 current fiber tree 中的 fiber node 是否可以被 workInProgress fiber tree 复用。

* 能被复用，意味在本次更新中，需要做: 组件的 update 以及 dom 节点的 move、update 等操作；
* 不可复用，则意味着需要做: 组件的 mount、unmount 以及 dom 节点的 insert、delete 等操作。

diff的过程，也就是effect的收集过程，此过程会找出所有节点的变更，如节点新增、删除、属性变更等，这些变更 react 统称为副作用（effect），随着所有的节点（工作单元）在帧空闲时间逐个执行完毕，最后产出的结果是effect list，从中可以知道哪些节点更新、哪些节点增加、哪些节点删除了。

当更新完成以后，fiberRootNode 的 current 指针会指向 workInProgress fiber tree，作为下一次更新的 current fiber tree

最后，深度调和子节点，渲染视图
遍历fiber树，以workInProgress 作为最新的渲染树，即current Fiber 树。

diff逻辑
```
判断当前节点的更新属于哪种情况
如果是新增，执行新增逻辑
如果是删除，执行删除逻辑
如果是更新，执行更新逻辑
```

为了降低算法复杂度，React 的 diff 会预设三个限制：
1. 只进行同层比较。
```
tree 层级
component 层级
element 层级
```
2. 新、旧节点的 type 不同，直接删除旧节点，创建新节点。如：元素由 div 变为 p，React会销毁div及其子孙节点，并新建p` 及其子孙节点。
3. 通过 key 来复用节点。

## 单节点和多节点
从 Diff 的入口函数 reconcileChildFibers 出发，判断子元素的类型，若不是数组进入单节点diff，否则进入多节点diff

### 单节点先判断 key 是否相同
1. 如果 key 相同，再看 type
  * type 相同，复用；
  *  type 不同，全部删掉（包括它和它的兄弟元素，因为既然 key 一样，唯一的可能性都不能复用，则剩下的 fiber 都没有机会了）；

2. 如果 key 不同，只删除该child，再找到它的兄弟节点（child.silbing）的 key，直到找到key相同的节点，再同上操作

### 多节点diff
归纳只有 3 种情况，更新节点、增减节点、位置变化，由于是单向的链表（newChildren[0]与fiber比较，newChildren[1]与fiber.sibling比较），所以不能像 vue 一样用双指针遍历，所以这里逻辑要经过两轮遍历：
1. 第一轮遍历：比较 key，
  * 可复用，继续遍历 (新节点 i++，老节点child.silbing)，
  * 不可复用，就停止第一轮遍历，进入第二轮遍历，有 2 种不可复用的情况
```
key 不同，直接停止
key 相同，type 不同，标记删除，停止
```

2. 第二轮遍历：
* 老节点遍历完了，新节点还有，则将剩下的新节点插入
* 新节点遍历完了，老节点还有，则将剩下的老节点删除
* 新老节点都还有，则移动顺序，这是 diff 算法最精髓也是最难懂的部分，规则：遍历新节点，每个新节点有 2 个 index，一个 index 表示它在旧节点的位置，另一个 index 表示遍历中遇到的最大旧节点的位置，用 oldIndex 和 maxIndex 表示
```
当 oldIndex>maxIndex 时，将 oldIndex 的值赋值给 maxIndex
当 oldIndex=maxIndex 时，不操作
当 oldIndex<maxIndex 时，将当前节点移动到 index 的位置
```

## 图
```mermaid
flowchart BR
A1(reconcileChildren)
A1-->A1if{{workInProgress!==null}}
A1if--为null初始化-->A2A(mountChildFibers)--true-->A3
A1if--不为null更新-->A2B(reconcileChildFibers)--false-->A3

%% 参考：06_辅3_ChildReconciler完整函数.js
%% reconcileChildFibers内部会根据newChild（即新生成的ReactElement）的类型
%% 和$$typeof属性调用不同的处理函数
A3(ChildReconciler)--调用内部函数-->A4(reconcileChildFibers)
```

### workInProgress Fiber(内存中构建的树)和current Fiber-->双缓存
1. **workInProgress Fiber tree**:内存中构建的树
>更新过程中构建的 new fiber tree
2. **current Fiber tree正在视图层渲染的树**:真实dom对应在内存中的Fiber节点形成Fiber树
>old fiber tree，对应当前屏幕显示的内容，通过根节点 fiberRootNode 的 current 指针可以访问。

>workInProgress Fiber和current Fiber这两颗树的节点通过alternate相连.

performUnitOfWork 作用创建下一个 Fiber 节点，并赋值给 workInProgress，同时把 workInProgress 与已创建的 Fiber 节点连接起来构成 Fiber 树。


### 性能优化之2:Fiber的存在使异步可中断的更新成为了可能
1. Fiber的存在使异步可中断的更新成为了可能，作为工作单元，可以在时间片内执行工作，没时间了交还执行权给浏览器，下次时间片继续执行之前暂停之后返回的Fiber

从而使得浏览器处理时候可以将控制权交出去，避免了js线程过多占用而阻塞渲染线程，实现了更细粒度的调度，即为：协程和线程的调度

- Fiber可以在reconcile的时候进行相应的diff更新，让最后的更新应用在真实节点上

### 双缓存，以current tree为主，workInProgress tree为辅
双缓存机制是React管理更新工作的一种手段，也是提升用户体验的重要机制。

当React开始更新工作之后，会有两个fiber树，一个current树，是当前显示在页面上内容对应的fiber树。另一个是workInProgress树，它是依据current树深度优先遍历构建出来的新的fiber树，所有的更新最终都会体现在workInProgress树上。

当更新未完成的时候，页面上始终展示current树对应的内容，当更新结束时（commit阶段的最后），页面内容对应的fiber树会由current树切换到workInProgress树，此时workInProgress树即成为新的current树。

最终commit阶段完成时，两棵树会进行切换。
在未更新完成时依旧展示旧内容，保持交互，当更新完成立即切换到新内容，这样可以做到新内容和旧内容无缝切换。

渲染流程中，先复用current树（rootFiber）的alternate 作为 workInProgress。
构建workInProgress Fiber发生在createWorkInProgress中，它能创建或者复用Fiber

1. Fiber双缓存可以在构建好wip Fiber树之后切换成current Fiber，内存中直接一次性切换，提高了性能
```
React中，渲染机制就是React会调用render()函数构建一棵Dom树， 当我们需要对DOM进行事件监听时，首先对VirtualDom进行事件监听，VirtualDom会代理原生的DOM事件从而做出响应。

React中workingProgress Fiber树存在的意义是什么?
在React中最多会同时存在两棵Fiber树，当前显示在页面是current Fiber树，在内存中构建的Fiber树称为workInProgress Fiber树，workingProgress Fiber这棵树是在内存中构建的，构建完成才统一替换，这样不会产生不完全的真实dom。一旦更新完成，react会直接将current树替换成workingProgress Fiber树，以便快速完成DOM的更新。也是react提升性能的一部分

因为 workInProgress Fiber 在更新的过程中，是在内存中构建的，所有速度是非常快的，得到最终更新后的 Fiber，直接替换 Current Fiber。

current Fiber 树有一个 alternate 属性指向 workInProgress Fiber 树，workInProgress Fiber 树内也 有一个alternate 属性指向current Fiber 树

在state/props发生改变的时候，render()函数会被再次调用渲染出另外一棵树，重新渲染所有的节点，构造出新的虚拟Dom tree跟原来的Dom tree用Diff算法进行比较，找到需要更新的地方批量改动，再渲染到真实的DOM上，由于这样做就减少了对Dom的频繁操作，从而提升的性能。 
```

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
  } // Used to reuse a Fiber for a second pass.
```

## diff算法:比较两颗DOM树的差异
生成将一棵树转换成另一棵树的最小操作次数。即使使用最优的算法，该算法的复杂程度仍为 O(n^3 )，其中 n 是树中元素的数量。

### 1-3.基于条件下的 O(n)
React 在以下三个假设的基础之上提出了一套 O(n) :
1. 只对同级元素进行Diff；

2. 两个不同类型的元素会产生出不同的树；

3. 开发者可以通过设置 key 属性，来告知渲染哪些子元素在不同的渲染下可以保存不变；

diff算法复杂度达到 O(n),必须保持Virtual DOM 只会对同一个层级的元素进行对比：
![](../assets/img-react/diff比较例子.png)

例子中：**div只会和同一层级的div对比，第二层级的只会跟第二层级对比。**

但是要注意的是，因为tagName是可重复的，不能用这个来进行对比。
所以需要给子节点加上唯一标识key，列表对比的时候，使用key进行对比，这样才能复用老的 DOM 树上的节点。

这样，我们就可以通过深度优先遍历两棵树，每层的节点进行对比，记录下每个节点的差异了

### 1.深度优先遍历，记录差异
对新旧两棵树进行一个深度优先的遍历，这样每个节点都会有一个唯一的标记：
```
在深度优先遍历的时候，每遍历到一个节点就把该节点和新的的树进行对比。如果有差异的话就记录到一个对象里面。
```
![](../assets/img-react/diff深度遍历.png)
```js
// diff函数,对比两棵树
function diff(oldTree,newTree){
    let index = 0;  // 当前节点的标志
    let patches = {};   //记录每个节点的差异对象
    dfsWalk(oldTree, newTree, index, patches);
    return patches;
}

// 对两棵树进行深度优先遍历
function dfsWalk(oldNode,newNode,index,patches){
    // 对比oldNode和newNode的不同,记录下来
    patches[index] = [...]
    diffChildren(oldNode.children, newNode.children, index, patches)
}

// 遍历子节点
function diffChildren(oldChildren, newChildren, index, patches){
    let leftNode = null;
    let currentNodeIndex = index;
    oldChildren.forEach(function(child,i){
        let newChild = newChildren[i];
        currentNodeIndex = (leftNode && leftNode.count) // 计算节点的标识
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1
        dfsWalk(child, newChild, currentNodeIndex, patches) // 深度遍历子节点
        leftNode = child
    });
}
```

例如，上面的div和新的div有差异，当前的标记是0，那么：
```js
patches[0] = [{difference}, {difference}, ...] // 用数组存储新旧节点的不同
// 同理p是patches[1]，ul是patches[3]，类推。
```

### 2.只考虑相同等级diff，可以分为下面4中情况：
```
1. 替换掉原来的节点，例如把上面的div换成了section
2. 修改了节点的属性
3. 移动、删除、新增子节点，例如上面div的子节点，把p和ul顺序互换
4. 对于文本节点，文本内容可能会改变。例如修改上面的文本节点2内容为Virtual DOM 2。
```

1. 第一种。如果节点类型变了，比如下面的p标签变成了h3标签，则直接卸载旧节点装载新节点，这个过程称为REPLACE。
```
renderA: <ul>
renderB: <ul class: 'marginLeft10'>
=> [addAttribute class "marginLeft10"]
```

2. 第二种情况。节点类型一样，仅仅是属性变化了，这一过程叫PROPS。比如

这一过程只会执行节点的更新操作，不会触发节点的卸载和装载操作。
```
renderA: <ul>
renderB: <ul class: 'marginLeft10'>
=> [addAttribute class "marginLeft10"]
```
3. 第三种。节点发生了移动，增加，或者删除操作。该过程称为REOREDR。虚拟DOM Diff算法解析
4. 第四种。只是文本变化了，TEXT过程。该过程只会替换文本。
5. 如果在一些节点中间插入一个F节点，简单粗暴的做法是：卸载C，装载F，卸载D，装载C，卸载E，装载D，装载E。如下图：
这种方法显然是不高效的。 而如果给每个节点唯一的标识(key)，那么就能找到正确的位置去插入新的节点。


### 3.差异类型
假设定义如下：
```js
var REPLACE = 0
var REORDER = 1
var PROPS = 2
var TEXT = 3
```

对于节点替换，很简单。判断新旧节点的tagName和是不是一样的，如果不一样的说明需要替换掉。如div换成section，就记录下：
```js
patches[0] = [{
  type: REPALCE,
  node: newNode // el('section', props, children)
}]
```

如果给div新增了属性id为container，就记录下：
```js
patches[0] = [{
  type: REPALCE,
  node: newNode // el('section', props, children)
}, {
  type: PROPS,
  props: {
    id: "container"
  }
}]
```

如果是文本节点，如上面的文本节点2，就记录下：
```js
patches[2] = [{
  type: TEXT,
  content: "Virtual DOM2"
}]
```

那如果把我div的子节点重新排序呢？例如p, ul, div的顺序换成了div, p, ul。这个该怎么对比？
```
如果按照同层级进行顺序对比的话，它们都会被替换掉。如p和div的tagName不同，p会被div所替代。

最终，三个节点都会被替换，这样DOM开销就非常大。

而实际上是不需要替换节点，而只需要经过节点移动就可以达到，我们只需知道怎么进行移动。
```

## 最后把差异应用到真正的DOM树上
因为步骤一所构建的 JavaScript 对象树和render出来真正的DOM树的信息、结构是一样的。

所以我们可以对那棵DOM树也进行深度优先的遍历，遍历的时候从步骤二生成的patches对象中找出当前遍历的节点差异，然后进行 DOM 操作
```js
function patch (node, patches) {
  var walker = {index: 0}
  dfsWalk(node, walker, patches)
}

function dfsWalk (node, walker, patches) {
  var currentPatches = patches[walker.index] // 从patches拿出当前节点的差异

  var len = node.childNodes
    ? node.childNodes.length
    : 0
  for (var i = 0; i < len; i++) { // 深度遍历子节点
    var child = node.childNodes[i]
    walker.index++
    dfsWalk(child, walker, patches)
  }

  if (currentPatches) {
    applyPatches(node, currentPatches) // 对当前节点进行DOM操作
  }
}
```
applyPatches，根据不同类型的差异对当前节点进行 DOM 操作：
```js
function applyPatches (node, currentPatches) {
  currentPatches.forEach(function (currentPatch) {
    switch (currentPatch.type) {
      case REPLACE:
        node.parentNode.replaceChild(currentPatch.node.render(), node)
        break
      case REORDER:
        reorderChildren(node, currentPatch.moves)
        break
      case PROPS:
        setProps(node, currentPatch.props)
        break
      case TEXT:
        node.textContent = currentPatch.content
        break
      default:
        throw new Error('Unknown patch type ' + currentPatch.type)
    }
  })
}
```

## Diff的入口函数为 reconcileChildren
ChildReconciler内部定义了许多协调相关的函数，并将reconcileChildFibers作为函数的返回值。

内部会通过current === null 区分当前fiber节点是mount还是update:
```
mount-->mountChildFibers
update-->reconcileChildFibers
```

```js
/*
* shouldTrackSideEffects为true时会为生成的fiber节点收集effectTag属性，反之不会进行收集effectTag属性。
* */
export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);

function ChildReconciler(shouldTrackSideEffects) {
    //...

    function reconcileChildrenArray(
        returnFiber: Fiber,
        currentFirstChild: Fiber | null,
        newChildren: Array<*>,
        lanes: Lanes,
    ): Fiber | null {
        //...
    }

    function reconcileChildrenIterator(
        returnFiber: Fiber,
        currentFirstChild: Fiber | null,
        newChildrenIterable: Iterable<*>,
        lanes: Lanes,
    ): Fiber | null {
        //...
    }

    function reconcileSingleTextNode(
        returnFiber: Fiber,
        currentFirstChild: Fiber | null,
        textContent: string,
        lanes: Lanes,
    ): Fiber {
        //...
    }

    function reconcileSingleElement(
        returnFiber: Fiber,
        currentFirstChild: Fiber | null,
        element: ReactElement,
        lanes: Lanes,
    ): Fiber {
        //...
    }

    function reconcileSinglePortal(
        returnFiber: Fiber,
        currentFirstChild: Fiber | null,
        portal: ReactPortal,
        lanes: Lanes,
    ): Fiber {
        //...
    }

    // This API will tag the children with the side-effect of the reconciliation
    // itself. They will be added to the side-effect list as we pass through the
    // children and the parent.
    function reconcileChildFibers(
        returnFiber: Fiber,
        currentFirstChild: Fiber | null,
        newChild: any,
        lanes: Lanes,
    ): Fiber | null {
        //...
    }

    return reconcileChildFibers;
}
```

## reconcileChildFibers是React Diff真正的入口函数
reconcileChildFibers内部会根据newChild（即新生成的ReactElement）的类型和$$typeof属性调用不同的处理函数。

据newChild中节点的数量把Diff分为两种类型：
```
1. 当newChild只有一个节点，也即newChild类型为object、number、string时，我们会进入单节点的Diff
2. 当newChild有多个节点，也即类型为Array时，进入多节点的Diff
```
```js
// 根据newChild进入不同Diff函数处理
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
): Fiber | null {
  //...

  if (typeof newChild === 'object' && newChild !== null) {
    // object类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        // 调用 reconcileSingleElement 处理
      // ...
    }
  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // 调用 reconcileSingleTextNode 处理
    // ...
  }

  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    // ...
  }

  if (getIteratorFn(newChild)) {
    // 调用 reconcileChildrenIterator处理
    // ... 
  }

  // ...

  // 如果以上分支都没有命中，则删除节点
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

## 三.单节点的Diff
根据newChild（即新生成的ReactElement）为单一节点，但此节点在current fiber tree中对应的层级具有多少个节点我们是不确定的，
因此我们可以根据此节点在current fiber tree中对应的层级的节点数量分为三种场景：
1. 对应层级存在单个旧节点
```
旧： A
新： A'
```
2. 对应层级存在多个旧节点
```
旧： A -> B -> C
新： A'
```
3. 对应层级无旧节点
```
旧： null
新： A'
```
场景1和场景2我们可以归为一类（即在当前层级中，current fiber在sibling方向的链表中至少存在一个节点），
场景3单独为一类（当前层级无current fiber节点）。

### 3-1.当前层级的current fiber在sibling方向的链表不为空
此时我们需要循环遍历当前层级在sibling方向的链表的所有current fiber节点，判断是否可以复用（key相同且type相同）.

当前层级的current fiber节点的stateNode（即复用fiber节点对应的DOM节点）,可以则以current fiber作为副本生成
workInProgress fiber。当前层级所有的current fiber节点都无法复用时，直接生成一个新的fiber节点作为workInProgress fiber。

### 3-2.当前层级的current fiber在sibling方向的链表为空
由于不存在对应的current fiber节点，所以直接生成一个新的fiber节点作为workInProgress fiber。

### 3-2.reconcileSingleElement的具体实现
```js
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement,
  lanes: Lanes,
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  
  //循环遍历当前这一层级的current fiber节点
  while (child !== null) {
    if (child.key === key) {
      //  key相同, 判断当前 current fiber.elementType 是否等于 ReactElement.type
      switch (child.tag) {
        //...
        default: {
          if (child.elementType === element.type) {
            //  type相同,表示可以复用当前fiber节点, 由于是单节点，所以如果当前节点存在兄弟节点, 需要给兄弟节点打上Deletion effectTag（删除兄弟节点）
            deleteRemainingChildren(returnFiber, child.sibling);
            // 构造workInProgress fiber节点,构造过程中会复用当前fiber节点的stateNode, 即复用DOM对象
            const existing = useFiber(child, element.props);
            existing.ref = coerceRef(returnFiber, child, element);
            existing.return = returnFiber;
            return existing;
          }
          break;
        }
      }
      // key相同但type不相同，则找到了当前节点在上次更新时对应的节点，但两个节点的type已经不一致，并且后续节点也没有可能进行复用，所以删除当前current fiber节点以及节点的剩余兄弟节点
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      // key不一致则给当前current fiber节点打上Deletion effectTag，删除当前节点，并继续往下一个兄弟节点遍历，尝试匹配
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }

  //DOM节点不可复用 新建fiber作为ReactElement对应的WorkInProgress Fiber
  const created = createFiberFromElement(element, returnFiber.mode, lanes);
  created.ref = coerceRef(returnFiber, currentFirstChild, element);
  created.return = returnFiber;
  return created;
}
```
注意，在为current fiber节点不匹配并打上Deletion effectTag时, 会同时将其添加到父节点的effectList中
(正常effectList的收集是在completeWork中进行的, 但是被删除的节点会脱离fiber树, 
无法进入completeWork的流程, 所以在beginWork阶段提前加入父节点的effectList)；

## 四.多节点的Diff
当newChild为多节点时，以下的几种场景中会触发多节点的Diff。
1. 节点更新
```
//节点属性发生变更；
//旧
<div key="a">a</div>
<div key="b">b</div>
<div key="c">c</div>

//新
<div key="a" className="a">a</div>
<div key="b">b</div>
<div key="c">c</div>

//节点的类型发生变更；
//旧
<div key="a">a</div>
<div key="b">b</div>
<div key="c">c</div>

//新
<span key="a">a</div>
<div key="b">b</div>
<div key="c">c</div>
```
2. 节点的数量发生改变；
```
//节点属性发生变更；
//旧
<div key="a">a</div>
<div key="b">b</div>
<div key="c">c</div>

//新
<div key="a" className="a">a</div>
<div key="b">b</div>
<div key="c">c</div>

//节点的类型发生变更；
//旧
<div key="a">a</div>
<div key="b">b</div>
<div key="c">c</div>

//新
<span key="a">a</div>
<div key="b">b</div>
<div key="c">c</div>
```
3. 节点的位置发生改变；
```
//旧
<div key="a">a</div>
<div key="b">b</div>
<div key="c">c</div>
<div key="e">e</div>

//新
<div key="a">a</div>
<div key="c">c</div>
<div key="b">b</div>
<div key="e">e</div>
```
在reconcileChildFibers的分析中可以看到，React使用两个函数reconcileChildrenArray(针对数组类型)和
reconcileChildrenIterator(针对可迭代类型)来进行多节点的diff，我们重点看看reconcileChildrenArray。
```js
/*
* 其中参数currentFirstChild指的是current fiber tree在该层级中的第一个fiber，通过 fiber.sibling
* 可以得到一条从左到右串联currentFirstChild在当前层级的所有fiber节点的链表，我们使用oldFiber来表示这条链表。
* 
* 参数newChildren是一个数组，包含了当前层级的所有ReactElement对象。
* */
function reconcileChildrenArray(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChildren: Array<*>,
  lanes: Lanes,
): Fiber | null {
  //...
}
```
reconcileChildrenArray会对比这两个序列之间的差异，并生成workInProgress fiber tree在当前层级的fiber节点链表，
并使用resultingFirstChild作为头节点。对比的过程会经历两轮的遍历。
### 4-1.第一轮遍历
1. 遍历比较newChildren与oldFiber，判断DOM节点是否可复用。
2. 如果可复用，则复用oldFiber生成newFiber并加入到以resultingFirstChild
   作为头节点的序列（后续我们使用newFiberList表示此序列）中，两个序列都跳到下一个节点。
3. 如果不可复用，分两种情况进行处理：
   - 若key不一致，则立即终止第一轮遍历。
   - 若key相同但type不同，则删除当前oldFiber节点，生成新的fiber节点加入到newFiberList中，两个序列都跳到下一个节点，继续遍历。
4. 当两个序列中的任意一个序列完成遍历（即newIdx >= newChildren.length - 1 || oldFiber.sibling === null），则结束第一轮遍历。

### 4-2.第二轮遍历
第一轮遍历后，会产生四种结果。
1. oldFiber与newChildren都完成遍历了
```
此时本轮diff已经完成了。这种情况是最理想的情况，只需要进行第一轮遍历中对应的更新操作。
```
2. oldFiber遍历完了，但newChildren还没遍历完。
3. newChildren遍历完了，但oldFiber还没遍历完
4. newChildren与oldFiber都没完成遍历

### 4-2-1.oldFiber遍历完了，但newChildren还没遍历完
假设newFiberList中所有节点都可以是可以直接复用的，那么当前场景和我们之前讨论过的新增节点的场景是一致的。
```
//新增节点
//旧
<div key="a">a</div>
<div key="b">b</div>
<div key="c">c</div>

//新
<div key="a">a</div>
<div key="b">b</div>
<div key="c">c</div>
<div key="d">d</div>
<div key="e">e</div>
```
这意味着未遍历完的newChildren节点都是新增的，我们需要遍历剩下的newChildren，生成对应的workInProgress fiber并标记上Placement。
```
此处只是假设第一轮遍历中所有加入到newFiberList的节点都是可以复用的，便于大家理解，但前面我们有分析过，在第一轮遍历中能够加入到
newFiberList的节点有两种：
1. 可以直接复用的节点；
2. key相同但type不同的节点；
```
### 4-2-2 newChildren遍历完了，但oldFiber还没遍历完
我们再次假设加入到newFiberList中所有节点都可以是可以直接复用的，这次就和我们之前讨论过的删除节点的场景是一致的了
```
//旧
<div key="a">a</div>
<div key="b">b</div>
<div key="c">c</div>

//新
<div key="a">a</div>
```
此时newChildren节点都已经找到了可复用的节点，我们需要遍历剩下的oldFiber，并标记上Deletion。

### 4-2-2 newChildren与oldFiber都没完成遍历
这意味着这次更新中有可能存在节点改变了位置。我们以前面提到的位置移动的例子来进行分析。
```
//旧
<div key="a">a</div>
<div key="b">b</div>
<div key="c">c</div>
<div key="e">e</div>

//新
<div key="a">a</div>
<div key="c">c</div>
<div key="b">b</div>
<div key="e">e</div>
```
经过第一轮遍历后，key值为a的节点复用oldFiber节点生成newFiber节点，并加入到了newFiberList中。在进行第二个节点的比较时，
新节点c和旧节点b的key值不一致，此时我们会终止第一轮遍历，进入第二轮遍历。
由于可能存在移动的节点，所以节点的索引值不能够找出两个对应的节点，我们需要一个找到新旧节点对的方法。这时，节点的key值就起作用了。
我们前面提到：
> 开发者可以通过设置 key 属性，来告知渲染哪些子元素在不同的渲染下可以保存不变；

React会将还未处理的oldFiber节点存入以节点key为key，oldFiber为value的Map中。
```
//existingChildren 是一个以节点key为key，oldFiber为value的Map
const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
```
然后继续遍历newChildren序列，并通过newChildren节点的key来查询existingChildren中是否存在key相同的oldFiber节点。

接下来我们需要通过第二轮遍历去标记哪些节点可以复用，哪些节点需要移动。此时我们需要一个参照索引来判断节点是否需要移动。

我们以newFiberList中最靠右的节点对应的oldFiber在oldFiber链表中的位置索引oldIndex作为参照索引，并使用lastPlacedIndex表示参照索引。

上面分析的例子中，在结束第一轮遍历后，lastPlacedIndex就是newFiberList的最右一个节点a的oldIndex，也就是0。

### 然后开始第二轮的遍历
- newChildren节点c

newChildren节点c通过existingChildren查询到了oldFiber节点c，发现oldFiber节点c的索引oldIndex为 2 ，大于lastPlacedIndex=0。

由lastPlacedIndex的定义可知，若当前的oldIndex大于lastPlacedIndex，意味着oldFiber节点c的位置是在newFiberList的最右一个节点对应的
oldFiber节点的右边。同时，由于newChildren序列是按顺序遍历的，所以当前的newChildren生成的newFiber节点一定是在newFiberList的最右一个节点对应的newFiber节点的右边。因此，节点c更新前后的位置没有发生。

此时，因为节点c的oldIndex > lastPlacedIndex，所以我们把lastPlacedIndex的值更新为节点c的oldIndex=2。同时把节点c生成的newFiber加入到newFiberList中，继续遍历。

- newChildren节点b
  newChildren节点b通过existingChildren查询到了oldFiber节点b，发现oldFiber节点b的索引oldIndex为 1，小于lastPlacedIndex=2。oldFiber节点b的位置是在newFiberList的最右一个节点对应的oldFiber节点的左边。但newChildren节点b生成的newFiber节点一定是在newFiberList的最右一个节点对应的newFiber节点的右边的。因此，节点b更新前后的位置会发生变化。
  此时，因为节点b的oldIndex < lastPlacedIndex，所以lastPlacedIndex不变，并把节点b生成的newFiber标记Placement，表示该节点更新前后的位置会发生变化，最后把newFiber加入到newFiberList中，继续遍历。

- newChildren节点d
  newChildren节点d通过existingChildren查询到了oldFiber节点d，发现oldFiber节点d的索引oldIndex为 3 ，大于lastPlacedIndex=3。 处理逻辑与节点c一致，不再展开。

### diff完成，我们也得到了该层级中完整的newFiberList，作为workInProgress fiber tree在该层级的fiber节点。

## reconcileChildrenArray的具体实现
```js
  /* * returnFiber：当前层级的节点的父节点，即currentFirstChild的父级fiber节点
     * currentFirstChild：当前层级的第一个current fiber节点
     * newChildren：当前层级的ReactElement节点
     * lanes：优先级相关
  * */
  function reconcileChildrenArray(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChildren: Array<*>,
    lanes: Lanes,
  ): Fiber | null {
    //..

    // workInProgress fiber tree在此层级的第一个fiber节点，即该层级上在fiber.sibling方向的链表的头节点，在上面的分析中我们使用newFiberList来表示此序列
    let resultingFirstChild: Fiber | null = null;
    // previousNewFiber用来将后续的新生成的workInProgress fiber连接到newFiberList中
    let previousNewFiber: Fiber | null = null;

    // oldFiber节点，用于访问workInProgress fiber tree在此层级上在fiber.sibling方向的链表
    let oldFiber = currentFirstChild;
    // 用于存储newFiberList中最右边的节点在oldFiber链表中的index
    let lastPlacedIndex = 0;
    // 存储遍历到newChildren的索引
    let newIdx = 0;
    // 存储当前oldFiber的下一个节点
    let nextOldFiber = null;

    // 第一轮遍历
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }

       // 尝试生成新的节点，如果key不同, 返回null，key相同, 再比较type是否一致。type一致则执行useFiber(update逻辑)，type不一致则运行createXXX(insert逻辑)
      const newFiber = updateSlot(
        returnFiber,
        oldFiber,
        newChildren[newIdx],
        lanes,
      );
      if (newFiber === null) {
      // newFiber为 null说明节点不可复用，中断当前遍历
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }
        break;
      }
      if (shouldTrackSideEffects) {
      // shouldTrackSideEffects 为true 代表当前为update阶段
        if (oldFiber && newFiber.alternate === null) {
          // 此时为key相同但type不同，newFiber.alternate为空，删除掉oldFiber
          deleteChild(returnFiber, oldFiber);
        }
      }
      
      //更新记录lastPlacedIndex
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

      //将newFiber添加到newFiberList中
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (newIdx === newChildren.length) {
      // newChildren遍历完了，删除oldFiber链中未遍历的节点
      deleteRemainingChildren(returnFiber, oldFiber);
     
      //...
      //结束此次diff
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // oldFiber遍历完了，新增newChildren未遍历的节点到newFiberList中
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
        if (newFiber === null) {
          continue;
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
      //...
      //结束本次diff
      return resultingFirstChild;
    }

    // newChildren和oldFiber都没有遍历完，将oldFiber剩余序列加入到一个map中，在第二次遍历的过程中能够通过key值找到对应的oldFiber
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);

    // 第二轮遍历
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        newChildren[newIdx],
        lanes,
      );
      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          if (newFiber.alternate !== null) {
            // 如果newFiber是通过复用创建的, 则清理map中对应的老节点
            existingChildren.delete(
              newFiber.key === null ? newIdx : newFiber.key,
            );
          }
        }
        // 判断当前节点是否需要改变位置，并更新记录lastPlacedIndex
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        // 添加newFiber到newFiberList中
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
    }

    if (shouldTrackSideEffects) {
      //删除未遍历的oldFiber
      existingChildren.forEach(child => deleteChild(returnFiber, child));
    }

    
    //...

    //结束本次diff
    return resultingFirstChild;
  }

  //此函数用于记录节点在此次更新中是否需要移动，并返回新的lastPlacedIndex 
  function placeChild(
    newFiber: Fiber,
    lastPlacedIndex: number,
    newIndex: number,
  ): number {
    newFiber.index = newIndex;
    
    //...

    const current = newFiber.alternate;
    if (current !== null) {
      const oldIndex = current.index;
      if (oldIndex < lastPlacedIndex) {
        // 此节点需要移动
        newFiber.flags |= Placement;
        return lastPlacedIndex;
      } else {
        // 此节点不需要移动，返回oldIndex作为lastPlacedIndex的值
        return oldIndex;
      }
    } else {
      // 这是插入的逻辑
      newFiber.flags |= Placement;
      return lastPlacedIndex;
    }
  }
```
