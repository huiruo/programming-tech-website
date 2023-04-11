---
title: flex-direction-wrap
sidebar_position: 4
---

### flex-flow 属性:flex-flow 属性是 flex-direction 和 flex-wrap 属性的复合属性。
- flex-direction 属性规定灵活项目的方向。 flex-direction 值：
```
row
row-reverse
column
column-reverse
initial
inherit
默认值是 "row"。
规定灵活项目的方向。
```

- flex-wrap 属性规定灵活项目是否拆行或拆列。
```
nowrap  默认值。规定灵活的项目不拆行或不拆列。
wrap  规定灵活的项目在必要的时候拆行或拆列。
wrap-reverse  规定灵活的项目在必要的时候拆行或拆列，但是以相反的顺序。
initial 设置该属性为它的默认值。请参阅 initial。
inherit 从父元素继承该属性。请参阅 inherit。
```

### flex-wrap:

```html
<style type="text/css">
.ie-clss {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  color: red;
  .moments-item {
    margin-right: 15px;
    width: calc((100% - 16px * 5) / 5);
  }
}
.ie-clss:after {
  content: "";
  flex: auto;
}
</style>
```