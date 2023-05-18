## 写法1：`<script setup>`写法：
```js
<template>
  <div>
    <button @click="count++">增加</button>
    <p>计数: {{ count }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// props和emits在语法糖中使用defineEmits和defineProps方法来使用
//defineExpose,defineProps无需导入
const emits = defineEmits(['get']) 
const props = defineProps({
    title:{
        type:String,
        defaule:'defaule one'
    }
})
const toEmits = ()=>{
    emits('get')
}

const count = ref(0);
</script>
```

* 好处是可以更简洁地编写组件逻辑，同时也提供了更好的性能。它会通过编译时的静态分析来推导组件的选项，从而实现更高效的代码生成。

* `<script setup>`还可以帮助自动推断出 props、emit 等选项，使得组件代码更加简洁易懂。

### attrs和slots
在Vue3中，attrs和slots是在setup传入的context中的，现在这两个方法被独立出来，分别使用useslots和useattrs调用。
```javaScript
<script setup>
import { useAttrs } from 'vue';
const { onFun } = useAttrs()
console.log(useAttrs()) // 查看父组件传来的自定义属性
</script>
```


### 对外暴露属性
`<script setup>`的组件默认不会对外部暴露任何内部声明的属性。如果有部分属性要暴露出去，可以使用 defineExpose
```javaScript
// 父组件
<Chlid ref="child"></Chlid>
<script setup>
    let child = ref(null)

    console.log(child.value.myname)
</script>

// 子组件
<script setup>
    let myName = ref("jack")
    defineExpose({ myName });
</script>
```


## 写法2：setup()组件式API
```javaScript
<template>
  <div>
    <button @click="count++">增加</button>
    <p>计数: {{ count }}</p>
  </div>
</template>
​
<script>
import { ref } from "@vue/reactivity"
export default {
    setup() {
        const count = ref(1)        
        return {
            count
        }
    },
}
</script>
```