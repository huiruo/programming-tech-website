## Vue中transition过渡动画的原理:

文档：https://cn.vuejs.org/v2/guide/transitions.html

当一个dom元素被包裹在transition标签中，vue会自动分析元素的css样式，构建如图4所示的动画流程，不同阶段有不同的状态。

在动画即将开始时，会往相应dom元素上增加两个class（即 fade-enter 和 fade-enter-active ）；当动画执行完第一帧，进行到第二帧的时候，会去掉 fade-enter，并增加 fade-enter-to；当动画执行到最后，会将 fade-enter-active 和 fade-enter-to 都移除。

![Minion](https://upload-images.jianshu.io/upload_images/16121135-06d54400cca18ca9.png?imageMogr2/auto-orient/strip|imageView2/2/w/820/format/webp)

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Hello World</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>
<style>
.fade-enter {
    opacity: 0;
}

.fade-enter-active {
    transition: opacity .5s;
}

.fade-enter-to {}

.fade-leave {}

.fade-leave-active {
    transition: opacity .5s;
}

.fade-leave-to {
    transition: opacity .5s;
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
        el: '#app',
        data: {
            show: true
        },
        methods: {
            handleClick: function() {
                this.show = !this.show
            }
        }
    });
    </script>
</body>

</html>
```
 fade-enter{ opacity: 0} 代表动画初始时，相应dom元素的 opacity 的值为0. fade-enter-active贯穿动画全过程，而样式 .fade-enter-active{ transition: opacity 2s; }的意思是对 opacity进行监控，如果其改变，则在 2s 内过渡完成 opacity从 0 到 1。

（I）当动画开始执行时，fade-enter 和 fade-enter-active 都存在，此时opacity为0，dom 透明度为0处于隐藏状态。         
(II) 执行完第一帧，fade-enter被移除，opacity也就改变，恢复为原始的1. 而监控 opacity 的 fade-enter-active 监听到这个变化，即会在 2s 内完成 opacity 从0到 1 的渐进变化，从而实现过渡动画的效果。
至于leave，同理。

## 过渡的类名
在进入/离开的过渡中，会有 6 个 class 切换。

* v-enter：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。

* v-enter-active：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。

* v-enter-to：2.1.8 版及以上定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 v-enter 被移除)，在过渡/动画完成之后移除。

* v-leave：定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。

* v-leave-active：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。

* v-leave-to：2.1.8 版及以上定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 v-leave 被删除)，在过渡/动画完成之后移除。

1. CSS 过渡-transition
2. css 动画-animation：CSS 动画用法同 CSS 过渡，区别是在动画中 v-enter 类名在节点插入 DOM 后不会立即删除，而是在 animationend 事件触发时删除

## JavaScript 钩子:可以在 attribute 中声明 JavaScript 钩子
这些钩子函数可以结合 CSS transitions/animations 使用，也可以单独使用。
```html
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"

  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```
```js
// ...
methods: {
  // --------
  // 进入中
  // --------

  beforeEnter: function (el) {
    // ...
  },
  // 当与 CSS 结合使用时
  // 回调函数 done 是可选的
  enter: function (el, done) {
    // ...
    done()
  },
  afterEnter: function (el) {
    // ...
  },
  enterCancelled: function (el) {
    // ...
  },

  // --------
  // 离开时
  // --------

  beforeLeave: function (el) {
    // ...
  },
  // 当与 CSS 结合使用时
  // 回调函数 done 是可选的
  leave: function (el, done) {
    // ...
    done()
  },
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled 只用于 v-show 中
  leaveCancelled: function (el) {
    // ...
  }
}
```
