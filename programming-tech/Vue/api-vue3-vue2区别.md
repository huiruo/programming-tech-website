---
title: api-vue3-vue2区别
sidebar_position: 10
---

# 总结
* 性能提升：Vue.js 3 通过更好的模板编译器和优化算法，在性能方面有了大幅度的提升。
* 更好的响应式系统：Vue.js 3 的响应式系统进行了升级，现在支持 Proxy，可以更加精细地控制响应式数据。
* 更好的 TypeScript 支持
* 更好的组合 API

## vue3 响应式
### Object.defineProperty缺点:
1. Object.defineProperty无法监控到数组下标的变化，导致直接通过数组的下标给数组设置值，不能实时响应。 为了解决这个问题，经过vue内部处理后可以使用以下几种方法来监听数组:
```
push()
pop()
shift()
unshift()
splice()
sort()
reverse()
```
由于只针对了以上八种方法进行了hack处理,所以其他数组的属性也是检测不到的，还是具有一定的局限性。

2. Object.defineProperty只能劫持对象的属性,因此我们需要对每个对象的每个属性进行遍历。Vue 2.x里，是通过 递归 + 遍历 data 对象来实现对数据的监控的
Object.defineProperty只能劫持对象的属性,因此我们需要对每个对象的每个属性进行遍历

### vue3 Proxy有以下优点:
1. 可以劫持整个对象，并返回一个新对象,有13种劫持操作
2. 利用reactive注册响应式对象，对函数返回值操作
3. 利用Proxy劫持数据的get,set,deleteProperty,has,own
4. 利用WeakMap,Map,Set来实现依赖收集

缺点：使用大量ES6新增特性，旧版本浏览器兼容性差。Proxy是es6提供的新特性，兼容性不好，最主要的是这个属性无法用polyfill来兼容

Proxy 和 Reflect是ES6新增的两个类，Proxy相比Object.defineProperty更加好用，解决了后者不能监听数组改变的缺点，并且还支持劫持整个对象,并返回一个新对象,不管是操作便利程度还是底层功能上都远强于Object.defineProperty，Reflect的作用是可以拿到Object内部的方法，并且在操作对象出错时返回false不会报错。

<br />


## 1. vue2和vue3生命周期钩子不同 — 提供了类似react Hooks
vue2:
beforeCreate-->created-->beforeMount-->mounted

vue3:
setup-->onBeforeMount-->onMounted
```js
beforeCreate()    <--> setup()
created()         <--> setup()
beforeMount()     <--> onBeforeMount()
mounted()         <--> onMounted()

// 界面还没更新 但是data里面的数据是最新的。即页面尚未和最新的data里面的数据包同步
beforeUpdate()    <--> onBeforeUpdate()
// 表示页面和data里面的数据已经包吃同步了 都是最新的
updated()         <--> onUpdated()

// 当执行这个生命周期钩子的时候 vue的实例从运行阶段进入销毁阶段 此时实例身上的data 还有 methods处于可用的状态
beforeDestroy()   <--> onBeforeUnmount()
// 表示组件已经完全被销毁了 组件中所有的实例方法都是不能用了
destroyed()       <--> onUnmounted()
errorCaptured()   <--> onErrorCaptured()
```

vue3:
```js
onBeforeMount(() => {
  console.log('组件挂载前onBeforeMount')
})
onMounted(() => {
  console.log('组件挂载后onMounted')
})

onBeforeUpdate(() => {
  console.log('初次渲染不会执行:组件更新前onBeforeUpdate')
})

onUpdated(() => {
  console.log('初次渲染不会执行:组件更新后onUpdated')
})

onBeforeUnmount(() => {
  console.log('组件销毁前onBeforeUnmount')
})
onUnmounted(() => {
  console.log('组件销毁后onUnmounted')
})
```


* vue2专有:beforeCreate()和created()
```
1. 运行生命周期钩子函数 beforeCreate,在执行的时候，data还有methods都没有被初始化
2. 进入注入流程，处理属性，computed，methods，data，provide，inject，最后使用代理模式将这些属性挂载到实例中。
```

* vue3专有:setup()，在组件被挂载之前被调用。创建的是data和method
```
setup相当于组件编译的入口，setup在beforeCreate钩子执行前运行，此时只初始化了prop（属性）和context等，而data是在beforeCreate钩子之后created之前执行的。

注意：onMounted虽然写在setup函数中，但却是在组件挂载到父组件时才被调用的。

由于setup中不能使用this，因此需要使用getCurrentInstance 方法获得当前活跃的组件
```

* 组件挂载前 vue3:onBeforeMount()/vue2:beforeMount()
updateComponent，该函数会运行render函数，并把render函数的返回结果vnode作为参数给
```
onBeforeMount()/beforeMount() 表示模板已经在内存中编辑完成了，但是尚未渲染到模板页面中。即页面中的元素，没有被真正的替换过来，只是之前写的一些模板字符串。
```
* 组件挂载后 vue3:onMounted()/ vue2:mounted()
```
表示内存中模板已经真实的挂载到页面中去了，用户可以看到渲染好的界面了
执行完这个函数表示 整个vue实例已经初始化完成了，组件脱离了创建阶段，进入运行阶段。
```

## 2. 接收 Props 不同,setup,this
## 3. 按需引用的有了更细微的可控性，让项目的性能和打包大小有更好的控制。
## 4. vue3与vue2响应式的区别:使用 基于 Proxy 提升性能
###  1-1.基于 Proxy 的 Observation
目前，Vue 的响应式系统是使用带有 Object.defineProperty 的getter 和 setter。但是，Vue 3 将使用 ES2015 Proxy 作为其观察机制。这消除了以前存在的警告，使速度加倍，并使用了一半的内存。

<br />

## 2.接收 Props 不同,setup,this
接收组件props参数传递这一块为我们带来了Vue2和Vue3之间最大的区别。
—this在vue3中与vue2代表着完全不一样的东西。

在 Vue2，this代表的是当前组件，不是某一个特定的属性。所以我们可以直接使用this访问prop属性值。就比如下面的例子在挂载完成后打印处当前传入组件的参数title。
```js
mounted () {
    console.log('title: ' + this.title)
}
```

但是在 Vue3 中，this无法直接拿到props属性，emit events（触发事件）和组件内的其他属性。setup()方法可以接收两个参数：
1. props - 不可变的组件参数
2. context - Vue3 暴露出来的属性（emit，slots，attrs）
```js
 // 使用props 接收父组件传过来的值,是一个数组，多个参数可以使用逗号分开
props:["title","home"],
// 或则
props: {
  listSubProject: {
    type: Array,
    default: () => [],
  },
  isPm: {
    type: Boolean,
    default: false,
  },
},
methods:{
    getTitle(){
        // 方法中使用父组件传过来的参数，可以使用 this
        alert(this.title)
    }
},
setup (props) {
    // ...
    onMounted(() => {
      console.log('title: ' + props.title)
    })
    // ...
}
```

## 事件 - Emitting Events 
在 Vue2 中自定义事件是非常直接的，但是在 Vue3 的话，我们会有更多的控制的自由度。
举例，现在我们想在点击提交按钮时触发一个login的事件。
在 Vue2 中我们会调用到this.$emit然后传入事件名和参数对象。
```js
login () {
      this.$emit('login', {
        username: this.username,
        password: this.password
      })
}
```

但是在 Vue3中，我们刚刚说过this已经不是和vue2代表着这个组件了，所以我们需要不一样的自定义事件的方式
在setup()中的第二个参数content对象中就有emit，这个是和this.$emit是一样的。那么我们只要在setup()接收第二个参数中使用分解对象法取出emit就可以在setup方法中随意使用了。
```js
setup (props, { emit }) {
    const login = () => {
      emit('login', {
        username: state.username,
        password: state.password
      })
    }
}
```

## 不同在于数据获取:Vue3中的反应数据:Reactive Data
```
Vue3 的设计模式给予开发者们按需引入需要使用的依赖包。这样一来就不需要多余的引用导致性能或者打包后太大的问题。
全新的合成式API（Composition API）可以提升代码的解耦程度 —— 特别是大型的前端应用，效果会更加明显。还有就是按需引用的有了更细微的可控性，让项目的性能和打包大小有更好的控制。
```

— 所以我们需要访问这个反应状态来获取数据值。

使用以下三步来建立反应性数据:

1.从vue引入reactive
2.使用reactive()方法来声名我们的数据为反应性数据
3.使用setup()方法来返回我们的反应性数据，从而我们的template可以获取这些反应性数据
```js
import { reactive } from 'vue'

export default {
  props: {
    title: String
  },
  setup () {
    const state = reactive({
      username: '',
      password: ''
    })

    return { state }
  }
}
```


## 路由方面,非重点
1.需要安装 router4

我们可以导入它并Vue.use(router)，但这在Vue3中不一样。
```js
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

vue2
```js
import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import { initMutual } from "./utils/PCmutual.js";
import './index.less'

Vue.config.productionTip = false
Vue.prototype.axios = axios
initMutual();
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

vue3创建

createWebHashHistory hash 路由

createWebHistory history 路由

createMemoryHistory 带缓存 history 路由
```js
const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes
})
export default router
```
vue2
```js
import VueRouter from 'vue-router'
const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
```

## 优化 slots 的生成
目前在 Vue 中，当父组件重新渲染时，其子组件也必须重新渲染。使用Vue 3，可以单独重新渲染父级和子级

## keep-alive
### keep-alive平时在哪里使用?原理是什么?
使用keep-alive包裹动态组件时，会对组件进行缓存，避免组件重新创建

使用有两个场景，一个是动态组件，一个是router-view
```
如果不需要缓存，直接返回虚拟节点。

如果需要缓存，就用组件的id和标签名，生成一个key，把当前vnode的instance作为value，存成一个对象。这就是缓存列表

如果设置了最大的缓存数，就删除第0个缓存。新增最新的缓存。

并且给组件添加一个keepAlive变量为true，当组件初始化的时候，不再初始化。
```

- include 使该标签作用于所有name属性的值跟此标签 include的属性值一致的vue页面
- exclude 使该标签不作用于所有name属性的值跟此标签 exclude的属性值一致的vue页面


### 注意：
- activated,deactivated这两个生命周期函数一定是要在使用了keep-alive组件后才会有的，否则则不存在。
- exclude不是用 route的name；而是组件的name;

注意一定要给需要缓存的组件都写name属性的值。我一开始还以为是路由的name值，后来发现搞错了
当引入keep-alive的时候，页面第一次进入，钩子的触发顺序created-> mounted-> activated，退出时触发deactivated。
当再次进入（前进或者后退）时，只触发activated。
```
使用include/exclude 属性需要给所有vue类的name赋值（注意不是给route的name赋值），否则 include/exclude不生效。
export default {
 name:'a', // include 或 exclude所使用的name
 data () {
 return{
    }
  },
}
```

路由：
```html
// 保持 name为a和b的组件
<keep-alive include="a,b">
    <router-view/>
</keep-alive>
```
### 实例：
```html
<keep-alive include="test-keep-alive">
  <!-- 将缓存name为test-keep-alive的组件 -->
  <component></component>
</keep-alive>
 
<keep-alive include="a,b">
  <!-- 将缓存name为a或者b的组件，结合动态组件使用 -->
  <component :is="view"></component>
</keep-alive>
 
<!-- 使用正则表达式，需使用v-bind -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>
 
<!-- 动态判断 -->
<keep-alive :include="includedComponents">
  <router-view></router-view>
</keep-alive>
 
<keep-alive exclude="test-keep-alive">
  <!-- 将不缓存name为test-keep-alive的组件 -->
  <component></component>
</keep-alive>
```

### vue-router有几种钩子函数?执行流程如何?
钩子函数有三种：

全局守卫

路由守卫

组件守卫

## Vue.use是干什么的?
Vue.use是用来使用插件的。我们可以在插件中扩展全局组件、指令、原型方法等。 会调用install方法将Vue的构建函数默认传入，在插件中可以使用vue，无需依赖vue库

## 组件写name有啥好处?
增加name属性，会在components属性中增加组件本身，实现组件的递归调用。

可以表示组件的具体名称，方便调试和查找对应的组件。

## vue的修饰符有哪些?
```
.stop

.prevent

.capture

.self

.once

.passive

.right

.center

.middle

.alt
```
## 如何理解自定义指令?
在生成ast语法树时，遇到指令会给当前元素添加directives属性

通过genDirectives生成指令代码

在patch前，将指令的钩子提取到cbs中，在patch过程中调用对应的钩子

当执行cbs对应的钩子时，调用对应指令定义方法