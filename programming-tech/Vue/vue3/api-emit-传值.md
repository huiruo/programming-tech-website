## 在Vue3.2 中子组件调用父组件方法，需要使用defineEmits
```js
// father.vue
<div class="father">
    <children :carr="arr" @getChildren="onFun" />
</div>

<script setup lang="ts">
import children from './children.vue'
const arr = [1, 3, 5]

function onFun(val: number) {
  console.log('父组件函数,接收到子组件的值为:', val)
}
```

```js
// children.vue
<div class="children">
    <div @click="onUp(3)">carr:</div>
</div>

<script setup lang="ts">
const props = defineProps({
  carr: {
    type: Array,
    required: true
  }
})

const emits = defineEmits(['getChildren'])
function onUp(val: number) {
  console.log('子组件函数')
  emits('getChildren', val)
}
```
