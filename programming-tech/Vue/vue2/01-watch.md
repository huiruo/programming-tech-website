## watch使用
```js
// WatcherSource: 用于指定要侦听的响应式数据源。侦听器数据源可以是返回值的 getter 函数，也可以直接是 ref
// Callback: 执行的回调函数，可依次接收当前值newValue，先前值oldValue作为入参。
// WatchOptions：deep、immediate、flush可选。
/*
                当需要对响应式对象进行深度监听时，设置deep: true。

                默认情况下watch是惰性的，当我们设置immediate: true时，watch会在初始化时立即执行回调函数。

                flush 选项可以更好地控制回调的时间。它可设置为 pre、post 或 sync。

                默认值是 pre，指定的回调应该在渲染前被调用。
                post 值是可以用来将回调推迟到渲染之后的。如果回调需要通过 $refs 访问更新的 DOM 或子组件，那么则使用该值。
                如果 flush 被设置为 sync，一旦值发生了变化，回调将被同步调用（少用，影响性能）。
*/
watch(WatcherSource, Callback, [WatchOptions])

type WatcherSource<T> = Ref<T> | (() => T) 

interface WatchOptions extends WatchEffectOptions {
    deep?: boolean // 默认：false 
    immediate?: boolean // 默认：false 
    flush?: string // 默认：'pre'
}
```

## 1-1.基础用法1:看实例

## 1-2.其他用法
侦听器数据源可以是返回值的 getter 函数，也可以直接是 ref。我们可以利用给watch函数取名字，然后通过执行名字()函数来停止侦听。
```html
<script setup>
  import { watch, ref, reactive } from 'vue'
  // 侦听一个 getter
  const person = reactive({name: 'name1'})
  watch(
    () => person.name,
    (value, oldValue) => {
      console.log(value, oldValue)
    }, {immediate:true}
  )
  person.name = 'name2'

  // 直接侦听ref
  const ageRef = ref(16)
  const stopAgeWatcher = watch(ageRef, (value, oldValue) => {
    console.log(value, oldValue)
    if (value > 18) {
      stopAgeWatcher() // 当ageRef大于18，停止侦听
    }
  })

  const changeAge = () => {
    ageRef.value += 1
  }
</script>
```

## 1-3.监听多个数据源
现象：以上，当我们在同一个函数里同时改变name和age两个侦听源，watch的回调函数只触发了一次；当我们在name和age的改变之间增加了一个nextTick，watch回调函数触发了两次。

结论：我们可以通过watch侦听多个数据源的变化。如果在同一个函数里同时改变这些被侦听的来源，侦听器只会执行一次。若要使侦听器执行多次，我们可以利用 nextTick ，等待侦听器在下一步改变之前运行。
```html
<script setup>
  import {ref, watch, nextTick} from 'vue'

  const name = ref('name 1')
  const age = ref(25)

  watch([name, age], ([name, age], [prevName, prevAge]) => {
    console.log('newName', name, 'oldName', prevName)
    console.log('newAge', age, 'oldAge', prevAge)
  })

  // 如果你在同一个函数里同时改变这些被侦听的来源，侦听器只会执行一次
  const change1 = () => {
    name.value = 'name 2'
    age.value += 2
  }

  // 用 nextTick 等待侦听器在下一步改变之前运行,侦听器执行了两次
  const change2 = async () => {
    name.value = 'name 3'
    await nextTick()
    age.value += 2
  }
</script>
```

## 1-3.侦听引用对象（数组Array或对象Object）
现象：当将引用对象采用ref形式定义时，如果不加上deep:true，watch是侦听不到值的变化的；而加上deep:true，watch可以侦听到数据的变化，但是当前值和先前值一样，即不能获取先前值。

当将引用对象采用reactive形式定义时，不作任何处理，watch可以侦听到数据的变化，但是当前值和先前值一样。两种定义下，把watch的数据源写成getter函数的形式并进行深拷贝返回，可以在watch回调中同时获得当前值和先前值。

结论： 当我们使用watch侦听引用对象时:
* 若使用ref定义的引用对象：
    * 只要获取当前值，watch第一个参数直接写成数据源，另外需要加上deep:true选项
    * 若要获取当前值和先前值，需要把数据源写成getter函数的形式，并且需对数据源进行深拷贝
* 若使用reactive定义的引用对象：
    * 只要获取当前值，watch第一个参数直接写成数据源，可以不加deep：true选项
    * 若要获取当前值和先前值，需要把数据源写成getter函数的形式，并且需对数据源进行深拷贝
```html
<template>
  <div>
    <div>ref定义数组：{{arrayRef}}</div>
    <div>reactive定义数组：{{arrayReactive}}</div>
  </div>
  <div>
    <button @click="changeArrayRef">改变ref定义数组第一项</button>
    <button @click="changeArrayReactive">改变reactive定义数组第一项</button>
  </div>
</template>

<script setup>
  import {ref, reactive, watch} from 'vue'

  const arrayRef = ref([1, 2, 3, 4])
  const arrayReactive = reactive([1, 2, 3, 4])

  // ref not deep, 不能深度侦听
  const arrayRefWatch = watch(arrayRef, (newValue, oldValue) => {
    console.log('newArrayRefWatch', newValue, 'oldArrayRefWatch', oldValue)
  })

  // ref deep， 深度侦听，新旧值一样
  const arrayRefDeepWatch = watch(arrayRef, (newValue, oldValue) => {
    console.log('newArrayRefDeepWatch', newValue, 'oldArrayRefDeepWatch', oldValue)
  }, {deep: true})

  // ref deep, getter形式 ， 新旧值不一样
  const arrayRefDeepGetterWatch = watch(() => [...arrayRef.value], (newValue, oldValue) => {
    console.log('newArrayRefDeepGetterWatch', newValue, 'oldArrayRefDeepGetterWatch', oldValue)
  })

  // reactive，默认深度监听，可以不设置deep:true, 新旧值一样
  const arrayReactiveWatch = watch(arrayReactive, (newValue, oldValue) => {
    console.log('newArrayReactiveWatch', newValue, 'oldArrayReactiveWatch', oldValue)
  })

  // reactive，getter形式 ， 新旧值不一样
  const arrayReactiveGetterWatch = watch(() => [...arrayReactive], (newValue, oldValue) => {
    console.log('newArrayReactiveFuncWatch', newValue, 'oldArrayReactiveFuncWatch', oldValue)
  })

  const changeArrayRef = () => {
    arrayRef.value[0] = 3
  }
  const changeArrayReactive = () => {
    arrayReactive[0] = 6
  }
</script>
```