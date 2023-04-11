```js
<template>
  <div>
    <Son :value="testData"/>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Son from './son.vue'


const testData = ref('hello');

</script>
```

defineProps 接收与 props 相同的值。
```js
<template>
  <div>
    {{ props.value }}
  </div>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps(['value'])
</script> 
```