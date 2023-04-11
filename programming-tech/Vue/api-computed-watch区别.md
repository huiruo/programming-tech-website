---
title: api-computed-watch区别
sidebar_position: 8
---

## computed 和 watch 的区别
* computed: computed是用来计算一个属性的值,根据依赖自动缓存，依赖不变的时候，值不会重新计算

* 如果一个值依赖多个属性（多对一），用computed肯定是更加方便的。

* 需要注意的是，前提是computed里的值必须要在模板里使用才行,不是说我们更改了getter里使用的变量，就会触发computed的更新，。

## watch 特性
* 不支持缓存，数据变，直接会触发相应的操作
* 具有一定的惰性，第一次页面展示的时候不会执行，只有数据变化的时候才会执行但可以通过配置immediate为true, 来指定初始时立即执行第一次
* 可以同时监听多个数据的变化
* 如果一个值变化后会引起一系列操作，或者一个值变化会引起一系列值的变化（一对多），用watch更加方便一些。
* watch 支持异步代码而 computed 不支持。

注意:
1. 监视reactive定义的响应式数据时，oldValue无法正确获取，强制开启了深度监视（deep配置失效）
2. 监视reactive定义的响应式数据中某个属性时，deep配置有效。


## watchEffect有点像computed:
1.computed注重的计算出来的值（回调函数的返回值），所以必须要写返回值
2.watchEffect更注重的是过程（回调函数的函数体），所以不用写返回值
```
1. 首次加载就会监听

2. 不需要指定监听的数据，组件初始化的时候就会执行一次用以收集依赖，而后收集到的依赖发生变化，这个回调才会再次执行

3. 不用指明监视哪个属性，监视的回调中用到哪个属性，那就监视哪个属性
不需要手动传入依赖

4. 页面的首次加载就会执行一次回调函数，来自动获取依赖
无法获取到原值，只能得到最新值
```

## computed 用法
computed 预设只有 getter ，也就是只能读取，不能改变设值。
vue 2中：
```js
computed: {
  fullName: function () {
    return this.firstName + ' ' + this.lastName
  }
}

// 其实computed里的代码完整的写法应该是：
computed: {
  fullName: {
    get(){
        return this.firstName + ' ' + this.lastName
    }
  }
}


// setter 使用
// 其执行顺序是setter -> getter -> updated
computed: {
  fullName: {
    //getter 方法
      get(){
          console.log('computed getter...')
          return this.firstName + ' ' + this.lastName
      }，
//setter 方法
      set(newValue){
          console.log('computed setter...')
          var names = newValue.split(' ')
          this.firstName = names[0]
          this.lastName = names[names.length - 1]
          return this.firstName + ' ' + this.lastName
      }
    
  }
},
```