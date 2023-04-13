---
title: 响应式原理与reactive
sidebar_position: 6
---

## proxy
参考：[proxy](./proxy)

## Reactivity的简单例子
参考：[Reactivity简单例子](./Reactivity简单例子)

## ReactiveEffect 响应式对象中的订阅者
主要分为两大步，设置响应式对象和依赖收集

ReactiveEffect 作用是Vue2 中的 Watcher.
为什么要收集依赖(副作用对象)，因为在Vue3中，一个响应式变量的变化，往往会触发一些副作用，比如视图更新、计算属性变化等等，需要在响应式变量变化时去触发其它一些副作用函数。

它的本质就是当一个被用户关注的数据发生变化时，触发一系列相对应的动作，在 Vue 中这个动作通常是更新页面，这些动作在源码中被描述为 effect，官方用中文称作副作用,effect是ReactiveEffect的实例

effect的作用是在trigger的时候来收集当前的fn，并且对外提供一个run函数

effect 接收一个函数fn(),会在加载的时候执行一次，后续每次依赖发生更新，则会重新执行

ReactiveEffect 作为 vue3 响应式对象中的订阅者，他可以订阅响应式对象的变化并做出对应的变化
ReactiveEffect 对象会在这几种场景下创建：

1. computed（接受一个 getter 函数，返回一个只读的响应式 ref 对象，即 getter 函数的返回值。它也可以接受一个带有 get 和 set 函数的对象来创建一个可写的 ref 对象。）
2. watch （侦听一个或多个响应式数据源，并在数据源变化时调用所给的回调函数）
3. watchEffect （立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。）
4. render （页面渲染）

依赖收集收集的是fn, 那么在执行run的时候是不是可以来进行收集呢？所以定义一个全局变量activeEffect，来保存，方便后续进行收集。


在构造器中初始化fn (执行run()的过程中调用) 、调度器scheduler，并通过recordEffectScope来记录实例的作用域；声明一些实例属性，以及run、stop两个方法：

* active：boolean类型，表示当前的effect是否起作用；
* deps：当前effect的依赖；
* parent：指向上一个活跃的effect，形成链表；
* computed：可选，在computed函数得到的ComputedRefImpl里的effect具有这个属性；
* allowRecurse，可选，表示是否允许自调用；
* deferStop：私有，可选，表示stop()是否延迟执行；
* onStop：可选，函数，在执行stop()时会调用onStop；
* onTrack
* onTrigger：这两个listener为调试用，分别在依赖收集和响应式更新时触发；
* run：effect最核心的方法。
* stop：调用cleanupEffect让effect停止起作用，如果是stop当前活跃的effect，也就是自己停止自己，则会将deferStop调为true，从而延迟停止的时机；触发onStop；将active调为false。

`componentUpdateFn`
componentUpdateFn 函数的内部会执行组件的 render 函数，render 函数会读取组件的响应式数据，这会触发依赖收集。

当后续 render 函数依赖的响应式数据发生变化的时候，会再次触发执行 componentUpdateFn 函数进行组件的重新渲染

```js
const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
  const componentUpdateFn = () => {
    console.log('effect.run==>:调用componentUpdateFn组件的初始挂载和更新')
    if (!instance.isMounted) {
      console.log('effect.run==>:componentUpdateFn之Mounte')
      let vnodeHook;
      const { el, props } = initialVNode;
      const { bm, m, parent } = instance;
      const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
      toggleRecurse(instance, false);
      // beforeMount hook
      if (bm) {
        console.log('effect.run==>:生命周期beforeMount')
        invokeArrayFns(bm);
      }
      // onVnodeBeforeMount
      if (!isAsyncWrapperVNode &&
        (vnodeHook = props && props.onVnodeBeforeMount)) {
        console.log('effect.run==>:生命周期onVnodeBeforeMount')
        invokeVNodeHook(vnodeHook, parent, initialVNode);
      }
      toggleRecurse(instance, true);
      if (el && hydrateNode) {
        // vnode has adopted host node - perform hydration instead of mount.
        const hydrateSubTree = () => {
          {
            startMeasure(instance, `render`);
          }
          console.log("effect.run==>:setupRenderEffect:1组件实例生成子树vnode")
          instance.subTree = renderComponentRoot(instance);
          {
            endMeasure(instance, `render`);
          }
          {
            startMeasure(instance, `hydrate`);
          }
          hydrateNode(el, instance.subTree, instance, parentSuspense, null);
          {
            endMeasure(instance, `hydrate`);
          }
        };
        if (isAsyncWrapperVNode) {
          initialVNode.type.__asyncLoader().then(
            // note: we are moving the render call into an async callback,
            // which means it won't track dependencies - but it's ok because
            // a server-rendered async wrapper is already in resolved state
            // and it will never need to change.
            () => !instance.isUnmounted && hydrateSubTree());
        }
        else {
          hydrateSubTree();
        }
      }
      else {
        {
          startMeasure(instance, `render`);
        }
        console.log('$ceffect.run==>执行renderComponentRoot，获取组件当前的 VNode,render会读取组件的响应式数据，这会触发依赖收集', 'color:chartreuse')
        const subTree = (instance.subTree = renderComponentRoot(instance));
        {
          endMeasure(instance, `render`);
        }
        {
          startMeasure(instance, `patch`);
        }
        console.log("effect.run==>调用patch进行组件内容的渲染,把子树挂载到container上")
        patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
        {
          endMeasure(instance, `patch`);
        }
        initialVNode.el = subTree.el;
      }
      // mounted hook
      if (m) {
        console.log('effect.run==>:生命周期mounted')
        queuePostRenderEffect(m, parentSuspense);
      }
      // onVnodeMounted
      if (!isAsyncWrapperVNode &&
        (vnodeHook = props && props.onVnodeMounted)) {
        const scopedInitialVNode = initialVNode;
        queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
      }
      // activated hook for keep-alive roots.
      // #1742 activated hook must be accessed after first render
      // since the hook may be injected by a child keep-alive
      if (initialVNode.shapeFlag & 256 /* ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE */ ||
        (parent &&
          isAsyncWrapper(parent.vnode) &&
          parent.vnode.shapeFlag & 256 /* ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE */)) {
        instance.a && queuePostRenderEffect(instance.a, parentSuspense);
      }
      console.log("%ceffect.run==>将组件实例的 isMounted 属性设为 true，表明当前的组件已经完成了挂载操作", 'color:red')
      instance.isMounted = true;
      {
        devtoolsComponentAdded(instance);
      }
      // #2458: deference mount-only object parameters to prevent memleaks
      initialVNode = container = anchor = null;
    }
    else {
      console.log('effect.run==>:componentUpdateFn之updateComponent')
      // updateComponent
      // This is triggered by mutation of component's own state (next: null)
      // OR parent calling processComponent (next: VNode)
      let { next, bu, u, parent, vnode } = instance;
      let originNext = next;
      let vnodeHook;
      {
        pushWarningContext(next || instance.vnode);
      }
      // Disallow component effect recursion during pre-lifecycle hooks.
      toggleRecurse(instance, false);
      if (next) {
        next.el = vnode.el;
        updateComponentPreRender(instance, next, optimized);
      }
      else {
        next = vnode;
      }
      // beforeUpdate hook
      if (bu) {
        console.log('effect.run==>:生命周期beforeUpdate')
        invokeArrayFns(bu);
      }
      // onVnodeBeforeUpdate
      if ((vnodeHook = next.props && next.props.onVnodeBeforeUpdate)) {
        invokeVNodeHook(vnodeHook, parent, next, vnode);
      }
      toggleRecurse(instance, true);
      // render
      {
        startMeasure(instance, `render`);
      }
      console.log('$ceffect.run==>执行renderComponentRoot，获取组件最新的 VNode,render会读取组件的响应式数据，这会触发依赖收集', 'color:chartreuse')
      const nextTree = renderComponentRoot(instance);
      {
        endMeasure(instance, `render`);
      }
      // 获取组件上次渲染的 VNode
      const prevTree = instance.subTree;
      instance.subTree = nextTree;
      {
        startMeasure(instance, `patch`);
      }
      console.log('effect.run==>:componentUpdateFn之updateComponent调用patch 函数进行组件的更新')
      patch(prevTree, nextTree,
        // parent may have changed if it's in a teleport
        hostParentNode(prevTree.el),
        // anchor may have changed if it's in a fragment
        getNextHostNode(prevTree), instance, parentSuspense, isSVG);
      {
        endMeasure(instance, `patch`);
      }
      next.el = nextTree.el;
      if (originNext === null) {
        // self-triggered update. In case of HOC, update parent component
        // vnode el. HOC is indicated by parent instance's subTree pointing
        // to child component's vnode
        updateHOCHostEl(instance, nextTree.el);
      }
      // updated hook
      if (u) {
        console.log('effect.run==>:生命周期updated')
        queuePostRenderEffect(u, parentSuspense);
      }
      // onVnodeUpdated
      if ((vnodeHook = next.props && next.props.onVnodeUpdated)) {
        console.log('effect.run==>:生命周期onVnodeUpdated')
        queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
      }
      {
        devtoolsComponentUpdated(instance);
      }
      {
        popWarningContext();
      }
    }
  };
  // create reactive effect for rendering
  console.log('依赖收集==>setupRenderEffect:3调用ReactiveEffect 创建一个副作用:', componentUpdateFn)
  const effect = (instance.effect = new ReactiveEffect(componentUpdateFn, () => queueJob(update), instance.scope // track it in component's effect scope
  ));
  console.log('依赖收集==>a,关键：调用effect.run()为了触发一下依赖收集')
  const update = (instance.update = () => effect.run());

  // ...
  ...
  // ...
  update();
};
}
```
```js
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    console.log('依赖收集==>ReactiveEffect constructor')
    // 传入一个副作用函数
    this.fn = fn;
    this.scheduler = scheduler;
    // 是否活跃
    this.active = true;
    // dep 数组，在响应式对象收集依赖时也会将对应的依赖项添加到这个数组中
    this.deps = [];
    // 上一个 ReactiveEffect 的实例
    this.parent = undefined;
    // 标记作用域
    recordEffectScope(this, scope);
  }
  run() {
    // 如果当前effect已经被stop
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      // 保存上一个 activeEffect
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      // trackOpBit: 根据深度生成 trackOpBit
      trackOpBit = 1 << ++effectTrackDepth;
      // 如果不超过最大嵌套深度，使用优化方案
      if (effectTrackDepth <= maxMarkerBits) {
        // 标记所有的 dep 为 was
        initDepMarkers(this);
      }
      else {
        cleanupEffect(this);
      }
      // 执行过程中重新收集依赖标记新的 dep 为 new
      return this.fn();
    }
    finally {
      if (effectTrackDepth <= maxMarkerBits) {
        // 优化方案：删除失效的依赖
        finalizeDepMarkers(this);
      }
      // 嵌套深度自 + 重置操作的位数
      trackOpBit = 1 << --effectTrackDepth;
      // 恢复上一个 activeEffect
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = undefined;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    // stopped while running itself - defer the cleanup
    if (activeEffect === this) {
      this.deferStop = true;
    }
    else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
```

## 总结副作用更新和收集
1. 依赖收集
targetMap中有depsMap（以target为key）；depsMap中有许多dep（以targetMap的key为key）；简单理解为：在编译时根据target和key，创建副作用，将activeEffect指向新建的副作用，并存放到相关的依赖dep里的过程就是依赖收集。

2. 触发更新
反过来，触发target、key相关的dep中所有相关的副作用，通过各个副作用上的effect.scheduler()或者effect.run()来实现更新。

ReactiveEffect用到了一些重要的全局变量。
* targetMap：弱映射，以目标对象target为key，其收集到的依赖集depsMap为值，因此通过目标对象target可以获取到对应的所有依赖；
* activeEffect：当前活跃的effect，随后会被收集起来；
* shouldTrack：用作暂停和恢复依赖收集的标志；
* trackStack：历史shouldTrack的记录栈。

targetMap对比reactive篇章中提到的proxyMap：
* 两者都是弱映射；
* 都以目标对象target为key；
* targetMap全局只有一个；而proxyMap有四种，分别对应reactive、shallowReactive、readonly、shallowReadonly；
* 一个target在一种proxyMap中最多只有一个对应的代理proxy，因此proxyMap的值为单个的proxy对象；
* 一个target可以由很多的依赖dep，因此targetMap的值为数据集Map


## trigger 触发更新实际上就是触发副作用
triggerEffect触发副作用从而更新。当触发更新的副作用effect允许自调用，且不是当前活跃的副作用时，通过调度器scheduler执行副作用或者直接执行run，是实际上触发更新的地方。
```js
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  // ...
  ...
  // ...
  const eventInfo = { target, type, key, newValue, oldValue, oldTarget };
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0], eventInfo);
      }
    }
  }
  else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects), eventInfo);
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  console.log('%c触发更新:1,triggerEffects接收一个dep和用于调试的额外信息。遍历dep中的effect，逐一使用triggerEffect来执行副作用', 'color:chartreuse', 'dep:', dep)
  // spread into array for stabilization
  const effects = isArray(dep) ? dep : [...dep];
  for (const effect of effects) {
    if (effect.computed) {
      console.log('%c触发更新:a,triggerEffects', 'color:chartreuse', 'effect:', effect)
      triggerEffect(effect, debuggerEventExtraInfo);
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      console.log('%c触发更新:b,triggerEffects', 'color:chartreuse', 'effect:', effect)
      triggerEffect(effect, debuggerEventExtraInfo);
    }
  }
}

function triggerEffect(effect, debuggerEventExtraInfo) {
  if (effect !== activeEffect || effect.allowRecurse) {
    if (effect.onTrigger) {
      effect.onTrigger(extend({ effect }, debuggerEventExtraInfo));
    }
    // 实际触发更新的地方
    if (effect.scheduler) {
      console.log('%c触发更新:1,triggerEffect调用effect.scheduler', 'color:chartreuse')
      effect.scheduler();
    }
    else {
      console.log('%c触发更新:2,triggerEffect调用effect.run', 'color:chartreuse')
      effect.run();
    }
  }
}
```

## track 收集依赖
* 以目标对象target为key，depsMap为targetMap的值；以target的key为key，使用createDep()创建依赖dep为值，存放在target对应的depsMap中。
* 通过trackEffects(dep, eventInfo)来收集副作用。


`createDep`
使用createDep创建一个新的dep。可以看到，dep是个Set实例，且添加了两个属性：
* w：wasTracked的首字母，表示当前依赖是否被收集；
* n：newlyTracked的首字母，表示当前依赖是否是新收集的。

`trackEffects`
trackEffects用于收集副作用。主要把当前活跃的activeEffect加入dep，以及在activeEffect.deps中加入该副作用影响到的所有依赖。

依赖收集就是把当前活跃的副作用activeEffect存入全局变量targetMap中的 (target对应的 depsMap) 中 （target的key）对应的 dep(类型为Set) 中，并把这个dep加入到受activeEffect副作用影响的所有依赖activeEffect.deps列表中。
```js
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = createDep()));
    }
    const eventInfo = { effect: activeEffect, target, type, key }
      ;
    console.log('%c触发收集:1,track调用trackEffects', 'color:chartreuse')
    trackEffects(dep, eventInfo);
  }
}

const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit; // set was tracked
    }
  }
};

function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit; // set newly tracked
      shouldTrack = !wasTracked(dep);
    }
  }
  else {
    // Full cleanup mode.
    shouldTrack = !dep.has(activeEffect);
  }
  if (shouldTrack) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
    if (activeEffect.onTrack) {
      activeEffect.onTrack(Object.assign({ effect: activeEffect }, debuggerEventExtraInfo));
    }
  }
}
```

<br />

# Handlers
## Handlers:get/set
baseHandlers 和 collectionHandlers 两个模块，分别生成 Proxy 代理的 handlers 中的 trap 陷阱。

baseHandlers 是处理 Array、Object 的数据类型的，这也是我们绝大部分时间使用 Vue3 时使用的类型，所以笔者接下来着重的讲一下baseHandlers 中的 get 和 set 陷阱。

### get
get 陷阱有 4 个类型，分别对应不同的响应式 API，从名称中就可以知道对应的 API 名称，非常一目了然。而所有的 get 都是由 createGetter 函数生成的。所以接下来我们着重看一下 createGetter 的逻辑。

createGetter 有 isReadonly 和 shallow 两个参数，让使用 get 陷阱的 api 按需使用。而函数的内部返回了一个 get 函数，使用高阶函数的方式返回将会传入 handlers 中 get 参数的函数。
```js
function createGetter(isReadonly = false, shallow = false) {
  console.log(`%c响应式陷阱触发==>:createGetter`, 'color:red')
  return function get(target, key, receiver) {
    console.log(`%c响应式触发==>1:createGetter之get`, 'color:red', target, key)
    // 如果 get 访问的 key 是 '__v_isReactive'，返回 createGetter 的 isReadonly 参数取反结果
    if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
      return !isReadonly;
    }
    // 如果 get 访问的 key 是 '__v_isReadonly'，返回 createGetter 的 isReadonly 参数
    else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
      return isReadonly;
    }
    else if (key === "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */) {
      return shallow;
    }
    // 如果 get 访问的 key 是 '__v_raw'，并且 receiver 与原始标识相等，则返回原始值
    else if (key === "__v_raw" /* ReactiveFlags.RAW */ &&
      receiver ===
      (isReadonly
        ? shallow
          ? shallowReadonlyMap
          : readonlyMap
        : shallow
          ? shallowReactiveMap
          : reactiveMap).get(target)) {
      return target;
    }

    //...
    ...
    //...
}
```

但是在 get 中Vue3 就对这些 key 做了特殊处理，当我们在对象上访问这几个特殊的枚举值时，就会返回特定意义的结果。而可以关注一下 ReactiveFlags.IS_REACTIVE 这个 key 的判断方式，为什么是只读标识的取反呢？因为当一个对象的访问能触发这个 get 陷阱时，说明这个对象必然已经是一个 Proxy 对象了，所以只要不是只读的，那么就可以认为是响应式对象了。

接着看 get 的后续逻辑。

继续判断 target 是否是一个数组，如果代理对象不是只读的，并且 target 是一个数组，并且访问的 key 在数组需要特殊处理的方法里，就会直接调用特殊处理的数组函数执行结果，并返回。

arrayInstrumentations 是一个对象，对象内保存了若干个被特殊处理的数组方法，并以键值对的形式存储。

我们之前说过 Vue2 以原型链的方式劫持了数组，而在这里也有类似地作用，而数组的部分我们准备放在后续的文章中再介绍，下面是需要特殊处理的数组。
1. 对索引敏感的数组方法
```
includes、indexOf、lastIndexOf
```
2. 会改变自身长度的数组方法，需要避免 length 被依赖收集，因为这样可能会造成循环引用
```
push、pop、shift、unshift、splice
```

在处理完数组后，我们对 target 执行 Reflect.get 方法，获得默认行为的 get 返回值。

之后判断 当前 key 是否是 Symbol，或者是否是不需要追踪的 key，如果是的话直接返回 get 的结果 res。

下面几个 key 是不需要被依赖收集或者返回响应式结果的。
```
__proto__
_v_isRef
__isVue
```
接着判断当前代理对象是否是只读对象，如果不是只读的话，则运行笔者上文提及的 tarck 处理器函数收集依赖。

如果是 shallow 的浅层响应式，则不需要将内部的属性转换成代理，直接返回 res。

如果 res 是一个 Ref 类型的对象，就会自动解包返回，这里就能解释官方文档中提及的 ref 在 reactive 中会自动解包的特性了。而需要注意的是，当 target 是一个数组类型，并且 key 是 int 类型时，即使用索引访问数组元素时，不会被自动解包。

如果 res 是一个对象，就会将该对象转成响应式的 Proxy 代理对象返回，再结合我们之前分析的缓存已生成的 proxy 对象，可以知道这里的逻辑并不会重复生成相同的 res，也可以理解文档中提及的当我们访问 reactive 对象中的 key 是一个对象时，它也会自动的转换成响应式对象，而且由于在此处生成 reactive 或者 readonly 对象是一个延迟行为，不需要在第一时间就遍历 reactive 传入的对象中的所有 key，也对性能的提升是一个帮助。

当 res 都不满足上述条件时，直接返回 res 结果。例如基础数据类型就会直接返回结果，而不做特殊处理。

至此，get 陷阱的逻辑全部结束了。

## set
set 也有一个 createSetter 的工厂函数
```js
function createSetter(shallow = false) {
  console.log(`%c响应式陷阱触发==>:createSetter`, 'color:red')
  return function set(target, key, value, receiver) {
    console.log(`%c响应式触发==>1:createSetter之set`, 'color:red', target, value)
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow) {
      // 当不是 shallow 模式时，判断旧值是否是 Ref，如果是则直接更新旧值的 value
      // 因为 ref 有自己的 setter
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    // 判断 target 中是否存在 key
    const hadKey = isArray(target) && isIntegerKey(key)
      ? Number(key) < target.length
      : hasOwn(target, key);
    // Reflect.set 获取默认行为的返回值
    const result = Reflect.set(target, key, value, receiver);
    // don't trigger if target is something up in the prototype chain of original
    // 如果目标是原始对象原型链上的属性，则不会触发 trigger 派发更新
    if (target === toRaw(receiver)) {
      // 使用 trigger 派发更新，根据 hadKey 区别调用事件
      if (!hadKey) {
        trigger(target, "add" /* TriggerOpTypes.ADD */, key, value);
      }
      else if (hasChanged(value, oldValue)) {
        trigger(target, "set" /* TriggerOpTypes.SET */, key, value, oldValue);
      }
    }
    return result;
  };
}
```

在 set 的过程中会首先获取新旧与旧值，当目前的代理对象不是浅层比较时，会判断旧值是否是一个 Ref，如果旧值不是数组且是一个 ref类型的对象，并且新值不是 ref 对象时，会直接修改旧值的 value。

看到这里可能会有疑问，为什么要更新旧值的 value？如果你使用过 ref 这个 api 就会知道，每个 ref 对象的值都是放在 value 里的，而 ref 与 reactive 的实现是有区别的，ref 其实是一个 class 实例，它的 value 有自己的 set ，所以就不会在这里继续进行 set 了。ref 的部分在后续的文章中会详细讲解。

在处理完 ref 类型的值后，会声明一个变量 hadKey，判断当前要 set 的 key 是否是对象中已有的属性。

接下来调用 Reflect.set 获取默认行为的 set 返回值 result。

然后会开始派发更新的过程，在派发更新前，需要保证 target 和原始的 receiver 相等，target 不能是一个原型链上的属性。

之后开始使用 trigger 处理器函数派发更新，如果 hadKey 不存在，则是一个新增属性，通过 TriggerOpTypes.ADD 枚举来标记。这里可以看到开篇分析 Proxy 强于 Object.defineProperty 的地方，会监测到任何一个新增的 key，让响应式系统更强大。

如果 key 是当前 target 上已经存在的属性，则比较一下新旧值，如果新旧值不一样，则代表属性被更新，通过 TriggerOpTypes.SET 来标记派发更新。

在更新派发完后，返回 set 的结果 result，至此 set 结束。

## 总结
track 收集依赖，trigger 派发更新的过程没有详细展开，在后续的文章中计划详细讲解副作用函数 effect，以及 track 和 trigger 的过程，

## 依赖收集与副作用函数
当我们在 template 模板中使用响应式变量，或者在计算属性中传入 getter 函数后当计算属性中的源数据发生变化后,Vue 即时的通知更新并重新渲染组件。

Vue 通过一个副作用（effect）函数来跟踪当前正在运行的函数。副作用是一个函数包裹器，在函数被调用前就启动跟踪，而 Vue 在派发更新时就能准确的找到这些被收集起来的副作用函数，当数据发生更新时再次执行它。


## 响应式与reactive
createReactiveObject 函数接受 5 个参数:
1. target：目标对象，想要生成响应式的原始对象。
2. isReadonly：生成的代理对象是否只读。
3. baseHandlers：生成代理对象的 handler 参数。当 target 类型是 Array 或 Object 时使用该 handler。
4. collectionHandlers：当 target 类型是 Map、Set、WeakMap、WeakSet 时使用该 handler。
5. proxyMap：存储生成代理对象后的 Map 对象

需要注意的是 baseHandlers 和 collectionHandlers 的区别，这两个参数会根据 target 的类型进行判断，最终选择将哪个参数传入 Proxy 的构造函数，当做 handler 参数使用。

接着我们开始看 createReactiveObject 的逻辑部分：

通过 TargetType 来判断 target 目标对象的类型，Vue3 仅会对 Array、Object、Map、Set、WeakMap、WeakSet 生成代理，其他对象会被标记为 INVALID，并返回原始值。

当目标对象通过类型校验后，会通过 new Proxy() 生成一个代理对象 proxy，handler 参数的传入也是与 targetType 相关，并最终返回已生成的 proxy 对象。
```js
function reactive(target) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (isReadonly(target)) {
    return target;
  }
  console.log('%c响应式=>1:reactive->createReactiveObject创建一个代理对象并返回', 'color:chartreuse')
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}

function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object
  if (target["__v_raw" /* ReactiveFlags.RAW */] &&
    !(isReadonly && target["__v_isReactive" /* ReactiveFlags.IS_REACTIVE */])) {
    return target;
  }
  // target already has corresponding Proxy
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  // only specific value types can be observed.
  const targetType = getTargetType(target);
  if (targetType === 0 /* TargetType.INVALID */) {
    return target;
  }

  console.log('%c响应式=>2:createReactiveObject:new Proxy(target', 'color:chartreuse')
  const proxy = new Proxy(target, targetType === 2 /* TargetType.COLLECTION */ ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
```
