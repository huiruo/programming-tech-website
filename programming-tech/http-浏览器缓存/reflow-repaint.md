---
title: reflow-repaint
sidebar_position: 1
---

## reflow(回流):根据生成的渲染树，进行回流，得到节点的几何信息（位置，大小）
定义：当render tree中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。计算的过程称为回流(reflow)。

规则注意：
> 回流一定会触发重绘，而重绘不一定会回流;在性能优先的前提下，性能消耗 回流 大于 重绘。
```
体现：重绘是某个DOM元素进行重绘；回流是整个页面进行重排，也就是页面所有DOM元素渲染。
```
每个页面至少需要一次回流，就是在页面第一次加载的时候。 在回流的时候，浏览器会使渲染树中受到影响的部分失效，并重新构造这部分渲染树

### 回流这一阶段主要是计算节点的位置和几何信息，当页面布局和几何信息发生变化的时候，就需要回流

比如以下情况:
1. 页面渲染初始化
2. 浏览器窗口大小改变（因为回流是根据视口的大小来计算元素的位置和大小的）
3. 添加、删除可见的dom元素
4. 元素的位置改变
5. 元素的尺寸改变（包括外边距、内边框、边框大小、高度和宽度等）,width/height/border/margin/padding 的修改，如 width=778px；
6. 设置style属性
7. 改变文字大小
8. 添加/删除样式表
9. 操作class属性
10. 内容的改变，(用户在输入框中写入内容也会,比如文本变化或图片被另一个不同尺寸的图片所替代)

## repaint(重绘):根据渲染树以及回流得到的几何信息，得到节点的绝对像素
定义：
通过构造渲染树和回流阶段，我们知道了哪些节点是可见的，以及可见节点的样式和具体的几何信息(位置、大小)，

那么我们就可以将渲染树的每个节点都转换为屏幕上的实际像素，这个阶段就叫做重绘节点。

* color 的修改，如 color=#ddd；
* text-align 的修改，如 text-align=center；

引起Repaint的属性:
```
color	border-style	visibility	background
text-decoration	background-image	background-position	background-repeat
outline-color	outline	outline-style	border-radius
outline-width	box-shadow	background-size
```

## 回流和重绘优化相关-利用浏览器优化策略
浏览器优化策略:

浏览器会维护一个队列，把所有引起重排、重绘的操作放入这个队列，等队列中的操作到了一定数量或时间间隔，浏览器就会flush队列，进行一个批处理。这样让多次的重排重绘变成一次。

但有时候一些特殊的style属性会使这种优化失效。
例如offsetTop, scrollTop, clientTop, getComputedStyle()（IE中currentStyle）等属性，这些属性都是需要实时回馈给用户的几何属性或布局属性，因此浏览器不得不立即执行，并随之触发重排返回正确的值。

此时我们就要
1. 避免设置多项内联样式：使用常用的 class 的方式进行设置样式，以避免设置样式时访问 DOM 的低效率。

2. 减少回流、重绘,可以合并多次对DOM和样式的修改，然后一次处理掉。  
``` javascript
var el = document.querySelector('.el');
el.style.borderLeft = '1px';
el.style.borderRight = '2px';
el.style.padding = '5px';

可以使用内联样式的cssText方法实现：
var el = document.querySelector('.el');
el.style.cssText = 'border-left: 1px; border-right: 2px; padding: 5px';

也可以使用切换类名的方法：
//css
.active {
padding: 5px;
border-left: 1px;
border-right: 2px;
}

// javascript
var el = document.querySelector('.el');
el.className = 'active';
```

4. 对于复杂动画效果,使用绝对定位让其脱离文档流
设置动画元素 position 属性为 fixed 或者 absolute：由于当前元素从 DOM 流中独立出来，因此受影响的只有当前元素，元素 repaint。

3. 避免在 CSS 中使用运算式