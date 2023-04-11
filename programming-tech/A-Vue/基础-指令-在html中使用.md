---
title: 基础-指令-在html中使用
sidebar_position: 11
---

## 常用vue 指令
v-text：更新元素的 textContent。如果要更新部分的 textContent ，需要使用 {{ Mustache }} 插值。

v-html：更新元素的 innerHTML

v-show：------->切换元素的 display CSS 属性。block为显示，none为隐藏

v-if：------->控制dom节点的存在与否来控制元素的显隐

v-else：表示否则（与编程语言中的else是同样的意思）

v-else-if：（与编程语言中的else if是同样的意思）

v-for：可以循环数组，对象，字符串，数字，

v-on：绑定事件监听器。事件类型由参数指定。

v-bind：动态地绑定一个或多个属性（特性），或一个组件 prop 到表达式。

v-model：在表单控件或者组件上创建双向绑定

v-pre：跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签。跳过大量没有指令的节点会加快编译。

v-cloak：这个指令保持在元素上直到关联实例结束编译。和 CSS 规则如 [v-cloak] { display: none } 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。

v-once:只渲染元素和组件一次。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。

## 4.  v-for v-if :src
```html
<div class="supplier_tabcur1" style="width: 1200px;margin: 0 auto;">
  <div v-if="isHaveBanner" v-for="(item,key) in company_banner" :key="key" style="min-height:300px">
  <img :src="picUrl+item" width="80%" height="auto" />
  </div>
  <div v-if="!isHaveBanner" style="height:500px;">
  <div style="display: inline-block;">
    <div>
    <div style="margin-top:20%">
      <img src="/images/frontend/supplier/noData.svg" width="100%" height="300px" />
      <span>商家还未上传简介</span>
    </div>
    </div>
  </div>
  </div>
</div>
```

## 0.动态加载  :class    2019.9.25
```html
<div @click="pay" class="contentButton">
  <div :class="totalCount0?'enough pay':'not-enough pay'"确定选择</div>
</div>
```


## 1. :href ref
```html
  <div ref="detail_propertable_right" class="detail_propertable_right">
   <a :href="'/plastic/detail?id='+uuid+'.html'" target="_blank">
    <img src="/images/frontend/supplier/propertable1.svg" width="30" height="20" />
    <span>物性表</span>
   </a>
  </div>
  
  //操作
   _this.$refs.detail_propertable_right.style.display = "block";
```

## click绑定
```js
 <el-button type="danger" @click="commitB" :disabled="this.checkList.length?false:true"确定></el-button>
   methods: {
    selectChange: function(item, value) {
      console.log(item);
      console.log(value);
      if (value == true) {
        app.selectedId.push(item.uid);
      }
    },
    commitB() {
      alert(223);
    }
  }
```
