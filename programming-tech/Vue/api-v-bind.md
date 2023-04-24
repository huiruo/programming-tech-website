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
