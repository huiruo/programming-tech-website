## 前言
* emits是首先在子组件声明，父组件引用
* attrs则是先由父组件在子组件上自定义事件，子组件通过查看父组件的attrs来使用。

这样的差异让我们可以根据一个事件的使用方式和特点来决定使用哪种方法：

1. 当一个组件经常需要通过自定义事件和父组件通信时，可以使用emits

2. 当一个父组件可能需要通过自定义事件和子组件通讯且并不是经常时，可以使用attrs。但是注意，由于父组件可能不会通过自定义事件和子组件通信，所以需要判断是否存在相应的attrs（不判断会出现undefined的错误）


## 官方建议
强烈建议使用 emits 记录每个组件所触发的所有事件。
```
因为我们移除了 .native 修饰符。任何未在 emits 中声明的事件监听器都会被算入组件的 $attrs，并将默认绑定到组件的根节点上。
```

在Vue3中，移除.native修饰符后，所有的事件其实都会记录在都组件的attrs上，无论是不是自定义组件。

所以，如果需要区分自己的自定义事件和原生事件，最好还是使用emits来定义每一个组件触发的事件。同时，其实所有的事件，只要不在emits中声明，都会默认绑定在父组件的attrs上，并不仅限于自定义的事件。

## emit和Attrs使用例子
父组件:
```javaScript
<template>
  <div>
    组件1（加上fun事件，但不在emits中声明）
    <com-one-vue @fun = 'call'/>
  </div>
  <div>
    组件1（加上fun2事件，在emits中声明）
    <com-one-vue @fun2 = 'call'/>
  </div>
</template>
​
<script setup>
  import { provide, ref } from '@vue/runtime-core';
  import comOneVue from './components/comOne.vue';
  const call = () => {
   console.log('xx')
  }
</script>
```

子组件：
```javaScript
<template>
    <button @click="f">heihei</button>
</template>
​
<script setup>
  import { useAttrs } from "@vue/runtime-core";
  const emits = defineEmits(['fun2'])
  const { onFun } = useAttrs()
  const f = () => {
     if (onFun) {
        onFun()
      }
     emits('fun2')
  }

  console.log(useAttrs())
</script> 
```

在这种情况下，这两种用法带来的效果是没有什么不同的。

我们点击两个按钮，可以发现，fun和fun2方法都打印出了结果

在两个组件1中，由于第一个组件1的自定义方法fun没有在emits中声明，所以在其的$attrs上出现了onFun，其类型是一个方法。

而在第二个的组件1上,我们定义了自定义方法fun2，由于在一开始我们已经在子组件中定义了fun2，所以在第二个组件1上没有将fun2添加到$attrs上。

注意，这里虽然这两个组件都是组件1，但是其的自定义事件是不会互相影响的，这也是fun自定义方法没有出现在第二个组件1上的$attrs上的原因。



