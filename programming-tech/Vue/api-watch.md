---
title: api-watch
sidebar_position: 8
---

## watch 特性
执行时机：watch 的一个特点是，默认最初绑定的时候是不会执行的，要等到值改变时才执行监听计算。 设置immediate为true后，被监听值初始化的时候就会执行监听函数，也就页面上的数据还未变化的时候

* 不支持缓存，数据变，直接会触发相应的操作(无缓存性，页面重新渲染时值不变化也会执行)

* 具有一定的惰性，第一次页面展示的时候不会执行，只有数据变化的时候才会执行,但可以通过配置immediate为true, 来指定初始时立即执行第一次

* 可以同时监听多个数据的变化

* 如果一个值变化后会引起一系列操作，或者一个值变化会引起一系列值的变化（一对多），用watch更加方便一些。

* watch 支持异步代码而 computed 不支持。

可设置属性：
* immediate：组件加载立即触发回调函数执行，
* deep: 深度监听，为了发现对象内部值的变化，复杂类型的数据时使用，例如数组中的对象内容的改变，注意监听数组的变动不需要这么做。
>注意：deep无法监听到数组的变动和对象的新增，参考vue数组变异,只有以响应式的方式触发才会被监听到。

注意:
1. 监视reactive定义的响应式数据时，oldValue无法正确获取，强制开启了深度监视（deep配置失效）
2. 监视reactive定义的响应式数据中某个属性时，deep配置有效。

常用场景：
`watch` 还可以做一些特别的事情，例如监听页面路由，当页面跳转时，我们可以做相应的权限控制，拒绝没有权限的用户访问页面。

## watchEffect有点像computed:
1. computed注重的计算出来的值（回调函数的返回值），所以必须要写返回值
2. watchEffect更注重的是过程（回调函数的函数体），所以不用写返回值
```
1. 首次加载就会监听

2. 不需要指定监听的数据，组件初始化的时候就会执行一次用以收集依赖，而后收集到的依赖发生变化，这个回调才会再次执行

3. 不用指明监视哪个属性，监视的回调中用到哪个属性，那就监视哪个属性
不需要手动传入依赖

4. 页面的首次加载就会执行一次回调函数，来自动获取依赖
无法获取到原值，只能得到最新值
```

## 使用
vue3:
```html
<body>
  <script src="./vue3.global.js"></script>
  <div id="root">
    <div>
      <button v-on:click='onClickText' class="btn">Hello world,Click me</button>
      <span>{{refData.myName}}-{{msg}}-{{info.msg2}}</span>
      <div v-if="showDiv">
        被你发现了
      </div>
    </div>
  </div>
  <script>
    const { ref, reactive, nextTick, watch } = Vue

    Vue.createApp({
      data() {
        return {
          msg: '改变我',
          showDiv: false
        }
      },
      methods: {
        onClickText() {
          console.log('test:', this, '-', this.refData)
          this.msg = '努力'
          this.showDiv = !this.showDiv
          this.info.msg2 = this.showDiv ? '直接点' : '其他选择'
        }
      },

      setup(props) {
        const refData = ref({
          myName: 'Ruo'
        })

        const info = reactive({
          msg2: 'hello',
        });

        const ins = Vue.getCurrentInstance();

        // 监听的函数接收两个参数，第一个参数是最新的值；第二个参数是输入之前的值
        watch(() => info.msg2, (value, oldValue) => {
          console.log('watch value:', value, 'oldValue:', oldValue)
          // immediate: true 表示第一次渲染也会执行
        }, { immediate: true }
        )

        return {
          info,
          refData
        };
      },

    }).mount('#root')
  </script>
</body>
```

vue2:
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
</head>
<body>
  <div id="root">
    <div>
      <button @click="onClickText" class="btn">Hello world, Click me</button>
      <span>{{ msg }} - {{ refData.myName }} - {{ info.msg2 }}</span>
      <div v-if="showDiv">
        被你发现了
      </div>
    </div>
  </div>
  <script>
    new Vue({
      el: '#root',
      data: {
        msg: '改变我',
        showDiv: false,
        refData: {
          myName: 'Ruo'
        },
        info: {
          msg2: 'hello'
        }
      },
      methods: {
        onClickText: function () {
          console.log('test:', this);
          this.msg = '努力';
          this.showDiv = !this.showDiv;
          this.info.msg2 = this.showDiv ? '直接点' : '其他选择';
        }
      },
      watch: {
        'info.msg2': function (value, oldValue) {
          console.log('watch value:', value, 'oldValue:', oldValue);
        }
      }
    });
  </script>
</body>
</html>
```