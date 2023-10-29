## 定义
v-bind指令用于响应更新HTML特性，将一个或多个attribute，或者一个组件prop动态绑定到表达式。v-bind可以简写为：
```html
<!-- 绑定 attribute -->
<img v-bind:src="imageSrc">

<!-- 缩写 -->
<img :src="imageSrc" >
```

## v-bind与v-model都是绑定vue中data中的属性的
主要的区别是v-bind的绑定只是单向的,v-bind会将data中的数据到绑定的地方,在被绑定的地方对数据修改时,data中的原始数据是不会改变的

而v-model的绑定是双向的,不仅将data中的数据对标签内进行绑定,还会将标签中的数据反向绑定到data中,标签数据改变后data中的数据也会同步改变。

## v-on:事件绑定(简写@)

## Vue2中的语法糖.sync：
在父组件中的
```
<div :title.sync="visible" ></div>
等同于: / .sync将针对于title的监听事件缩写 /
<div :title="visible" @update:title="visible = $event" ></div>
在子组件的methods中使用如下将新的value传给父级：

handleClose() {
 this.$emit('update:title', newValue)
}
```

## Vue3中用v-model替代了.sync修饰符和组件的model选项 

## v-model的三个修饰符 
- lazy 加上.lazy后相当于 双向数据绑定不起作用了，实现懒加载，让其只在 change 事件中再加载输入框中的数据，即只有在输入框失去焦点或者按回车键时才会更新 Vue 实例中的值。
```
lazy：将触发input事件转为触发change事件，在某些场景下来降低数据同步频率提升性能。

使用lazy可以使数据不需要多次重写，减少消耗。
使模型绑定的数据只有在失去焦点或者是按下回车时才会更新
<input type="text" id="inp" v-model.lazy="message">
```
- number,自动将用户的输入值转为数值类型。
- trim去除首尾两端的空格

## v-model的实现原理
```html
<template>
  <input v-model="message">
</template>

<script>
export default {
  data() {
    return {
      message: "Hello, Vue 3"
    };
  }
};
</script>


|
|
V

<template>
  <input :value="message" @input="message = $event">
</template>

<script>
export default {
  data() {
    return {
      message: "Hello, Vue 3"
    };
  }
};
</script>
```
从 Vue 3 的源码角度来看，v-model 的实现涉及以下几个核心文件和概念：
1. v-model 指令解析：v-model 指令的解析和处理主要发生在编译阶段。当 Vue 模板编译器处理 v-model 指令时，它会生成一些虚拟节点和渲染函数代码来处理数据绑定和事件监听。这些生成的代码将在运行时被执行。
2. v-model 生成的代码： 在编译阶段，v-model 指令会被编译成一对 v-bind 和 v-on 指令。例如，在上述示例中
```html
<input v-model="message"> 会被编译成 <input :value="message" @input="message = $event">
```

3. 响应式数据： 在 Vue 3 中，响应式数据通过 ref 或 reactive 创建。在 v-model 示例中，message 变量通常会通过 ref 创建，以确保它是响应式的。
4. 事件监听： 由于 v-model 生成了一个 @input 事件监听器，这意味着在输入元素的值发生变化时，会触发这个事件。事件监听器会将新的值（$event）赋给 message 变量，从而使数据变化能够影响视图。

5. 虚拟节点更新： 当数据变化时，Vue 3 会通过虚拟 DOM 和渲染函数来更新实际的 DOM。在 v-model 的情况下，更新是由 :value 绑定实现的，所以当 message 变化时，输入元素的值会相应地更新。

总的来说，v-model 的实现是基于编译时生成的 v-bind 和 v-on 指令，以及在运行时响应式数据和事件监听的机制。这些机制协同工作，使得数据双向绑定变得简单而强大。如果你想深入了解 v-model 的源码实现，可以查看 Vue 3 的源代码仓库中的相关文件和模块。