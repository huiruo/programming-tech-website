## 方法1:ref
```html
<template>
  <div>
    <button @click="callChildMethod">调用子组件方法</button>
    <child-component ref="childRef"></child-component>
  </div>
</template>

<script>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

export default {
  components: {
    ChildComponent,
  },
  methods: {
    callChildMethod() {
      // 通过$refs获取子组件的引用
      const child = this.$refs.childRef;

      // 调用子组件的方法
      child.childMethod();
    },
  },
};
</script>
```

子组件:
```html
<template>
  <div>
    <!-- 子组件的模板 -->
  </div>
</template>

<script>
export default {
  methods: {
    childMethod() {
      // 子组件的方法逻辑
      console.log('子组件方法被调用了');
    },
  },
};
</script>
```

## 2.通过props
```html
<template>
  <div>
    <child-component :parentFunction="parentFunction"></child-component>
  </div>
</template>

<script>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

export default {
  components: {
    ChildComponent,
  },
  setup() {
    const parentFunction = () => {
      console.log('父组件的函数被调用了');
    };

    return {
      parentFunction,
    };
  },
};
</script>
```

```html
<!-- ChildComponent.vue -->
<template>
  <div>
    <button @click="callParentFunction">调用父组件函数</button>
  </div>
</template>

<script>
import { defineComponent, ref, toRefs } from 'vue';

export default defineComponent({
  props: {
    parentFunction: Function,
  },
  setup(props) {
    const { parentFunction } = toRefs(props);

    const callParentFunction = () => {
      parentFunction.value(); // 调用父组件的函数
    };

    return {
      callParentFunction,
    };
  },
});
</script>
```