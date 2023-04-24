---
title: flex
sidebar_position: 7
---

## flex实现左右浮动-justifyContent:space-between
左边一个div，右边一个div，

父元素只需要
```
display:flex;
justify-content:space-between
```

```html
.cell-bottom {
  display: flex;
  justify-content: space-between;
}

<div class="cellBottom">
    <div>{{ cell.price }}</div>
    <div class="cell-bottom">aa</div>
</div>
```

## flex-flow 属性是 flex-direction 和 flex-wrap 属性的复合属性
###  flex-direction 属性规定灵活项目的方向
flex-direction值：
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

###  flex-wrap 属性规定灵活项目是否拆行或拆列
```
nowrap  默认值。规定灵活的项目不拆行或不拆列。
wrap  规定灵活的项目在必要的时候拆行或拆列。
wrap-reverse  规定灵活的项目在必要的时候拆行或拆列，但是以相反的顺序。
initial 设置该属性为它的默认值。请参阅 initial。
inherit 从父元素继承该属性。请参阅 inherit。
```

## flex是:flex-grow,flex-shrink,flex-basis

flex: 0 1 auto; // 默认  不扩大，会缩小，空间自动填充

```text
第一个是 flex-grow 属性， 默认为0； 表示如果存在剩余空间，也不放大
第二个是 flex-shrink属性， 默认为1；表示如果空间不足，该项目会缩小
第三个是 flex-basis属性，  默认为auto； 

表示浏览器会根据这个属性自动推演项目的宽度和高度； 这个值可以写 auto, 10%, 50px
```

写法：
```text
一般这个flex 属性写快捷值， 让浏览器去自动推算项目的相关值:

flex: none;  // 等价于  flex:0 0 auto  表示不扩大，不缩小，自动宽高
flex: auto;  //等价于   flex: 1 1 auto  表示可扩大，可缩小，自动计算宽高
flex: 1;     //等价于   flex: 1 1 0% 表示可扩大， 可缩小，尺寸自动计算
```

不推荐写法：
```
还有其他的写法目前不推荐
flex: 1 1;
flex: 8;  // === flex: 8 1 0%;
```


1.当 flex取值为 auto，则计算值为 1 1 auto，如下是等同的：
```
.item {
  flex: auto;
}
.item {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
}
```

### 1.flex-basis
basis英文意思是<主要成分>，所以他和width放在一起时,肯定把width干掉，basis遇到width时就会说我才是最主要的成分，你是次要成分，所以见到我的时候你要靠边站

flex-basis 和width 如果同时设置， 以flex-basis为准
```css
item {
	width: 30px;
	flex-basis: 200px;
}
```

flex-basis 和 max-width/min-width 如果同时设置, 这会被限制:
```css
item1 {
	flex-basis: 250px;
	max-width: 100px;
}

最后宽度为100px (即max-width最大宽度或最小宽度)
```

### 2.flex-grow
```
grow英文意思是<扩大，扩展，增加>,这就代表当父元素的宽度大于子元素宽度之和时，并且父元素有剩余，这时，flex-grow就会说我要成长，我要长大，怎么样才能成长呢，当然是分享父元素的空间了
```

```
该属性用来设置当父元素的宽度大于所有子元素的宽度的和时（即父元素会有剩余空间），子元素如何分配父元素的剩余空间。 flex-grow的默认值为0，意思是该元素不索取父元素的剩余空间，如果值大于0，表示索取。值越大，索取的越厉害。

 举个例子: 父元素宽400px，有两个子元素：A和B。A宽为100px，B宽为200px。 则空余空间为 400-（100+200）= 100px。 如果A，B都不索取剩余空间，则有100px的空余空间


例子1：
如果A索取剩余空间:设置flex-grow为1，B不索取。则最终A的大小为 自身宽度（100px）+ 剩余空间的宽度（100px）= 200px 。

.inner{
	flex-basis:100px;
	height:100px;
	background:pink;
	flex-grow:1;
}

.inner1{
    flex-basis:200px;
    height:100px;
    background:blue;
}



例子2：
如果A，B都设索取剩余空间，A设置flex-grow为1，B设置flex-grow为2。则最终A的大小为 自身宽度（100px）+ A获得的剩余空间的宽度（100px (1/(1+2))）,最终B的大小为 自身宽度（200px）+ B获得的剩余空间的宽度（100px (2/(1+2))）
.inner{
    flex-basis:100px;
    height:100px;
    background:pink;
    flex-grow:1;
}
.inner1{
    flex-basis:200px;
    height:100px;
    background:blue;
    flex-grow:2;
}
```

### 3.flex-shrink
```
flex-shrink， shrink英文意思是<收缩>，这就代表当父元素的宽度小于子元素宽度之和时，并且超出了父元素的宽度，这时，flex-shrink就会说外面的世界太苦了，我还是回到父亲的怀抱中去吧！因此，flex-shrink就会按照一定的比例进行收缩
```

```
该属性用来设置，当父元素的宽度小于所有子元素的宽度的和时（即子元素会超出父元素），子元素如何缩小自己的宽度的。 flex-shrink的默认值为1，当父元素的宽度小于所有子元素的宽度的和时，子元素的宽度会减小。值越大，减小的越厉害。如果值为0，表示不减小。
```


例子1：
```
举个例子: 父元素宽400px，有两子元素：A和B。A宽为200px，B宽为300px。 则A，B总共超出父元素的宽度为(200+300)- 400 = 100px。 如果A，B都不减小宽度，即都设置flex-shrink为0，则会有100px的宽度超出父元素。 

.box{
  display: flex;
  flex-direction: row;
  margin:100px auto;
  width:400px;
  height:200px;
  border:1px solid red;
}
.inner{
  flex-basis:200px;
  height:100px;
  background:black;
  flex-shrink:0;
}
.inner1{
 flex-basis:300px;
 height:100px;
 background:blue;
 flex-shrink:0;
}


如果A不减小宽度:设置flex-shrink为0，B减小。则最终B的大小为 自身宽度(300px)- 总共超出父元素的宽度(100px)= 200px 
.inner{
	flex-basis:200px;
	height:100px;
	background:black;
	flex-shrink:0;
}
.inner1{
    flex-basis:300px;
    height:100px;
    background:blue;
    flex-shrink:1;
}


如果A，B都减小宽度，A设置flex-shirk为3，B设置flex-shirk为2。则最终A的大小为 自身宽度(200px)- A减小的宽度(100px * (200px * 3/(200 * 3 + 300 * 2))) = 150px,最终B的大小为 自身宽度(300px)- B减小的宽度(100px * (300px * 2/(200 * 3 + 300 * 2))) = 250px;
.inner{
	flex-basis:200px;
	height:100px;
	background:black;
	flex-shrink:3;
}
.inner1{
    flex-basis:300px;
    height:100px;
    background:blue;
    flex-shrink:2;
}
```

## flex实现:头部底部固定-中间自适应并可滚动
```html
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>index</title>
	<style>
		html,
		body {
			height: 100%;
			margin: 0px;
		}

		.wrap {
			width: 100%;
			/* 很重要，如果设置成100%，页面内容过多时不会固定 */
			height: 100vh;
			display: flex;
			flex-direction: column;
			font-size: 16px;
		}

		.header {
			background: aquamarine;
			height: 60px;
		}

		.content {
			display: block;
			/* 很重要，否则当该内容超过一屏时，尾部区域不会固定 */
			overflow-y: auto;
			background: #4CAF50;
		}

		.footer {
			background: tan;
			height: 40px;
		}
	</style>
</head>

<body>
	<div class="wrap">
		<div class="header">头部</div>
		<div class="content">
			<div style='height:600px'>test</div>
			<div style='height:600px'>test</div>
			<div style='height:600px'>test</div>
			<div style='height:600px'>test</div>
		</div>
		<div class="footer">尾部</div>
	</div>
</body>

</html>
```

## flex实现上-中-下-布局
```html
<html>
<style type="text/css">
	body {
		margin: 0;
	}

	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: grey;
	}

	.header {
		width: 100%;
		height: 88px;
		background: yellow;
	}

	.content {
		width: 100%;
		flex: 1 1 auto;
		background: red;
	}

	.footer {
		height: 100px;
		width: 100%;
		background: gold;
	}
</style>

<body>
	<div class="container">
		<div class="header"></div>
		<div class="content">
			<div>hello world</div>
			<div>msg</div>
		</div>
		<div class="footer"></div>
	</div>
</body>

</html>
```

## 头部底部固定-中间自适应-绝对定位
略