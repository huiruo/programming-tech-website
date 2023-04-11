# 过渡动画实现原理
```
过渡动画实现的原理

1.首先最基础的一点在于 如果你想要在单元素/单个组件之中实现过渡动画 那么 你需要在元素/组件所在的HTML标签之外包裹一层  <transition>标签

2.当元素/组件被<transition>标签包裹了以后 那么Vue会自动的为我们构建一个动画流程 具体的流程会在下文提到 因此先记住这句话就行啦 也就是说 如果你在<style>标签中添加了一些样式的话Vue会自动的在某个时间节点给元素或者组件添加、删除对应的样式

3.上面提到了当元素/组件被<transition>标签包裹的时候Vue会自动的构建动画流程 也就是自动的在某个时间节点添加/删除对应的CSS类名 Vue其实提供了6个对应的类名 这里借助官网的一张图来罗列
```

```原理参考：https://www.jb51.net/article/152018.htm
当我们用<transition>标签包裹了元素/组件的时候 
Vue会在动画即将开始还没开始的时候添加两个CSS类名 分别是v-enter/v-enter-to

当动画开始的瞬间v-enter被自动的移除 
而v-enter-active这个class会一直存在于整个动画过程中 直到动画结束的时候跟v-enter/v-enter-to一起被自动删除
```
## 实例：
```css
<style>
 .v-enter,
 .v-leave-to {
  opacity: 0;
 }
 .v-enter-active,
 .v-leave-active {
  transition: opacity 3s;
 }
</style>
上文已经提到 当进场动画触发的时候 v-enter会立马被移除 因此在样式里把opacity写成0 也就是说 原本页面上没有显示但是即将要显示这个元素的时候 opacity会变为1 而v-enter-active全程都在监听transition:opacity的变化 如果变化了 就让效果在3秒内结束 反之退场动画也是同样的 v-leave-to会在动画执行的时候被添加 这个时候 v-leave-active感知到了transition:opacity的变化 会在3秒内做出对应的改变 最终代码运行结果如下
```


# 过渡的类名
```
	在进入/离开的过渡中，会有 6 个 class 切换。
v-enter：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。

v-enter-active：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。

v-enter-to：2.1.8 版及以上定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 v-enter 被移除)，在过渡/动画完成之后移除。

v-leave：定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。

v-leave-active：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。

v-leave-to：2.1.8 版及以上定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 v-leave 被删除)，在过渡/动画完成之后移除。
```

# 过渡动画案例
```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vue中的css动画原理</title>
  <script src="https://cdn.bootcss.com/vue/2.5.17-beta.0/vue.js"></script>
  <style>
    .fade-enter {
      opacity: 0;
    }
    .fade-enter-active {
      transition: opacity 2s;
    }
    .fade-leave-to {
      opacity: 0;
    }
    .fade-leave-active {
      transition: opacity 2s;
    }
  </style>
</head>
<body>
  <div id="app">
    <transition name="fade">
      <div v-if="show">
        hello world
      </div>
    </transition>

    <button @click="handleClick">切换</button>
  </div>

  <script>
    var vm = new Vue({
      el: "#app",
      data: {
        show: true
      },
      methods: {
        handleClick: function(){
          this.show = ! this.show
        }
      }
    })
  </script>
</body>
</html>
```
# 动画钩子
before-enter 会接收到一个参数 el ，即指的是动画 transition 包裹的标签。
```js
<div id="app">
	<transition name="fade" @before-enter="handleBeforeEnter">
	  <div v-show="show">
	    hello world
	  </div>
	</transition>
	<button @click="handleClick">切换</button>
</div>
var vm = new Vue({
      el: "#app",
      data: {
        show: true
      },
      methods: {
        handleClick: function(){
          this.show = ! this.show
        },
        // 接收到一个参数 el  代指被包裹的标签 
        handleBeforeEnter: function(el){
          el.style.color = 'red'
        }
      }
    })
```

enter:enter 会接收两个参数，一个为 el，指的仍然是动画 transition 包裹的标签。 一个为 done，是一个回调函数。
```js
<div id="app">
    <transition name="fade" @before-enter="handleBeforeEnter" @enter="handleEnter">
      <div v-show="show">
        hello world
      </div>
    </transition>
    <button @click="handleClick">切换</button>
</div>
var vm = new Vue({
  el: "#app",
  data: {
    show: true
  },
  methods: {
    handleClick: function(){
      this.show = ! this.show
    },
    handleBeforeEnter: function(el){
      el.style.color = 'red'
    },
    handleEnter: function(el, done){
      setTimeout(() => {
        el.style.color = 'green'
        done()
      },2000)
    }
  }
})
```
# after-enter:after-enter 也要接收到参数el
# 出场动画的钩子函数为 before-leave 、leave 和 after-leave
