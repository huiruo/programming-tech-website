---
title: patch-diff
sidebar_position: -2
---

## 为什么 Vue 不需要时间分片？
1. Vue 通过响应式依赖跟踪，在默认的情况下可以做到只进行组件树级别的更新计算，而默认下 React 是做不到

2. 时间分片是为了解决 CPU 进行大量计算的问题,vue没有？

## patch()主要对新旧节点的对比
diff算法从patch开始。结合render函数来看，旧的虚拟DOM存储在container._vnode上

### 新旧节点相同，直接返回
```
如果新旧虚拟节点相同 (n1 === n2)，则直接返回，不做 Diff 比较。
```

### 旧节点存在，且新旧节点类型不同，则旧节点不可复用，将其卸载(unmount)，锚点anchor移向下一个节点；
如果新旧虚拟节点不相同，则直接卸载旧的虚拟节点及其子节点。同时将旧虚拟节点n1 置为 null，这样就保证了新节点可以正常挂载。

1. 判断新虚拟节点的 patchFlag 类型是否为 PatchFlags.BAIL，则将 optimized 置为 false，那么在后续的 Diff 过程中就不会启用 diff 优化。同时也将新虚拟节点的动态子节点数组 dynamicChildren 置为 null，在后续 Diff 过程中也不会启用 diff 优化。

2. 然后根据新虚拟节点的 type 类型，分别对文本节点、注释节点、静态节点以及Fragment节点调用相应的处理函数对其进行处理。
```
新节点是否静态节点标记；

根据新节点的类型，相应地调用不同类型的处理方法：
* 文本：processText；
* 注释：processCommentNode；
* 静态节点：mountStaticNode或patchStaticNode；
* 文档片段：processFragment；
* 其它。
```

3. 接着根据 shapeFlag 的类型，调用不同的处理函数，分别对 Element类型的节点、Component 组件、Teleport 组件、Suspense 异步组件进行处理。

最后，调用了 setRef 函数来设置 ref 引用。

```js
const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = isHmrUpdating ? false : !!n2.dynamicChildren) => {

  // container, DOM容器，vNode渲染成dom会挂载到该节点下
  // 新旧节点是同一个对象，直接返回
  if (n1 === n2) {
    console.log(`%c运行时==>patch：新旧节点是同一个对象，直接返回:`, 'color:red')
    return;
  }
  // patching & not same type, unmount old tree
  // 不是相同类型的节点，直接卸载旧节点
  if (n1 && !isSameVNodeType(n1, n2)) {
    anchor = getNextHostNode(n1);
    unmount(n1, parentComponent, parentSuspense, true);
    n1 = null;
  }

  // 被打过BAIL类型标记的节点退出优化模式。
  // 比如非编译器生成，而是手动编写的渲染函数，认为总是新的，无法进行优化
  if (n2.patchFlag === -2 /* PatchFlags.BAIL */) {
    optimized = false;
    n2.dynamicChildren = null;
  }

  const { type, ref, shapeFlag } = n2;

  console.log(`%c运行时==>patch开启,n1旧节点、n2新节点:`, 'color:yellow', { type, n1, n2 })
  // 根据vNode类型，执行不同的算法
  switch (type) {
    case Text:
      console.log(`%c运行时==>patch处理文本节点:`, 'color:red')
      processText(n1, n2, container, anchor);
      break;
    case Comment:
      console.log(`%c运行时==>patch处理注释节点:`, 'color:red')
      processCommentNode(n1, n2, container, anchor);
      break;
    case Static:
      console.log(`%c运行时==>patch处理静态节点:`, 'color:red')
      if (n1 == null) {
        mountStaticNode(n2, container, anchor, isSVG);
      }
      else {
        patchStaticNode(n1, n2, container, isSVG);
      }
      break;
    case Fragment:
      console.log(`%c运行时==>patch处理Fragment元素:`, 'color:red')
      processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      break;
    default:
      if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        console.log(`%c运行时==>patch-->较为重点的1:ELEMENT类型:调用processElement处理DOM元素:`, 'color:red')
        processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
      else if (shapeFlag & 6 /* ShapeFlags.COMPONENT */) {
        console.log(`%c运行时==>patch-->较为重点的2:COMPONENT:调用processComponent处理组件元素:`, 'color:red')
        processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
      else if (shapeFlag & 64 /* ShapeFlags.TELEPORT */) {
        console.log(`%c运行时==>patch处理TELEPORT:`, 'color:red')
        type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
      }
      else if (shapeFlag & 128 /* ShapeFlags.SUSPENSE */) {
        console.log(`%c运行时==>patch处理SUSPENSE:`, 'color:red')
        type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
      }
      else {
        warn$1('Invalid VNode type:', type, `(${typeof type})`);
      }
  }
  // set ref
  if (ref != null && parentComponent) {
    setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
  }
};
```

## processElement-patchElement更新dom元素
```js
const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
  isSVG = isSVG || n2.type === 'svg';
  if (n1 == null) {
    console.log('%c=patch之processElement1:挂载dom元素的过程，调用mountElement', 'color:magenta')
    mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
  }
  else {
    console.log('%c=patch之processElement2:更新dom元素的过程，调用patchElement', 'color:magenta')
    patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
  }
};
```

patchElement相当重要，当新旧元素节点都存在时，就会调用patchElement进行对比。可以看到顺序：

在patchElement中，注意到当新节点具有动态子节点时，调用了patchBlockChildren来进行子节点的比较，而在没有动态子节点且不符合优化条件时，则使用patchChildren来比较。这与processFragment类似。
而当patchFlag <= 0且没有设置优化时，对props进行全量diff。分别遍历新的props和旧的props，最后刷新value的值。
```js
const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
  const el = (n2.el = n1.el);
  let { patchFlag, dynamicChildren, dirs } = n2;
  // #1426 take the old vnode's patch flag into account since user may clone a
  // compiler-generated vnode, which de-opts to FULL_PROPS
  patchFlag |= n1.patchFlag & 16 /* PatchFlags.FULL_PROPS */;
  const oldProps = n1.props || EMPTY_OBJ;
  const newProps = n2.props || EMPTY_OBJ;
  let vnodeHook;
  // 关闭recurse，在 beforeUpdated 阶段不允许自己调用
  // disable recurse in beforeUpdate hooks
  parentComponent && toggleRecurse(parentComponent, false);
  if ((vnodeHook = newProps.onVnodeBeforeUpdate)) {
    invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
  }
  // 指令的 beforeUpdated 钩子
  if (dirs) {
    invokeDirectiveHook(n2, n1, parentComponent, 'beforeUpdate');
  }
  // 允许自己调用
  parentComponent && toggleRecurse(parentComponent, true);
  if (isHmrUpdating) {
    // HMR updated, force full diff
    patchFlag = 0;
    optimized = false;
    dynamicChildren = null;
  }
  const areChildrenSVG = isSVG && n2.type !== 'foreignObject';
  if (dynamicChildren) {
    console.log('%c=patchElement=新节点的动态子节点不为空，则比较新旧节点的动态子节点,调用patchBlockChildren')
    patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    if (parentComponent && parentComponent.type.__hmrId) {
      traverseStaticChildren(n1, n2);
    }
  }
  else if (!optimized) {
    console.log('%c=patchElement=调用patchChildren,没有优化，全量 diff')
    // full diff
    patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
  }

  // 注释：patchFlag 标识的存在意味着元素的 render 代码是由 compiler 生成的，
  // 且可以在 patch 时走快道，此时能保证新旧节点形状相同，即它们在源模板中正好处于相同的位置
  // 此时的对比是有着各种优化的
  if (patchFlag > 0) {
    // the presence of a patchFlag means this element's render code was
    // generated by the compiler and can take the fast path.
    // in this path old node and new node are guaranteed to have the same shape
    // (i.e. at the exact same position in the source template)
    if (patchFlag & 16 /* PatchFlags.FULL_PROPS */) {
      console.log('%c=patchElement=调用patchProps,当props中含有动态的key，需要进行全量 diff')
      // element props contain dynamic keys, full diff needed
      patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    else {
      // class
      // this flag is matched when the element has dynamic class bindings.
      if (patchFlag & 2 /* PatchFlags.CLASS */) {
        if (oldProps.class !== newProps.class) {
          console.log('%c=patchElement=调用hostPatchProp,处理动态类名绑定')
          hostPatchProp(el, 'class', null, newProps.class, isSVG);
        }
      }
      // style
      // this flag is matched when the element has dynamic style bindings
      if (patchFlag & 4 /* PatchFlags.STYLE */) {
        console.log('%c=patchElement=调用hostPatchProp,处理动态的 style 绑定')
        hostPatchProp(el, 'style', oldProps.style, newProps.style, isSVG);
      }
      // props
      // This flag is matched when the element has dynamic prop/attr bindings
      // other than class and style. The keys of dynamic prop/attrs are saved for
      // faster iteration.
      // Note dynamic keys like :[foo]="bar" will cause this optimization to
      // bail out and go through a full diff because we need to unset the old key
      if (patchFlag & 8 /* PatchFlags.PROPS */) {
        // if the flag is present then dynamicProps must be non-null
        // 处理动态的 prop/attr 绑定，有迭代缓存，优化比较速度
        // 如果 `prop/attr`的 key 是动态的，那么这种优化则会失效
        console.log('%c=patchElement=调用hostPatchProp,理动态的 prop/attr 绑定，有迭代缓存，优化比较速度')
        const propsToUpdate = n2.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          const key = propsToUpdate[i];
          const prev = oldProps[key];
          const next = newProps[key];
          // #1471 force patch value
          if (next !== prev || key === 'value') {
            hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
    }
    // text
    // This flag is matched when the element has only dynamic text children.
    if (patchFlag & 1 /* PatchFlags.TEXT */) {
      if (n1.children !== n2.children) {
        hostSetElementText(el, n2.children);
      }
    }
  }
  else if (!optimized && dynamicChildren == null) {
    console.log('%c=patchElement=调用patchProps,没有优化，全量 diff')
    // unoptimized, full diff
    patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
  }
  if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
    console.log('%c=patchElement=updated 钩子 入队')
    queuePostRenderEffect(() => {
      vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      dirs && invokeDirectiveHook(n2, n1, parentComponent, 'updated');
    }, parentSuspense);
  }
};
```

## patchElement-->patchBlockChildren
在文档片段中的diff中，当符合优化条件时，则调用patchBlockChildren来进行优化的diff。这里主要以新节点的子节点长度为准，遍历新旧节点的子节点，更新了每个子节点的container然后进行patch。
```js
const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
  console.log('%c=patchBlockChildren=开始循环')
  for (let i = 0; i < newChildren.length; i++) {
    const oldVNode = oldChildren[i];
    const newVNode = newChildren[i];
    // Determine the container (parent element) for the patch.
    const container =
      // oldVNode may be an errored async setup() component inside Suspense
      // which will not have a mounted element
      oldVNode.el &&
        // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment ||
          // - In the case of different nodes, there is going to be a replacement
          // which also requires the correct parent container
          !isSameVNodeType(oldVNode, newVNode) ||
          // - In the case of a component, it could contain anything.
          oldVNode.shapeFlag & (6 /* ShapeFlags.COMPONENT */ | 64 /* ShapeFlags.TELEPORT */))
        ? hostParentNode(oldVNode.el)
        : // In other cases, the parent container is not actually used so we
        // just pass the block element here to avoid a DOM parentNode call.
        fallbackContainer;

    console.log('%c=patchBlockChildren=循环中调用patch')
    patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
  }
};
```

## patchBlockChildren再次进入patch:以更新文本节点为例:-->processText(n1, n2)
```js
const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = isHmrUpdating ? false : !!n2.dynamicChildren) => {
  // 省略...
  const { type, ref, shapeFlag } = n2;

  console.log(`%c运行时==>patch开启,n1旧节点、n2新节点:`, 'color:yellow', { type, n1, n2 })
  // 根据vNode类型，执行不同的算法
  switch (type) {
    case Text:
      console.log(`%c运行时==>patch处理文本节点:`, 'color:red')
      processText(n1, n2, container, anchor);
      break;
    case Comment:
  }
  // 省略..
}
```

此时你把 debugger 打在 hostSetText(el, n2.children),一步一步调试，可以看到
setText: (node, text) 页面就更新了
```js
const processText = (n1, n2, container, anchor) => {
  if (n1 == null) {
    console.log('=processText=1,创建文本节点')
    hostInsert((n2.el = hostCreateText(n2.children)), container, anchor);
  }
  else {
    const el = (n2.el = n1.el);
    console.log('=processText=2,', { el })
    if (n2.children !== n1.children) {
      console.log(`=processText=3,n2.children !== n1.children，调用hostSetText`, el, n2.children)
      debugger
      hostSetText(el, n2.children);
    }
  }
};
```

hostSetText就是setText
```js
const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;

const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: child => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag, isSVG, is, props) => {
      const el = isSVG
        ? doc.createElementNS(svgNS, tag)
        : doc.createElement(tag, is ? { is } : undefined);
      if (tag === 'select' && props && props.multiple != null) {
        el.setAttribute('multiple', props.multiple);
      }
      return el;
    },
    createText: text => doc.createTextNode(text),
    createComment: text => doc.createComment(text),
    setText: (node, text) => {
      node.nodeValue = text;
    },
    // 省略
}
```

## Patch算法之PatchKeyChildren
patchKeyedChildren是patch算法中较为复杂的一段，首先patchKeyedChildren是在子列表对比并且有key的情况会进入，并且逻辑大致分为5步
### 第一步,从前向后遍历
这一步是从节点组头部向尾部遍历，如果遍历过程中遇到相似节点，就进行patch对比，否则就退出遍历，并记录当前遍历的最新下标


### 第二步，从后向前遍历
从后向前遍历，如果遇到第一步记录的下标就停止，然后遍历过程中，如果遇到相似节点也是直接进行patch对比，如果不相同就是直接退出遍历，并且记录旧节点组和新节点组的尾指针

### 第三步，检查旧节点组
这一步就是检查旧节点组在上两步的遍历后是否遍历完，如果遍历完，那么新节点组没有遍历完的就都是新的dom，可以全部当作新增节点进行挂载处理

### 第四步，检查新节点组
如果上一步检查旧节点未遍历完，那么就检查新节点组是否遍历完，如果遍历完，那么旧的节点组剩余的节点说明都是要卸载的，因为都不需要了

### 第五步，未知序列

-   如果新旧节点组都未遍历完，说明存在未知序列，可能存在位移等情况，就需要进一步处理
-   首先创建一个数组，用于记录新旧节点的对应关系
```js
// toBePatched是新序列的节点数量 e2 - s2 + 1
const newIndexToOldIndexMap = new Array(toBePatched)
for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
```
* 然后会遍历旧节点组，这里会用两个变量记录
let moved = false：位移标识，用于判断是否需要位移
let patched = 0：记录已执行patch的新节点数量，用于处理如果在更新时更新过的数量大于需要更新的节点数量，就卸载对应旧节点

## vue3 Diff以数组和数组比对为例子
### 第一轮，常见情况的比对:

首先从左往右进行比对，如果是相同的就进行更新比对，如果不相同则停止比对，并且记录停止的下标。

再从右往左进行比对，如果是相同的就进行更新比对，如果不相同也停止比对，也进行记录停止的下标。

通过这样左右进行比对，最后就可以把真正复杂部分进行范围锁定了。

左右比对完之后，如果新节点已经比对完了，老节点列表还存在节点未比对，则删除老节点列表上的未比对的节点，如果老节点已经比对完了，新节点列表还存在未比对的节点则进行创建。

### 第二轮，复杂情况的比对
如果新节点未比对完，老节点也未比对完，则进行最后最复杂的处理。

先把剩下的新节点处理成节点的 key 为 key, 节点下标为 value 的 Map；
接着初始化一个长度为剩下未比对的新节点的长度的数组 newIndexToOldIndexMap，初始化每个数组的下标的默认值为 0。

再循环剩下的旧节点，通过旧节点的 key 去刚刚创建的 Map 中查找，看看旧节点有没有在新节点中，如果旧节点没有 key 则需要通过循环剩下的新节点进行查找。
如果旧节点在新节点中没找到，则说明该旧节点需要进行删除。

如果找到了，则把找到的新节点的下标对应存储到上述的数组 newIndexToOldIndexMap 中，然后更新比对匹配到的新老节点。

把所有的旧节点比对完成后，就会得到一个刚刚收集的新节点的下标数组，然后对这个新节点的下标数组进行进行最长递增子序列查找得到一个最长递增子序列的下标数据。
然后再进行循环左右对比完之后剩余新节点的下标，然后判断循环的下标是否被上述的数组 newIndexToOldIndexMap 进行收集了，如果没被收集到则说明这个新节点需要进行创建，如果已经被收集了则判断该循环的下标是否在上面计算得到的最长递增子序列中，如果不在则需要对该循环节点进行移动操作。

以上就是 Vue3 Diff 算法大概过程了。
