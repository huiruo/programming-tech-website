---
title: compiler-baseCompile生成ast-静态提升-vnode-patch
sidebar_position: -3
---


## 应用入口
流程图参考：[Vue概览](../Vue概览)

[vue3-测试主要用例](https://github.com/huiruo/programming-tech-website/blob/main/programming-tech/Vue/vue3%E6%BA%90%E7%A0%81%E8%BF%90%E8%A1%8C%E4%BE%8B%E5%AD%90/02-vue3-%E6%B5%8B%E8%AF%95%E4%B8%BB%E8%A6%81%E7%94%A8%E4%BE%8B.html)
```js
<script>
  const { ref, reactive, nextTick } = Vue

  Vue.createApp({
    data() {
      return {
        msg: '改变我',
        showDiv: false
      }
    },
    methods: {
      onClickText() {
        this.msg = '努力'
        this.showDiv = !this.showDiv
        this.info.msg2 = this.showDiv ? '直接点' : '其他选择'
        nextTick(() => {
          console.log('--nextTick--', this.showDiv, this.msg);
        })
      }
    },

    setup(props) {
      const refData = ref({
        myName: 'Ruo'
      })

      const info = reactive({
        msg2: 'hello',
      });

      nextTick(() => {
        console.log('--nextTick--');
      })

      Vue.onBeforeMount(() => {
        console.log('--1:组件挂载前 onBeforeMount-->')
      })

      Vue.onMounted(() => {
        console.log('--2:组件挂载后 onMounted-->')
      });

      return {
        info,
        refData
      };
    },

  }).mount('#root')
</script>
```

## 初始化
![](../assets/img-vue/compileToFunction生成code.png)

接：[首次渲染流程-patch函数](../../Vue概览)
```mermaid
flowchart TD
A1("patch(container._vnode,vnode,container,...")--处理组件元素为例-->A2("processComponent(n1, n2, container")

A2--创建-->b6("mountComponent(n2, container, anchor")-->A-2
A2--更新-->b7("updateComponent(n1, n2,optimized)")

A-2("mountComponent = (initialVNode, container")-->A-1("setupComponent(instance,")-->B0("setupStatefulComponent(instance,")-->B1("handleSetupResult()")-->B2("finishComponentSetup(instance")

B2--开始构建传入模板字符串-->接下面流程图
```

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

## 流程图-生成AST-转换AST为render总结
### 生成AST-转换AST为render总览
* 生成ast对象
* 将ast对象作为参数传入transform函数，对 ast 节点进行转换操作
* 将ast对象作为参数传入generate函数，返回编译结果
```mermaid
flowchart TD
A1(baseCompile)-->A2(baseParse生成ast)-->A3(transform对ast进行转换)-->A4(generate根据变换后的ast生成code并返回)

其他--组件挂载和更新的逻辑-->A5("patch()用vnode对象构建的DOM元素")-->A6("根据VNode类型的不同使用不同的函数进行处理")
```

### 1.接`初始化流程`,finishComponentSetup()开始执行
接上面的finishComponentSetup()开始执行，去构建ast:
```mermaid
flowchart TD

A0(`finishComponentSetup-开始`)--传入模板字符串-->A1(compileToFunction)-->A2("compile$1(template, options = {}){<br/>return baseCompile(template,...")-->A4("baseCompile(template, options = {})")

A4--1生成Ast-->A5("ast = baseParse(template, options)")-->A6("return createRoot(parseChildren(context")

A4--2编译_ast进行变换-->A4A("transform(ast, extend({}, options")
A4--3变换之后生成code字符串-->A4B("generate(ast, extend({}")

A6-->A7("parseChildren{")

A7--解析案例1则当做插值表达式进行解析-->b1("node = parseInterpolation(context, mode)")

A7--解析案例2解析元素或组件-->b2("node = parseElement(context, ancestors)")-->b3("const element = parseTag(context, 0")--调用parseAttributes解析属性_特性_指令-->b4("props = parseAttributes(context, type)")

b4--循环调用-->b5("attr = parseAttribute(context, attributeNames)")
```

### 2.第二步编译,根据ast-->生成code字符串
编译终点-生成代码字符串,根据变换后的转换AST生成render()函数
>代码生成阶段、会根据解析以及变换添加相应标记后的ast以及使用vue的环境，生成对应的用户生成虚拟节点的代码字符串。

generate虽略长，但不复杂。主要是根据不同的环境，nodejs、浏览器、ssr生成对应的代码格式。genNode更是简单，switch判别不同的ast节点类型，根据不同类型插入相应的运行时用于创建虚拟节点的函数的代码字符串。

参考：[compiler-生成AST-转换AST为render](./compiler-生成AST-转换AST为render)

```mermaid
flowchart TD
A1("baseCompile(template, options")--第二步编译_ast进行变换-->A2("transform(ast, extend({}, options")-->A3("traverseNode(root, context)")

A1--最后一步变换之后生成code字符串-->c1("generate(ast, extend({}")-->c2("return code函数")

A3--变换例子v_once-->b2("getBaseTransformPreset()")-->b3("transformOnce = (node, context)")

A2--静态提升-->b1("hoistStatic(root, context)")
```

### 2-1. 静态提升发生在这一阶段:transform对ast进行转换,变换AST的结构
因为只有拿到生成的 AST 我们才能遍历 AST 的节点进行 transform 转换操作，比如解析 v-if、v-for 等各种指令。

也能对源码进行优化: vue3新特性：
vue3 在模板的compile-time做了的优化:比如提升不变的vNode(静态提升)，以及blockTree配合patchFlag靶向更新

transform中的hoistStatic发生静态提升,hoistStatic会递归ast并发现一些不会变的节点与属性，给他们打上可以静态提升的标记。在生成代码字符串阶段，将其序列化成字符串、以减少编译和渲染成本。

由于是对AST的变换，所以不会有返回值，所以在baseCompile的transform函数，只会传入ast抽象语法树和相应的变换选项。

## vue初始化源码
### `patch`
```js
else if (shapeFlag & 6 /* ShapeFlags.COMPONENT */) {
  console.log(`%c运行时==>patch-->较为重点的2:COMPONENT:调用processComponent处理组件元素:`, 'color:red')
  processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
}
```

### `processComponent`
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

### `mountComponent = (initialVNode`
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

### `handleSetupResult`-->`finishComponentSetup`
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

## 收集和更新副作用：
调用patch处理组件元素为例
* 在mountComponent走reactive流程

参考：[首次渲染的track和data改变的trigger](./首次渲染的track和data改变的trigger)

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
参考：[vnode创建](./runtime-render生成之后-vnode构建)

## VNode构建之后-开始渲染
参考：[runtime-VNode构建之后-开始渲染](./runtime-VNode构建之后-开始渲染)
