---
title: baseCompile生成ast-静态提升-vnode-patch
sidebar_position: -3
---

## 前言
* compiler表示template-->AST抽象语法树

* reactivity表示响应式,effect 副作用函数（Vue3中已经没有了watcher概念,由effect取而代之）
```
1. Vue3 用 ES6的Proxy 重构了响应式，new Proxy(target, handler)

2. Proxy 的 get handle 里 执行track() 用来收集依赖(收集 activeEffect，也就是 effect )
3. Proxy 的 set handle 里执行 trigger() 用来触发响应(执行收集的 effect)
```
* runtime表示运行时相关功能，虚拟DOM(即：VNode)、diff算法、真实DOM操作等

## 应用入口
```mermaid
flowchart TD
A1(createApp)-->A2("ensureRenderer()")-->a3("createRenderer(rendererOptions)")-->a4("baseCreateRenderer(options, createHydrationFns)")

a4-->a6("return {render,createApp:createAppAPI(render, hydrate)}")

a6-->a7("createAppAPI(render, hydrate){return app}")-->a8("mount(rootContainer, isHydrate)")--调用render-->a9(render)


%% createVNode
%% a9("const vnode = createVNode(rootComponent, rootProps);<br> render(vnode, rootContainer, isSVG)")
a9--创建vnode-->b1("见react-vue异同")
%% -->b2("return createBaseVNode(type, props, children,...")
%% b2-->b3("createBaseVNode(type, props,...")

%% render
a9--创建或者更新节点-->b4("patch(container._vnode,vnode,container,...")

%% 调用patch处理组件元素为例
b4--重点-初始化-->b51("接下面初始化")
b4--处理dom元素为例-->b5("processElement(n1, n2, container,...")
b5--创建-->b6("mountElement(n2, container, anchor")
b5--更新-->b7("patchElement(n1, n2, parentComponent)")
```

## 初始化
![](../assets/img-vue/compileToFunction生成code.png)

这个阶段`finishComponentSetup()`是重点函数，调用`compileToFunction()`返回了ast生成的函数
```js
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    // ...
    if (!instance.render) {
      // only do on-the-fly compile if not in SSR - SSR on-the-fly compilation
      // is done by server-renderer
      if (!isSSR && compile && !Component.render) {
        const template = Component.template ||
          resolveMergedOptions(instance).template;
        if (template) {
          {
            startMeasure(instance, `compile`);
          }
          const { isCustomElement, compilerOptions } = instance.appContext.config;
          const { delimiters, compilerOptions: componentCompilerOptions } = Component;
          const finalCompilerOptions = extend(extend({
            isCustomElement,
            delimiters
          }, compilerOptions), componentCompilerOptions);
          console.log('finishComponentSetup=>compileToFunction被调用:', { template, finalCompilerOptions })
          // debugger
          Component.render = compile(template, finalCompilerOptions);
          {
            endMeasure(instance, `compile`);
          }
        }
      }

      // ...
      instance.render = (Component.render || NOOP);
    }
  }

  let compile;
  let installWithProxy;
  registerRuntimeCompiler(compileToFunction);
  /**
   * For runtime-dom to register the compiler.
   * Note the exported method uses any to avoid d.ts relying on the compiler types.
   */
  function registerRuntimeCompiler(_compile) {
    console.log('探究初始化==>registerRuntimeCompiler')
    compile = _compile;
    installWithProxy = i => {
      if (i.render._rc) {
        i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
      }
    };
  }

  function compileToFunction(template, options) {
  console.log('compileToFunction被调用:', { template, options })
    // ...
  }
```

```mermaid
flowchart TD
A1("patch(container._vnode,vnode,container,...")--处理组件元素为例-->A2("processComponent(n1, n2, container")

A2--创建-->b6("mountComponent(n2, container, anchor")-->A-2
A2--更新-->b7("updateComponent(n1, n2,optimized)")

A-2("mountComponent = (initialVNode, container")-->A-1("setupComponent(instance,")-->B0("setupStatefulComponent(instance,")-->B1("handleSetupResult()")-->B2("finishComponentSetup(instance")

B2--开始构建传入模板字符串-->B3("compileToFunction(template, options)")
```

### 初始化源码
`patch`
```js
else if (shapeFlag & 6 /* ShapeFlags.COMPONENT */) {
  console.log(`%c运行时==>patch-->较为重点的2:COMPONENT:调用processComponent处理组件元素:`, 'color:red')
  processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
}
```

`processComponent`
```js
const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
  n2.slotScopeIds = slotScopeIds;
  if (n1 == null) {
    if (n2.shapeFlag & 512 /* ShapeFlags.COMPONENT_KEPT_ALIVE */) {
      parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
    }
    else {
      console.log(`%cpath之processComponent:1调用mountComponent:`, 'color:magenta')
      mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
    }
  }
  else {
    console.log(`%cpath之processComponent:2调用updateComponent:`, 'color:magenta')
    updateComponent(n1, n2, optimized);
  }
};
```

`mountComponent = (initialVNode`
```js
const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
  const instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense));
  console.log(`%c组件挂载：mountComponent:1调用createComponentInstance创建组件实例:`, 'color:magenta', instance)
  if (instance.type.__hmrId) {
    registerHMR(instance);
  }
  {
    pushWarningContext(initialVNode);
    startMeasure(instance, `mount`);
  }
  // inject renderer internals for keepAlive
  // 将keepAlive注入渲染器内部
  if (isKeepAlive(initialVNode)) {
    instance.ctx.renderer = internals;
  }
  // resolve props and slots for setup context
  {
    {
      startMeasure(instance, `init`);
    }

    console.log(`%c组件挂载：mountComponent:2调用setupComponent设置组件实例:`, 'color:magenta')
    console.log('test:定义在data的响应式start==>mountComponent调用setupComponent')
    setupComponent(instance);
    {
      endMeasure(instance, `init`);
    }
  }
```

`handleSetupResult`-->`finishComponentSetup`
```js
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    // setup returned an inline render function
    {
      instance.render = setupResult;
    }
  }
  else if (isObject(setupResult)) {
    if (isVNode(setupResult)) {
      warn$1(`setup() should not return VNodes directly - ` +
        `return a render function instead.`);
    }
    // setup returned bindings.
    // assuming a render function compiled from template is present.
    {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = proxyRefs(setupResult);
    {
      exposeSetupStateOnRenderContext(instance);
    }
  }
  else if (setupResult !== undefined) {
    warn$1(`setup() should return an object. Received: ${setupResult === null ? 'null' : typeof setupResult}`);
  }
  console.log('%ctest:响应式=>handleSetupResult调用finishComponentSetup', 'color:chartreuse')
  finishComponentSetup(instance, isSSR);
}
```

## 渲染流程-编译AST,转换AST为render()
参考：[编译AST-转换AST为render](./编译AST-转换AST为render)

## 收集和更新副作用：
调用patch处理组件元素为例
* 在mountComponent走reactive流程

参考：[响应式原理与reactive](./响应式原理与reactive)

* 在 componentUpdateFn 函数中，进行了组件的初始挂载和更新，生命周期函数就是在这些操作的前后触发执行的，在上面的源码中，使用 invokeArrayFns 函数进行生命周期函数的触发执行
```mermaid
flowchart TD
%% 调用patch处理组件元素为例
A1("patch(container._vnode,vnode,container,...")--处理dom元素为例-->A2("processComponent(n1, n2, container")

A2--创建-->b6("mountComponent(n2, container, anchor")
A2--更新-->b7("updateComponent(n1, n2,optimized)")

%% 创建proxy
b6--1data中声明数据-->d1("setupComponent(instance")-->d2("setupStatefulComponent(instance")--2-->d3("handleSetupResult(instance,setupResult,isSSR)")-->d4("finishComponentSetup(instance")-->d5("applyOptions(instance)")-->d6("reactive(target)")

d2--1-->d9("setup()返回setupResult")

b13(setup声明调用reactive)--1直接调用-->d6

d6-->d7("createReactiveObject(target,false,mutableHandlers){<br/>proxy=new Proxy(target,collectionHandlers|baseHandlers);return proxy}")


%% 依赖收集和组件挂载等生命周期
b6--2依赖收集和组件挂载组件更新-->b8("setupRenderEffect(instance,initialVNode,container,anchor")--1-->b9("new ReactiveEffect初始化effect")

b8--2生命周期在componentUpdateFn-->b10("effect.run()内部调用componentUpdateFn组件的初始挂载和更新")

b10-->b11(renderComponentRoot)-->b12("render(props)会触发一次依赖收集")
```

## render生成之后-vnode构建
参考：[vnode创建](./render生成之后-vnode构建)

## VNode构建之后-开始渲染
参考：[VNode构建之后-开始渲染](./VNode构建之后-开始渲染)
