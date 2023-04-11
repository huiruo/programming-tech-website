---
title: vue
sidebar_position: 2
---

## 谈谈Vue的性能优化有哪些?

### 控制组件的粒度 -> Vue采用组件级别更新
拆分组件
如果把所有的组件的布局写在一个组件中，当数据变更时，由于组件代码比较庞大，vue 的数据驱动视图更新会比较慢，造成渲染过慢，也会造成比较差的体验效果。
所以要把组件细分，比如一个组件，可以把整个组件细分成轮播组件、列表组件、分页组件等。


### 合理设置key
```
Vue在patch过程中，通过key可以判断两个虚拟节点是否是相同节点。

没有key会导致更新的时候出问题

尽量不要采用索引作为key
```

###  数据层级不要过深，合理的设置响应式数据
不要把所有东西都放进data
如果你的data属于纯展示的数据，你根本不需要对这个数据进行监听，特别是一些比这个例子还复杂的列表/对象，放进data中纯属浪费性能

放进computed中:
因为我们的computedList中，没有依赖，即没有任何访问响应式数据（如data/props上的属性/其他依赖过的computed等）的操作，根据Vue的依赖收集机制，
只有在computed中引用了实例属性，触发了属性的getter，getter会把依赖收集起来，等到setter调用后，更新相关的依赖项

### v-show(频繁切换性能高)和v-if的合理使用

### 使用keep-alive来缓存组件

### 虚拟滚动、时间分片等策略
vue-virtual-scroll-list,虚拟滚动列表来支持大数据

### 采用异步组件 -> 借助webpack的分包策略

### 最后，打包优化


## 1. webpack配置层
## 2. 基础的web技术层面
## 3. vue代码层:区分 computed 和 watch 的使用
```
computed特性
1.是计算值，data中声明过或者父组件传递的props中的数据通过计算得到的值
2.应用：就是简化tempalte里面{{}}计算和处理props或$emit的传值
3.具有缓存性，页面重新渲染值不变化,计算属性会立即返回之前的计算结果，而不必再次执行函数
当一个属性受多个属性影响的时候就需要用到computed

watch特性
1.是观察的动作，支持异步.应用：监听props，$emit或本组件的值执行异步操作
3.无缓存性，页面重新渲染时值不变化也会执行
`watch` 还可以做一些特别的事情，例如监听页面路由，当页面跳转时，我们可以做相应的权限控制，拒绝没有权限的用户访问页面。
4.监听的函数接收两个参数，第一个参数是最新的值；第二个参数是输入之前的值；
5. 监听数据必须是data中声明过或者父组件传递过来的props中的数据，当数据变化时，触发其他操作，函数有两个参数，
　　immediate：组件加载立即触发回调函数执行，
　　deep: 深度监听，为了发现对象内部值的变化，复杂类型的数据时使用，例如数组中的对象内容的改变，注意监听数组的变动不需要这么做。
   注意：deep无法监听到数组的变动和对象的新增，参考vue数组变异,只有以响应式的方式触发才会被监听到。

3.v-for 遍历为 item 添加 key
需要使用key来给每个节点做一个唯一标识，Diff算法就可以正确的识别此节点。
作用主要是为了高效的更新虚拟DOM。

4.v-for 遍历避免同时使用 v-if
```

## vue代码层:组件的异步加载（按需加载组件）
懒加载：
```js
  component: resolve => require([’@/view/index.vue’], resolve)
```
用require这种方式引入的时候，会将你的component分别打包成不同的js，加载的时候也是按需加载，只用访问这个路由网址时才会加载这个js

非懒加载：
```js
{
  component: index
}
```
如果用import引入的话，当项目打包时路由里的所有component都会打包在一个js中，造成进入首页时，需要加载的内容过多，时间相对比较长
vue的路由配置文件(routers.js)，一般使用import引入的写法，当项目打包时路由里的所有component都会打包在一个js中，在项目刚进入首页的时候，就会加载所有的组件，所以导致首页加载较慢，
而用require会将component分别打包成不同的js，按需加载，访问此路由时才会加载这个js，所以就避免进入首页时加载内容过多。

异步写法
```js
<template>
  <div>
    <hell />
  </div>
</template>

<script>
export default {
  components: {
    hell(resolve) {
      require(["../components/hell2.vue"], resolve);
    }
  },
  data() {
    return {};
  }
};
</script>
```

## vue代码层:路由懒加载
require: 运行时调用，理论上可以运用在代码的任何地方，
import：编译时调用，必须放在文件开头
Vue 是单页面应用，可能会有很多的路由引入 ，这样使用 webpcak 打包后的文件很大，当进入首页时，加载的资源过多，页面会出现白屏的情况，不利于用户体验。

路由懒加载方法:通过异步组件和webpack代码分割，实现路由懒加载，按需加载，提升路由页面加载速度。
通过工厂函数返回一个Promise对象，异步加载组件
import() 返回一个promise对象
```js
const Foo = () => import('./Foo.vue')
const router = new VueRouter({
  routes: [
    { 
      path: '/foo', 
      component: () => import('./Foo.vue') 
    }
  ]
})
```

当页面很多，组件很多的时候，SPA页面在首次加载的时候，就会变的很慢。这是因为vue首次加载的时候把可能一开始看不见的组件也一次加载了，这个时候就需要对页面进行优化，就需要异步组件了
什么是异步组件？
异步组件就是定义的时候什么都不做，只在组件需要渲染（组件第一次显示）的时候进行加载渲染并缓存，缓存是以备下次访问。

为什么用异步组件?
在大型应用中，功能不停地累加后，核心页面已经不堪重负，访问速度愈来愈慢。为了解决这个问题我们需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块，从而提高页面加载速度。
1.webpack和ES6推荐返回一个 Promise（推荐）
```js
// 下面2行代码，没有指定webpackChunkName，每个组件打包成一个js文件。
// 如果我们想把一些组件和某一个子组件一起打包为代码块，通过添加注释的方式即可
const ImportFuncDemo1 = () => import('../components/ImportFuncDemo1')
const ImportFuncDemo2 = () => import('../components/ImportFuncDemo2')
// 下面2行代码，指定了相同的webpackChunkName，会合并打包成一个js文件。
// const ImportFuncDemo = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '../components/ImportFuncDemo')
// const ImportFuncDemo2 = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '../components/ImportFuncDemo2')
export default new Router({
    routes: [
        {
            path: '/importfuncdemo1',
            name: 'ImportFuncDemo1',
            component: ImportFuncDemo1
        },
        {
            path: '/importfuncdemo2',
            name: 'ImportFuncDemo2',
            component: ImportFuncDemo2
        }
    ]
})
```






