## 1. 原理角度对比：
* ref 通过 Class 的 get 与 set 来实现响应式的（数据劫持）
* reactive 通过使用 Proxy 来实现响应式（数据劫持），并通过Reflect 操作源对象内部的数据。

## 2. 使用角度对比：
* ref 定义的数据：操作数据需要 .value,读取数据时模版中直接读取不需要 .value
* reactive 定义的数据：操作数据与读取数据，均不需要 .value

## 3. 定义数据角度对比：
ref传入的是基本数据，但是如果传入对象类型数据，就回去求助reactive函数 

* ref 用来定义：基本类型数据
* reactive 用来定义：引用类型，例如对象、或数组类型的数据

备注：ref也可以用来定义对象或数组类型数据，它内部会自动通过 reactive 转为代理对象

ref.value 返回的是一个 proxy 对象，他是通过代理 reactive 实现的，下面让我们看看源码:

* 在选项式 API 中，响应式数据是用 data() 选项声明的。在内部，data() 的返回值对象会通过 reactive() 这个公开的 API 函数转为响应式。

https://cn.vuejs.org/guide/scaling-up/state-management.html#simple-state-management-with-reactivity-api

如果你有一部分状态需要在多个组件实例间共享，你可以使用 reactive() 来创建一个响应式对象，并将它导入到多个组件中：
```js
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})

<!-- ComponentA.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From A: {{ store.count }}</template>
```

```html
<!-- ComponentB.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From B: {{ store.count }}</template>
```

```
现在每当 store 对象被更改时，<ComponentA> 与 <ComponentB> 都会自动更新它们的视图。现在我们有了单一的数据源。
```

然而，这也意味着任意一个导入了 store 的组件都可以随意修改它的状态：
```html
<template>
  <button @click="store.count++">
    From B: {{ store.count }}
  </button>
</template>
```


虽然这在简单的情况下是可行的，但从长远来看，可以被任何组件任意改变的全局状态是不太容易维护的。为了确保改变状态的逻辑像状态本身一样集中，建议在 store 上定义方法，方法的名称应该要能表达出行动的意图：
```js
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

```html
<template>
  <button @click="store.increment()">
    From B: {{ store.count }}
  </button>
</template>
```
