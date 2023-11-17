## Vue 中 transition 过渡动画的原理:

文档：https://cn.vuejs.org/v2/guide/transitions.html

当一个 dom 元素被包裹在`<transition>`，vue 会自动分析元素的 css 样式，构建如图 4 所示的动画流程，不同阶段有不同的状态。

在动画即将开始时，会往相应 dom 元素上增加两个 class（即 fade-enter 和 fade-enter-active ）；

当动画执行完第一帧，进行到第二帧的时候，会去掉 fade-enter，并增加 fade-enter-to；

当动画执行到最后，会将 fade-enter-active 和 fade-enter-to 都移除。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Hello World</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  </head>
  <style>
    .fade-enter {
      opacity: 0;
    }

    .fade-enter-active {
      transition: opacity 0.5s;
    }

    .fade-enter-to {
    }

    .fade-leave {
    }

    .fade-leave-active {
      transition: opacity 0.5s;
    }

    .fade-leave-to {
      transition: opacity 0.5s;
    }
  </style>

  <body>
    <div id="app">
      <transition name="fade">
        <p v-if="show">hello</p>
      </transition>
      <button @click="handleClick">toggle</button>
    </div>
    <script>
      let vm = new Vue({
        el: "#app",
        data: {
          show: true,
        },
        methods: {
          handleClick: function () {
            this.show = !this.show;
          },
        },
      });
    </script>
  </body>
</html>
```

- fade-enter{ opacity: 0} 代表动画初始时，相应 dom 元素的 opacity 的值为 0. fade-enter-active 贯穿动画全过程，而样式 .fade-enter-active{ transition: opacity 2s; }的意思是对 opacity 进行监控，如果其改变，则在 2s 内过渡完成 opacity 从 0 到 1。

- 当动画开始执行时，fade-enter 和 fade-enter-active 都存在，此时 opacity 为 0，dom 透明度为 0 处于隐藏状态。
- 执行完第一帧，fade-enter 被移除，opacity 也就改变，恢复为原始的 1. 而监控 opacity 的 fade-enter-active 监听到这个变化，即会在 2s 内完成 opacity 从 0 到 1 的渐进变化，从而实现过渡动画的效果。

- 至于 leave，同理。

## 基础

### 基础

`<transition>` 是一个内置的组件，用于添加过渡效果到元素或组件的进入和离开时期。Vue 的过渡系统基于 CSS 过渡和动画，它提供了在元素被添加或删除时应用 CSS 类的方法，以便实现动画效果。
原理如下：

1. 定义过渡效果的 CSS 类： 首先，您需要在您的 CSS 中定义用于过渡效果的类，通常分为以下几类：
   - .v-enter: 进入时期的起始状态
   - .v-enter-active: 进入时期的结束状态
   - .v-enter-to: 进入时期的结束状态
   - .v-leave: 离开时期的起始状态
   - .v-leave-active: 离开时期的结束状态
   - .v-leave-to: 离开时期的结束状态
2. 在这些类中，您可以定义过渡效果的动画属性，如 opacity、transform、height 等，以控制元素在进入和离开时期的变化。
3. 应用过渡类名： 在 Vue 模板中，使用`<transition>`元素包裹要过渡的内容或组件。通过设置 name 属性，您可以指定用于过渡效果的类名前缀。然后，通过设置 v-if 或 v-show 来控制元素的显示和隐藏。
   在上面的示例中，fade 将作为类名前缀，Vue 会自动应用类名.fade-enter、.fade-enter-active、.fade-enter-to、.fade-leave、.fade-leave-active 和.fade-leave-to，以触发过渡效果。

4. 触发过渡： 当 showElement 的值在 true 和 false 之间切换时，Vue 会自动应用相应的类名，从而触发过渡效果。进入时期的类名在元素进入时期开始时添加，离开时期的类名在元素离开时期开始时添加。

Vue 使用过渡状态机来管理这些类名的添加和移除，确保动画的正确执行。

1. 完成过渡： 一旦过渡完成，Vue 会自动删除不再需要的类名，以确保它们不会影响元素的后续渲染。
   这就是 Vue 中过渡动画的基本原理。您可以根据需要自定义过渡效果，添加更多的 CSS 样式和属性来控制动画的外观和行为。

### out-in 是 Vue.js 过渡模式（mode）之一

用于在切换元素时控制过渡的行为。Vue.js 提供了三种过渡模式:

1. in-out（默认）： 当元素进入时，旧元素会等待新元素进入并完成过渡后才移除。
2. out-in： 当元素离开时，新元素会等待旧元素离开并完成过渡后才进入。
3. in-out-out： 同时在元素进入和离开时都添加延迟，使得两个元素同时存在一段时间。

```js
<transition name="fade" mode="out-in">
  <div v-if="showElement" key="element" class="element">
    Element to transition
  </div>
</transition>
```

### 例子

在这个示例中：

- 我们使用`<transition>`元素包裹了一个`<div>`元素，这个`<div>`是我们要应用过渡效果的元素。
- name 属性设置为"fade"，这将用于构建过渡效果的类名前缀。

- v-if 指令根据 showElement 的值来控制元素的显示和隐藏。

- 当点击"Toggle Element"按钮时，showElement 的值会切换，触发元素的进入和离开过渡。

在 CSS 部分，我们定义了.fade-enter-active 和.fade-leave-active 类，以及.fade-enter 和.fade-leave-to 类，用于定义淡入和淡出的过渡效果。我们还为元素定义了.element 类，以设置其背景颜色和内边距。

这是一个简单的 Vue.js 过渡动画示例，通过点击按钮，您可以看到元素的淡入和淡出效果。

```js
<template>
  <div>
    <button @click="toggleElement">Toggle Element</button>

    <transition name="fade" mode="out-in">
      <div v-if="showElement" key="element" class="element">
        Element to transition
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showElement: false
    };
  },
  methods: {
    toggleElement() {
      this.showElement = !this.showElement;
    }
  }
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.element {
  background-color: lightblue;
  padding: 10px;
}
</style>
```
