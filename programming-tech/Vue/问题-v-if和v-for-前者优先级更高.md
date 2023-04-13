---
title: 问题-v-if和v-for-前者优先级更高
sidebar_position: 12
---

## vue3:v-if 比 v-for 的优先级更高
当它们同时存在于一个节点上时，v-if 比 v-for 的优先级更高。这意味着 v-if 的条件将无法访问到 v-for 作用域内定义的变量别名：
```html
<!--
 这会抛出一个错误，因为属性 todo 此时
 没有在该实例上定义
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

### 解决方案
在外新包装一层`<template>`再在其上使用 v-for 可以解决这个问题 (这也更加明显易读)：
```js
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## vue2中:v-for比v-if优先，即每一次都需要遍历整个数组，影响速度:
```html
<div
  v-for="(fileMsg,index) in fileMsgList"
  :key="fileMsg.id"
  v-if="index < 2"
>
  <sys-file-layout :fileMsg="fileMsg"></sys-file-layout>
</div>
```

想要循环生成一系列组件块，但是不希望生成序号1之后的内容，同时用了v-if和v-for，那么，还是会根据整个数组生成所有组件块，之后才判断v-if让多余的小时，非常耗资源。

### 第一种：解决方案：如果 v-if 和 v-for 只能放在同一级标签中，使用计算属性进行改造：
1、必要情况下应该替换成computed属性:
```html
computed: {
  fileMsgListCom() {
    return this.fileMsgList.filter((item, index) => {
      return item < 2;
    });
  }
} 

<div                                                                  
  class="file_name"                                     
  v-for="(fileMsg,index) in fileMsgListCom"             
  :key="fileMsg.id"                                          
>                                                       
  <sys-file-layout :fileMsg="fileMsg"></sys-file-layout>
</div> 
```

### 第二种：
根据 eslint 指出的方法进行改进：
将 v-if 和 v-for 分别放在不同标签中
```vue
<ul v-if="active">
	<li v-for="item in list" :key="item.id">
		{{ item.title }}
	</li>
</ul>
```

## 关于赋值
vue2 下，this 可以理解成一个大对象，所以怎么修改值都不会切断引用，保持响应性。
vue3 赋值要保持响应，就不要改变引用，否则无法被 proxy 监听