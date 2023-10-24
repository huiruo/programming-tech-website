---
title: Vue
sidebar_position: 2
---

## 代码层面

### 拆分组件

当触发更新的时候节点都会 patch-->diff,所以尽量把大组件抽离成组件

在 Vue.js 中，一个组件的渲染和更新是由数据驱动的，当数据发生变化时，Vue 会重新渲染相关的组件。

如果你将所有的布局和视图逻辑都写在一个大的组件中，这个组件可能会变得非常庞大，其中包含大量的模板代码、计算属性、方法等。当数据变更时，Vue 需要重新计算整个组件的虚拟 DOM，并将其与实际 DOM 进行比较，以确定需要更新的部分，然后进行更新操作。如果组件太大，这个过程可能会变得相对较慢，导致页面渲染速度下降，从而影响用户体验。

将组件拆分成小的、可重用的部分有助于提高性能，因为这样只有相关的组件会在数据变更时重新渲染，而不是整个大组件。这可以通过 Vue 的组件化特性来实现，将页面分解为多个小组件，每个组件负责特定的功能或视图。这样可以更容易维护和优化应用程序，提高渲染性能和用户体验。

### 合理设置 key,作用主要是为了高效的更新虚拟 DOM

Vue 在 patch 过程中，通过 key 可以判断两个虚拟节点是否是相同节点。

没有 key 会导致更新的时候出问题,尽量不要采用索引作为 key。

需要使用 key 来给每个节点做一个唯一标识，Diff 算法就可以正确的识别此节点。

### 纯展示性的静态数据不要放 data，合理的设置响应式数据

1. 纯展示性的静态数据不要放 data

   > 对于那些纯展示性的静态数据，将它们放在 data 中可能会浪费性能和内存，因为 Vue 会监视这些数据的变化，尽管它们实际上不会发生变化。

2. 放进 computed 中:
   因为我们的 computedList 中，没有依赖，即没有任何访问响应式数据（如 data/props 上的属性/其他依赖过的 computed 等）的操作，根据 Vue 的依赖收集机制，
   只有在 computed 中引用了实例属性，触发了属性的 getter，getter 会把依赖收集起来，等到 setter 调用后，更新相关的依赖项

## 合理使用 api

### v-show(频繁切换性能高)和 v-if 的合理使用

### v-for 遍历避免同时使用 v-if

[v-if 和 v-for-前者优先级更高](../Vue/问题-v-if和v-for-前者优先级更高)

## 虚拟滚动、时间分片等策略

vue-virtual-scroll-list,虚拟滚动列表来支持大数据

## webpack 配置层

采用异步组件 -> 借助 webpack 的分包策略

### 组件的异步加载（按需加载组件）

用 require 这种方式引入的时候，会将你的 component 分别打包成不同的 js，加载的时候也是按需加载，只用访问这个路由网址时才会加载这个 js

```js
{
  component: (resolve) => require(["@/view/index.vue"], resolve);
}
```

非懒加载：

```js
{
  component: index;
}
```

如果用 import 引入的话，当项目打包时路由里的所有 component 都会打包在一个 js 中，造成进入首页时，需要加载的内容过多，时间相对比较长
vue 的路由配置文件(routers.js)，一般使用 import 引入的写法，当项目打包时路由里的所有 component 都会打包在一个 js 中，在项目刚进入首页的时候，就会加载所有的组件，所以导致首页加载较慢，
而用 require 会将 component 分别打包成不同的 js，按需加载，访问此路由时才会加载这个 js，所以就避免进入首页时加载内容过多。

### vue 代码层:路由懒加载

- require: 运行时调用，理论上可以运用在代码的任何地方，
- import：编译时调用，必须放在文件开头

Vue 是单页面应用，可能会有很多的路由引入 ，这样使用 webpcak 打包后的文件很大，当进入首页时，加载的资源过多，页面会出现白屏的情况，不利于用户体验。

路由懒加载方法:通过异步组件和 webpack 代码分割，实现路由懒加载，按需加载，提升路由页面加载速度。
通过工厂函数返回一个 Promise 对象，异步加载组件
import() 返回一个 promise 对象

```js
const Foo = () => import("./Foo.vue");
const router = new VueRouter({
  routes: [
    {
      path: "/foo",
      component: () => import("./Foo.vue"),
    },
  ],
});
```

当页面很多，组件很多的时候，SPA 页面在首次加载的时候，就会变的很慢。这是因为 vue 首次加载的时候把可能一开始看不见的组件也一次加载了，这个时候就需要对页面进行优化，就需要异步组件了
什么是异步组件？
异步组件就是定义的时候什么都不做，只在组件需要渲染（组件第一次显示）的时候进行加载渲染并缓存，缓存是以备下次访问。

为什么用异步组件?

在大型应用中，功能不停地累加后，核心页面已经不堪重负，访问速度愈来愈慢。为了解决这个问题我们需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块，从而提高页面加载速度。

1. webpack 和 ES6 返回一个 Promise（推荐）

```js
// 下面2行代码，没有指定webpackChunkName，每个组件打包成一个js文件。
// 如果我们想把一些组件和某一个子组件一起打包为代码块，通过添加注释的方式即可
const ImportFuncDemo1 = () => import("../components/ImportFuncDemo1");
const ImportFuncDemo2 = () => import("../components/ImportFuncDemo2");
// 下面2行代码，指定了相同的webpackChunkName，会合并打包成一个js文件。
// const ImportFuncDemo = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '../components/ImportFuncDemo')
// const ImportFuncDemo2 = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '../components/ImportFuncDemo2')
export default new Router({
  routes: [
    {
      path: "/importfuncdemo1",
      name: "ImportFuncDemo1",
      component: ImportFuncDemo1,
    },
    {
      path: "/importfuncdemo2",
      name: "ImportFuncDemo2",
      component: ImportFuncDemo2,
    },
  ],
});
```
