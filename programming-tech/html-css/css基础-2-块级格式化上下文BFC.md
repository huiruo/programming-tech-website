---
title: 块级格式化上下文BFC
sidebar_position: 2
---

## BFC 是什么
FC 是 formatting context 缩写
```
它是页面中的一块渲染区域，有一套渲染规则，决定了其子元素如何布局，以及和其他元素之间的关系和作用。

它决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。

最常见的 Formatting context 有 Block formatting context (简称BFC)和 Inline formatting context (简称IFC)。

Box 是 CSS 布局的对象和基本单位， 直观点来说，就是一个页面是由很多个 Box 组成的。元素的类型和 display 属性，决定了这个 Box 的类型。 不同类型的 Box， 会参与不同的 Formatting Context（一个决定如何渲染文档的容器），因此Box内的元素会以不同的方式渲染。
```


### 总结
以上例子都体现了： BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

因为BFC内部的元素和外部的元素绝对不会互相影响，因此,当BFC外部存在浮动时，它不应该影响BFC内部Box的布局，BFC会通过变窄，而不与浮动有重叠。同样的，当BFC内部有浮动时，为了不影响外部元素的布局，BFC计算高度时会包括浮动的高度。避免margin重叠也是这样的一个道理。

### BFC布局规则: BFC是一个绝对的独立空间，它的内部元素是不会影响到外部元素的
```
内部的Box会在垂直方向，按照从上到下的方式逐个排列。

Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠

每个元素的margin box的左边，与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此

BFC的区域不会与float box重叠

BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此

计算BFC的高度时，浮动元素的高度也参与计算
```


## 怎样才能形成 BFC
- 1.float 的值不为 none。

- 2.overflow 的值不为 visible
也就是：overflow:hidden、auto、scroll

- 3.display 的值为 table-cell, table-caption, inline-block 中的任何一个

- 4.position 的值不为 relative 和 static
也就是position:absolute或则position:fixed
```
因此通过将其中一个元素display属性设置为inline-block，width设置为100%是比较好的解决方式；既解决了margin穿透问题，又达到与display为block一样的效果。
```

## BFC 规则
```
1.内部的元素会在垂直方向，从顶部开始一个接一个地放置。 

2.元素垂直方向的距离由margin决定。属于同一个BFC的两个相邻 元素的margin会发生叠加

3.都是从最左边开始的。每个元素的margin box的左边，与包含块border box的左边(对于从左往右的格式化，否则相反)。即使存在浮动也是如此

4.BFC的区域不会与float box叠加。 

5.BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然。 

6.计算BFC的高度时，浮动元素也参与计算（当BFC内部有浮动时，为了不影响外部元素的布局，BFC计算高度时会
包括浮动元素的高度）
```

## BFC 的作用
```
1.解决margin叠加问题
根据BFC的第二条规则： Box垂直方向的距离由margin决定，属于同一 BFC的两个Box会发生margin重叠 因此，可以在其中一个元素上包裹容器， 然后触发其BFC，这样两个元素就不在同一个 BFC，因此就不会发生重叠

2.用于清除浮动， 根据BFC的第六条规则：计算BFC的高度时，浮动元素也参与计算

3.自适应两栏布局
根据BFC的第三条规则： 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左 往右的格式化，否则相反)。即使存在浮动也是如此。 且根据BFC的第四条规则：BFC的区域不会与float box叠加
```

### 1.利用BFC避免margin重叠。
以下产生了塌陷：根据：Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>防止margin重叠</title>
</head>
<style>
*{
    margin: 0;
    padding: 0;
}
p {
    color: #f55;
    background: yellow;
    width: 200px;
    line-height: 100px;
    text-align:center;
    margin: 30px;
}
</style>
<body>
    <p>看看我的 margin是多少</p>
    <p>看看我的 margin是多少,注意上margin合并了</p>
    ===================
    <div>
        <p>看看我的 margin是多少</p>
        <div style="overflow: auto;">
            <p>看看我的 margin是多少</p>
        </div>
    </div>
</body>
</html>

解决： 以我们可以设置，两个不同的BFC，也就是我们可以让把第二个p用div包起来，然后激活它使其成为一个BFC
```

### 自适应两栏布局:
每个盒子的margin box的左边，与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<style>
    .left {
        width: 100px;
        height: 150px;
        float: left;
        background: rgb(139, 214, 78);
    }
 
    .right {
        height: 300px;
        background: rgb(170, 54, 236);
        text-align: center;
        line-height: 300px;
        font-size: 40px;
    }
</style>
<body>
    <div class="left">LEFT-->BFC的区域不会与float box重叠。</div>
    <div class="right">RIGHT</div>
</body>
</html>
```

解决：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<style>
    .left {
        width: 100px;
        height: 150px;
        float: left;
        background: rgb(139, 214, 78);
    }
 
    .right {
        overflow: auto;
        height: 300px;
        background: rgb(170, 54, 236);
        text-align: center;
        line-height: 300px;
        font-size: 40px;
    }
</style>
<body>
    <div class="left">LEFT-->BFC的区域不会与float box重叠。</div>
    <div class="right">RIGHT</div>
</body>
</html>
```

### 3.清楚浮动
问题点：当我们不给父节点设置高度，子节点设置浮动的时候，会发生高度塌陷，这个时候我们就要清楚浮动。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>清除浮动</title>
</head>
<style>
    .par {
        border: 5px solid rgb(91, 243, 30);
        width: 300px;
    }
    .child {
        border: 5px solid rgb(233, 250, 84);
        width:100px;
        height: 100px;
        float: left;
    }
</style>
<body>
    <div class="par">
        <div class="child"></div>
        <div class="child"></div>
    </div>
</body>
</html>
```

解决：计算BFC的高度时，浮动元素也参与计算。
给父节点激活BFC
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>清除浮动</title>
</head>
<style>
    .par {
        border: 5px solid rgb(91, 243, 30);
        width: 300px;
        overflow: hidden;
    }
    .child {
        border: 5px solid rgb(233, 250, 84);
        width:100px;
        height: 100px;
        float: left;
    }
</style>
<body>
    <div class="par">
        <div class="child"></div>
        <div class="child"></div>
    </div>
</body>
</html>
```

