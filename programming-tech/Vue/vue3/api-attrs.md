## vue2中的$attrs
包含了父组件传递给子组件的非 prop 特性,除style和class (attribute)。
这意味着当你在子组件上使用v-bind="$attrs"时，只有非 prop 特性会被应用到子组件的根元素上。

Vue 2提供了一种在子组件中获取父组件的class和style属性的方法。

可以通过在子组件中使用$listeners属性来实现。$listeners是一个对象，包含了父组件传递给子组件的所有事件监听器。你可以将$listeners应用到子组件的根元素上，这样就能够获取到父组件传递的class和style属性。
```javaScript
<template>
  <div :class="$attrs.class" :style="$attrs.style" v-on="$listeners">
    <!-- 子组件内容 -->
  </div>
</template>

<script>
export default {
  inheritAttrs: false, // 防止自动将父组件的属性应用到根元素上
}
</script>
```

## vue3中的$attrs
Vue 3中的$attrs包含了所有非响应式的父组件传递给子组件的属性，包括class和style属性。
```javaScript
<template>
  <div :class="$attrs.class" :style="$attrs.style">
    <!-- 子组件内容 -->
  </div>
</template>

<script>
export default {
  inheritAttrs: false, // 防止自动将父组件的属性应用到根元素上
}
</script>
```

inheritAttrs: false用于防止自动将父组件的属性应用到子组件的根元素上。然后，我们可以直接使用$attrs.class和$attrs.style将父组件传递的class和style属性应用到子组件的根元素上。

## 用法1-父组件的属性直接渲染在根节点上
```javaScript
<template>
    <div>
      <TestCom title="父组件给的标题" testA="a" testB="b" />
    </div>
</template>
<script setup lang="ts">
import TestCom from "./TestSon.vue"
</script>
```

子组件：将会渲染上面给到的属性
```javaScript
<template>
    <div class="root-son">
       <p>我是p标签</p>
       <span>我是span</span>
    </div>
</template>
```

我们发现父组件中的属性直接是渲染在了
```html
<div class="root-son"></div>这个节点上。

变为了 <div class="root-son" title="父组件给的标题" aa="我是aa" bb="我是bb"></div>
```
因为在默认情况下，父组件的属性会直接渲染在子组件的根节点上。

然后有些情况我们希望是渲染在指定的节点上。那怎么处理这问题呢？

### 设置`inheritAttrs: false`,让父组件的属性渲染在指定的节点上
```javaScript
//子组件
<template>
    <div class="root-son">
        <!--所有的属性都将被这个元素p接收  -->
        <p v-bind="$attrs">我是p标签</p>
        <span>我是span</span>
    </div>
</template>
<script lang="ts" setup>
  // 不让子组件的根节点渲染属性
  inheritAttrs: false
</script>
```
结果：
[](../../assets/img-vue/attrs用法.png)

### 解决：根节点和指定节点都别渲染了属性
无法在`<script setup>`中的声明选项中去使用 inheritAttrs 或插件的自定义选项。

我们需要将代码变为如下：
```javaScript
<template>
    <div class="root-son">
        <!--所有的属性都将被这个元素p接收  -->
        <p v-bind="$attrs">我是p标签</p>
        <span>我是span</span>
    </div>
</template>

<script>
// 无法在 <script setup> 中的声明选项中去使用 inheritAttrs。

export default {
    inheritAttrs: false,
    customOptions: {}
}
</script>
<script lang="ts" setup>

</script>
```
