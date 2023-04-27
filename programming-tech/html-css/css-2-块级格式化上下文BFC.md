---
title: 块级格式化上下文BFC
sidebar_position: 2
---

## BFC 是什么
BFC:“块级格式化上下文（Block Formatting Context）”。它是网页布局设计中的一个概念，描述了块级元素的位置和相互作用方式。

BFC的实现原理是在一个容器中创建一个独立的渲染区域，这个区域与容器外部的元素互相隔离。

块级格式化上下文是由某些CSS属性或值创建的，例如浮动，绝对或固定定位，以及display值，如inline-block，table-cell或flex。

创建块级格式化上下文时，它会建立一个新的块级格式化上下文，其中包含其子元素。这意味着子元素基于块级格式化上下文的规则进行定位和相互作用，而不是基于父元素或祖先元素的规则。

使用BFC的一些好处包括更好地控制元素的布局和位置，更好地处理浮动，以及更好地处理边距和填充。

### 当一个元素创建了BFC时，它会有如下特性：
BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此

1. 内部的块级元素垂直排列，且各自占据一行；
```
Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠。
```
2. 块级元素的 margin 不会重叠；
```
根据BFC的第二条规则： Box垂直方向的距离由margin决定，属于同一 BFC的两个Box会发生margin重叠 因此，可以在其中一个元素上包裹容器， 然后触发其BFC，这样两个元素就不在同一个 BFC，因此就不会发生重叠

子元素设置margin-top或者margin-bottom会影响其父元素，这就是所谓的margin穿透。

出现margin重叠的原因: 同一个BFC里面两个块级元素会出现margin折叠。

解决方式：让两个块级元素不在一个BFC内。
```
3. BFC会阻止浮动元素的重叠；
4. BFC不会被浮动元素所覆盖；
5. BFC可以包含浮动元素，并且自适应高度。

## 怎样才能形成 BFC
1. overflow属性不为visible的块级盒子（overflow为auto、scroll或hidden）；
2. 浮动元素:float值不为none；
3. 绝对定位元素;position 的值不为 relative 和 static,也就是position:absolute或则position:fixed
4. 行内块元素（display为inline-block）；
5. display属性为flex、inline-flex、table-cell、table-caption等；
```
因此通过将其中一个元素display属性设置为inline-block，width设置为100%是比较好的解决方式；既解决了margin穿透问题，又达到与display为block一样的效果。
```
6. 清除浮动（clear: both）
7. ::before 和 ::after 伪元素：当它们设置了 content 属性以外的属性，例如 display: block 时，它们所在的元素会形成 BFC；
8. column-* 属性：例如 column-count、column-width 等；
9. table-* 属性：例如 display: table、table-cell、table-caption 等；

## 作用
### 清除浮动
当一个容器中有浮动元素时，该容器可以被定义为BFC来防止其高度坍塌。通过将容器定义为BFC，可以清除浮动并使该容器的高度等于其内部元素的高度。

当一个元素创建了BFC时，它会形成一个隔离的空间，该空间内的元素会按照一定规则进行排列和布局。overflow:hidden属性可以创建BFC，因为它可以触发CSS的“块级盒子化”规则，将元素变为一个块级盒子。

例子：

在一个容器（class为container）中放置了两个浮动元素（class为box1和box2）。由于浮动元素脱离了文档流，容器的高度会坍塌，导致容器高度不够容纳其中的元素。

为了解决这个问题，我们可以将容器定义为BFC，方法是设置其overflow属性为hidden。这样容器就会包含其内部的浮动元素，并将其高度自适应内部元素的高度，从而避免了容器高度坍塌的问题。
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>index</title>
  <style>
    .container {
      /* overflow: hidden; */
      /* 将容器定义为BFC */
      background: yellow;
    }

    .box {
      width: 100px;
      height: 100px;
    }

    .box1 {
      float: left;
      background-color: red;
    }

    .box2 {
      float: left;
      background-color: blue;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="box box1">
      <div>hello</div>
    </div>
    <div class="box box2">
      <div>hello 2</div>
    </div>
  </div>
</body>

</html>
```

### 避免 margin 重叠
在两个相邻的块级元素之间，如果它们的margin相遇，则它们的margin会合并，造成不必要的空白。可以通过将其中一个元素定义为BFC来避免这种margin合并现象。
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>index</title>
  <style>
    .parent {
      overflow: hidden;
    }

    .child {
      height: 50px;
      margin: 10px;
      background-color: gray;
    }
  </style>
</head>

<body>
  <div class="parent">
    <div class="child"></div>
    <div class="child"></div>
  </div>
</body>

</html>
```

### 创建自适应两栏布局
可以将一个容器定义为BFC，然后在其中放置两个元素，一个使用float属性向左浮动，另一个则不使用float属性。这样就可以创建一个自适应的两栏布局。
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>index</title>
  <style>
    .container {
      /* overflow: hidden; */
      background: yellow;
    }

    .left {
      float: left;
      width: 70%;
      height: 100px;
      background-color: gray;
    }

    .right {
      /* overflow: hidden; */
      background-color: lightgray;
      height: 100px;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="left"></div>
    <div class="right"></div>
  </div>
</body>

</html>
```

### 解决父元素高度塌陷
当一个容器中有浮动元素或绝对定位元素时，该容器的高度将塌陷，导致内容溢出。可以将该容器定义为BFC来解决这个问题，使得该容器的高度能够自适应其内部元素的高度。
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>index</title>
  <style>
    .parent {
      border: 1px solid black;
      overflow: hidden;
      /* 创建BFC */
    }

    .child1 {
      float: left;
      width: 50%;
      height: 200px;
      background-color: yellow;
    }

    .child2 {
      float: left;
      width: 50%;
      height: 300px;
      background-color: pink;
    }
  </style>
</head>

<body>
  <div class="parent">
    <div class="child1">Child 1</div>
    <div class="child2">Child 2</div>
  </div>
</body>

</html>
```

### 避免嵌套元素的影响
在嵌套元素的情况下，如果外部元素定义为BFC，则可以避免内部元素影响外部元素，从而更好地控制布局。

修复前:
在这个例子中，父元素.parent创建了BFC，使得它的子元素.child1、.child2和.child3都不会影响到它的高度。但是，.child3中嵌套了一个元素.grandchild，如果不进行处理，它会影响到.child3的高度。

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>index</title>
  <style>
    .parent {
      border: 1px solid black;
      overflow: hidden;
      /* 创建BFC */
    }

    .child1,
    .child2 {
      float: left;
      width: 50%;
      height: 200px;
      background-color: yellow;
    }

    .child3 {
      margin-top: 20px;
      height: 100px;
      background-color: pink;
    }

    .grandchild {
      height: 50px;
      background-color: green;
    }
  </style>
</head>

<body>
  <div class="parent">
    <div class="child1">Child 1</div>
    <div class="child2">Child 2</div>
    <div class="child3">
      Child 3
      <div class="grandchild">Grandchild</div>
    </div>
  </div>
</body>

</html>
```

修复后:

为了解决这个问题，我们可以给.child3也创建一个BFC，这样它的子元素.grandchild就不会影响到它的高度。具体的做法是，在.child3中添加一个内部元素，并将它的overflow属性设置为hidden，如下所示：

在上面的代码中，我们给.child3添加了一个内部元素.child3-inner，并将它的高度设置为100%，这样它就和.child3的高度一样了。然后，我们给.child3的overflow属性设置为hidden，这样.child3-inner就创建了一个新的BFC，不会影响到.child3的高度。最后，我们将.grandchild放在.child3-inner中，这样它就不会影响到.child3的高度了。

这样处理之后，父元素.parent的高度仍然是400px，即它的最高的子元素.child2的高度。同时，.child3的高度也正确地被计算为100px，并且.grandchild也能正确地显示。
```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>index</title>
  <style>
    .child3 {
      margin-top: 20px;
      height: 100px;
      background-color: pink;
      overflow: hidden;
      /* 创建BFC */
    }

    .child3-inner {
      height: 100%;
      background-color: transparent;
    }

    .grandchild {
      height: 50px;
      background-color: green;
    }
  </style>
</head>

<body>
  <div class="parent">
    <div class="child1">Child 1</div>
    <div class="child2">Child 2</div>
    <div class="child3">
      Child 3
      <div class="grandchild">Grandchild</div>
    </div>
  </div>
</body>

</html>
```

### 总结
以上例子都体现了： BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

因为BFC内部的元素和外部的元素绝对不会互相影响，因此,当BFC外部存在浮动时，它不应该影响BFC内部Box的布局，BFC会通过变窄，而不与浮动有重叠。同样的，当BFC内部有浮动时，为了不影响外部元素的布局，BFC计算高度时会包括浮动的高度。避免margin重叠也是这样的一个道理。


## BFC 规则
1. 内部的元素会在垂直方向，从顶部开始一个接一个地放置。 

2. 元素垂直方向的距离由margin决定。属于同一个BFC的两个相邻 元素的margin会发生叠加

3. 都是从最左边开始的。每个元素的margin box的左边，与包含块border box的左边(对于从左往右的格式化，否则相反)。即使存在浮动也是如此

4. BFC的区域不会与float box叠加。 

5. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然。 

6. 计算BFC的高度时，浮动元素也参与计算（当BFC内部有浮动时，为了不影响外部元素的布局，BFC计算高度时会
包括浮动元素的高度）


### 例子-利用BFC避免margin重叠
以下产生了塌陷：
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

### 例子-自适应两栏布局
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

### 例子-清除浮动
问题点：当我们不给父节点设置高度，子节点设置浮动的时候，会发生高度塌陷，这个时候我们就要清除浮动。
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
