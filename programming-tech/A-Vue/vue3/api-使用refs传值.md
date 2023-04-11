
父组件可以通过 ref 属性给子组件赋一个唯一的标识符，子组件可以通过 $refs 访问到自己的 DOM 元素或组件实例，并在需要时修改它们的属性或方法。

这种方式主要用于父组件与子组件之间的通信，比如调用子组件的方法、获取子组件的属性等。


## 子组件给父组件传值
1.通过ref形式子组件给父组件传值,主要用defineExpose在子组件中把数据暴露

```js
// 父组件
<template>
 <div>
  <HelloWorld ref ='menus'></HelloWorld>
 </div>
</template>
<script setup lang='ts'>
import { ref,reactive,onMounted} from 'vue'
import HelloWorld from './components/HelloWorld.vue'
const menus = ref(null)

onMounted(()=>{
  console.log('我是子组件通过ref方式传过来的值',menus) 
})

</script>
```

```js
// 子组件
<template>

</template>
<script setup lang="ts">
import { ref,reactive} from 'vue'
const data = reactive<number[]>([4, 5, 6])
defineExpose({
    data
})
</script>
```