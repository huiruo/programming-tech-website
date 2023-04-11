## Vue3中的Provide和Inject 祖孙组件传值
provide 可以在祖先组件中指定我们想要提供给后代组件的数据或方法，而在任何后代组件中，我们都可以使用 inject 来接收 provide 提供的数据或方法
```js
// 父组件代码
<script>
import { provide } from "vue"
export default {
  setup(){
    provide('test',"val")
  }
}
</script>

// 子组件代码
<template>
 {{test}}
</template>
<script>
import { inject } from "vue"
export default {
  setup(){
    const info = inject('test')
    return{
      info
    }
  }
}
</script>
```