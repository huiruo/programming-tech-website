
### 如何判断一个元素是否在可视区域中
实现一些常用的功能，例如：

图片的懒加载
列表的无限滚动
计算广告元素的曝光情况
可点击链接的预加载

一个元素是否在可视区域，我们常用的有三种办法：
1. offsetTop、scrollTop

* offsetTop 属性是用于获取一个元素相对于其最近的有定位属性（position: relative, position: absolute, position: fixed 或 position: sticky）的父元素的上边缘的距离，通常是以像素为单位的整数值。

* scrollTop 属性用于获取或设置元素的垂直滚动条位置，即滚动条在垂直方向上滚动的距离。
clientWidth、clientHeight,这里可以看到client元素都不包括外边距：
* clientWidth：元素内容区宽度加上左右内边距宽度，即clientWidth = content + padding
* clientHeight：元素内容区高度加上上下内边距高度，即clientHeight = content + padding

关于scroll系列的属性如下：
```
scrollWidth 和 scrollHeight 主要用于确定元素内容的实际大小

scrollLeft 和 scrollTop 属性既可以确定元素当前滚动的状态，也可以设置元素的滚动位置

垂直滚动 scrollTop > 0
水平滚动 scrollLeft > 0

将元素的 scrollLeft 和 scrollTop 设置为 0，可以重置元素的滚动位置
```

```js
//el.offsetTop - document.documentElement.scrollTop <= viewPortHeight
 
function isInViewPortOfOne (el) {
    // viewPortHeight 兼容所有浏览器写法
    const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight 
    const offsetTop = el.offsetTop
    const scrollTop = document.documentElement.scrollTop
    const top = offsetTop - scrollTop
    return top <= viewPortHeight
}
```

2. getBoundingClientRect

3. Intersection Observer


### 选择器
css属性选择器常用的有：

id选择器（#box），选择id为box的元素

类选择器（.one），选择类名为one的所有元素

标签选择器（div），选择标签为div的所有元素

后代选择器（#box div），选择id为box元素内部所有的div元素

子选择器（.one>one_1），选择父元素为.one的所有.one_1的元素

相邻同胞选择器（.one+.two），选择紧接在.one之后的所有.two元素

群组选择器（div,p），选择div、p的所有元素

不常用：
伪类选择器：
```
:link ：选择未被访问的链接
:visited：选取已被访问的链接
:active：选择活动链接
:hover ：鼠标指针浮动在上面的元素
:focus ：选择具有焦点的
:first-child：父元素的首个子元素
```

伪元素选择器
```
:first-letter ：用于选取指定选择器的首字母
:first-line ：选取指定选择器的首行
:before : 选择器在被选元素的内容前面插入内容
:after : 选择器在被选元素的内容后面插入内容
```

属性选择器
```
[attribute] 选择带有attribute属性的元素
[attribute=value] 选择所有使用attribute=value的元素
[attribute~=value] 选择attribute属性包含value的元素
[attribute|=value]：选择attribute属性以value开头的元素
```

### 隐藏页面元素
* display:none
* visibility:hidden
* opacity:0
* 设置height、width模型属性为0
* position:absolute

### 怎么理解回流跟重绘？什么场景下会触发？
* 回流：布局引擎会根据各种样式计算每个盒子在页面上的大小与位置
* 重绘：当计算好盒模型的位置、大小及其他属性后，浏览器根据每个盒子特性进行绘制

当我们对 DOM 的修改引发了 DOM几何尺寸的变化（比如修改元素的宽、高或隐藏元素等）时，浏览器需要重新计算元素的几何属性，然后再将计算的结果绘制出来

当我们对 DOM的修改导致了样式的变化（color或background-color），却并未影响其几何属性时，浏览器不需重新计算元素的几何属性、直接为该元素绘制新的样式，这里就仅仅触发了重绘

优化：
* 如果想设定元素的样式，通过改变元素的 class 类名 (尽可能在 DOM 树的最里层)
* 避免设置多项内联样式
* 应用元素的动画，使用 position 属性的 fixed 值或 absolute 值(如前文示例所提)
* 避免使用 table 布局，table 中每个元素的大小以及内容的改动，都会导致整个 table 的重新计算
* 对于那些复杂的动画，对其设置 position: fixed/absolute，尽可能地使元素脱离文档流，从而减少对其他元素的影响
* 使用css3硬件加速，可以让transform、opacity、filters这些动画不会引起回流重绘
* 避免使用 CSS 的 JavaScript 表达式

### 让Chrome支持小于12px 的文字方式有哪些
* zoom
* -webkit-transform:scale()

### Box-sizing
* content-box 默认值，元素的 width/height 不包含padding，border，与标准盒子模型表现一致
>盒子总宽度 = width + padding + border + margin;
* border-box 元素的 width/height 包含 padding，border，与怪异盒子模型表现一致
>盒子总宽度 = width + margin;
* inherit 指定 box-sizing 属性的值，应该从父元素继承
```css
/* 宽度为200px */
.box {
  width: 200px;
  height: 100px;
  padding: 20px;
  box-sizing: border-box;
}
```


### 三角形
```css
.box {
    /* 内部大小 */
    width: 0px;
    height: 0px;
    /* 边框大小 只设置两条边*/
    border-top: #4285f4 solid;
    border-right: transparent solid;
    border-width: 85px; 
    /* 其他设置 */
    margin: 50px;
}
```

### 单行文本溢出省略
实现方式也很简单，涉及的css属性有：

* text-overflow：规定当文本溢出时，显示省略符号来代表被修剪的文本
* white-space：设置文字在一行显示，不能换行
* overflow：文字长度超出限定宽度，则隐藏超出的内容
```css
p{
    overflow: hidden;
    line-height: 40px;
    width:400px;
    height:40px;
    border:1px solid red;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```

2. 多行文本溢出省略
多行文本溢出的时候，我们可以分为两种情况：
* 基于高度截断
* 基于行数截断

## 什么是响应式设计？响应式设计的基本原理是什么？
响应式设计的基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理，为了处理移动端，页面头部必须有meta声明viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no”>
```

属性对应如下：
* width=device-width: 是自适应手机屏幕的尺寸宽度

* maximum-scale:是缩放比例的最大值

* inital-scale:是缩放的初始化

* user-scalable:是用户的可以缩放的操作

实现响应式布局的方式有如下：
* 媒体查询
* 百分比
* vw/vh
* rem

## 动画
css实现动画的方式，有如下几种：

1. transition 实现渐变动画
2. transform 转变动画
3. animattion+keyframes 实现自定义动画

### 最后一个: requestAnimationFrame
>最原始的你还可以使用window.setTimout()或者window.setInterval()通过不断更新元素的状态位置等来实现动画，前提是画面的更新频率要达到每秒60次才能让肉眼看到流畅的动画效果。
requestAnimationFrame的回调函数并不能被重复调用，这点和setInterval不同，它和setTimeout类似，回调函数只能被调用一次，只不过setTimeout可以自定义调用时间， requestAnimationFrame的调用时间则是跟着系统的刷新频率走的，所以在实现动画的时候，setTimeout比requestAnimationFrame更加灵活。

它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。

### 1. transition的属性如下：
```
property:填写需要变化的css属性
duration:完成过渡效果需要的时间单位(s或者ms)
timing-function:完成效果的速度曲线
delay: 动画效果的延迟触发时间
```

```html
<!-- 实现鼠标移动上去发生变化动画效果 -->
<style>
       .base {
            width: 100px;
            height: 100px;
            display: inline-block;
            background-color: #0EA9FF;
            border-width: 5px;
            border-style: solid;
            border-color: #5daf34;
            transition-property: width, height, background-color, border-width;
            transition-duration: 2s;
            transition-timing-function: ease-in;
            transition-delay: 500ms;
        }

        /*简写*/
        /*transition: all 2s ease-in 500ms;*/
        .base:hover {
            width: 200px;
            height: 200px;
            background-color: #5daf34;
            border-width: 10px;
            border-color: #3a8ee6;
        }
</style>
<div class="base"></div>
```

### transform 转变动画
一般配合transition过度使用,包含四个常用的功能：
```
translate：位移
scale：缩放
rotate：旋转
skew：倾斜
```

```html
<!-- 可以看到盒子发生了旋转，倾斜，平移，放大 -->
<style>
    .base {
        width: 100px;
        height: 100px;
        display: inline-block;
        background-color: #0EA9FF;
        border-width: 5px;
        border-style: solid;
        border-color: #5daf34;
        transition-property: width, height, background-color, border-width;
        transition-duration: 2s;
        transition-timing-function: ease-in;
        transition-delay: 500ms;
    }
    .base2 {
        transform: none;
        transition-property: transform;
        transition-delay: 5ms;
    }

    .base2:hover {
        transform: scale(0.8, 1.5) rotate(35deg) skew(5deg) translate(15px, 25px);
    }
</style>
<div class="base base2"></div>
```

### animation 实现自定义动画
animation是由 8 个属性的简写，分别如下：
* animation-duration	指定动画完成一个周期所需要时间，单位秒（s）或毫秒（ms），默认是 0	

* animation-timing-function	指定动画计时函数，即动画的速度曲线，默认是 "ease"	linear、ease、ease-in、ease-out、ease-in-out

* animation-delay	指定动画延迟时间，即动画何时开始，默认是 0	

* animation-iteration-count	指定动画播放的次数，默认是 1	

* animation-direction 指定动画播放的方向	默认是 normal	normal、reverse、alternate、alternate-reverse

* animation-fill-mode	指定动画填充模式。默认是 none	forwards、backwards、both

* animation-play-state	指定动画播放状态，正在运行或暂停。默认是 running	running、pauser

* animation-name	指定 @keyframes 动画的名称	

CSS 动画只需要定义一些关键的帧，而其余的帧，浏览器会根据计时函数插值计算出来，

通过 @keyframes 来定义关键帧

因此，如果我们想要让元素旋转一圈，只需要定义开始和结束两帧即可：
```css
/* from 表示最开始的那一帧，to 表示结束时的那一帧 */
@keyframes rotate{
    from{
        transform: rotate(0deg);
    }
    to{
        transform: rotate(360deg);
    }
}

/* 定义好了关键帧后，下来就可以直接用它了： */
animation: rotate 2s;
```

## flex
容器属性有：
* flex-direction
* flex-wrap
* flex-flow: 是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap
```css
.box {
  flex-flow: <flex-direction> || <flex-wrap>;
}
```
* justify-content
* align-items
* align-content

实例：flex居中：
```css
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background: yellow;
}
```

容器成员属性如下:
* order: 定义项目的排列顺序。数值越小，排列越靠前，默认为0
* flex-grow:当容器设为flex-wrap: nowrap;不换行的时候，容器宽度有不够分的情况，弹性元素会根据flex-grow来决定. 定义项目的放大比例（容器宽度>元素总宽度时如何伸展）默认为0，即如果存在剩余空间，也不放大
```css
.item {
    flex-grow: <number>;
}
/* 如果所有项目的flex-grow属性都为1，则它们将等分剩余空间（如果有的话） */
/* 如果一个项目的flex-grow属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍 */
```
* flex-shrink:定义了项目的缩小比例（容器宽度<元素总宽度时如何收缩），默认为1，即如果空间不足，该项目将缩小
```
如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小

如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小
在容器宽度有剩余时，flex-shrink也是不会生效的
```
* flex-basis:设置的是元素在主轴上的初始尺寸，所谓的初始尺寸就是元素在flex-grow和flex-shrink生效前的尺寸
* flex:flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto，也是比较难懂的一个复合属性

* align-self:允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性,默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch
```css
.item {
    align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

### flex-direction
决定主轴的方向(即项目的排列方向)
```
row（默认值）：主轴为水平方向，起点在左端
row-reverse：主轴为水平方向，起点在右端
column：主轴为垂直方向，起点在上沿。
column-reverse：主轴为垂直方向，起点在下沿
```

### flex-wrap
弹性元素永远沿主轴排列，那么如果主轴排不下，通过flex-wrap决定容器内项目是否可换行
```
nowrap（默认值）：不换行
wrap：换行，第一行在下方
wrap-reverse：换行，第一行在上方
```

### justify-content
定义了项目在主轴上的对齐方式
```
flex-start（默认值）：左对齐
flex-end：右对齐
center：居中
space-between：两端对齐，项目之间的间隔都相等
space-around：两个项目两侧间隔相等
```

### align-items
定义项目在交叉轴上如何对齐
```
flex-start：交叉轴的起点对齐
flex-end：交叉轴的终点对齐
center：交叉轴的中点对齐
baseline: 项目的第一行文字的基线对齐
stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度
```
### align-content
定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用
```
flex-start：与交叉轴的起点对齐
flex-end：与交叉轴的终点对齐
center：与交叉轴的中点对齐
space-between：与交叉轴两端对齐，轴线之间的间隔平均分布
space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍
stretch（默认值）：轴线占满整个交叉轴
```

## 居中
### 水平垂直居中
利用定位+margin:auto
```css
.father{
    width:500px;
    height:300px;
    border:1px solid #0a3b98;
    position: relative;
}
.son{
    width:100px;
    height:40px;
    background: #f0a238;
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    margin:auto;
}
```

绝对定位+left:50%+margin:负自身一半
```css
.father {
    position: relative;
    width: 200px;
    height: 200px;
    background: skyblue;
}
.son {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left:-50px;
    margin-top:-50px;
    width: 100px;
    height: 100px;
    background: red;
}
```

利用定位+transform
```
translate(-50%, -50%)将会将元素位移自己宽度和高度的-50%,margin负值的替代方案，并不需要知道自身元素的宽高
```
```css
.father {
    position: relative;
    width: 200px;
    height: 200px;
    background: skyblue;
}
.son {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100px;
    height: 100px;
    background: red;
}
```

* flex布局

* grid布局
```css
.father {
    display: grid;
    align-items:center;
    justify-content: center;
    width: 200px;
    height: 200px;
    background: skyblue;
}
.son {
    width: 10px;
    height: 10px;
    border: 1px solid red
}
```

* table布局:父元素为display:table-cell，子元素设置 display: inline-block。利用vertical和text-align可以让所有的行内块级元素水平垂直居中

### 垂直居中
position: absolute设置left、top、margin-left、margin-top(定高)
display: table-cell
transform: translate(x, y)
flex(不定高，不定宽)
grid(不定高，不定宽)，兼容性相对比较差

### 一个页面和一个弹窗一起，怎么设置弹窗透明不影响页面
使用CSS的opacity属性来控制弹窗的透明度。同时，你还可以使用CSS的pointer-events属性来控制弹窗是否响应用户的交互事件，以避免弹窗遮挡住页面元素。

```html
<div class="page-content">
  <!-- 页面内容 -->
</div>

<div class="modal">
  <!-- 弹窗内容 -->
</div>

.page-content {
  /* 页面内容样式 */
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5); /* 设置透明度为 0.5 */
  opacity: 1; /* 设置透明度为 1，如果需要完全透明，可以设置为 0 */
  pointer-events: none; /* 禁用弹窗的交互事件 */
  /* 弹窗样式 */
}
```


### 上拉加载的本质是页面触底
```
scrollTop + clientHeight >= scrollHeight
```

```js
let clientHeight  = document.documentElement.clientHeight; //浏览器高度
let scrollHeight = document.body.scrollHeight;
let scrollTop = document.documentElement.scrollTop;
 
let distance = 50;  //距离视窗还用50的时候，开始触发；

if ((scrollTop + clientHeight) >= (scrollHeight - distance)) {
    console.log("开始加载数据");
}
```

1. scrollTop：滚动视窗的高度距离window顶部的距离，它会随着往上滚动而不断增加，初始值是0，它是一个变化的值

2. clientHeight:它是一个定值，表示屏幕可视区域的高度；

3. scrollHeight：页面不能滚动时也是存在的,此时scrollHeight等于clientHeight。scrollHeight表示body所有元素的总长度(包括body元素自身的padding)

### 下拉刷新
下拉刷新的本质是页面本身置于顶部时，用户下拉时需要触发的动作
关于下拉刷新的原生实现，主要分成三步：

1. 监听原生touchstart事件，记录其初始位置的值，e.touches[0].pageY；
2. 监听原生touchmove事件，记录并计算当前滑动的位置值与初始位置值的差值，大于0表示向下拉动，并借助CSS3的translateY属性使元素跟随手势向下滑动对应的差值，同时也应设置一个允许滑动的最大值；
3. 监听原生touchend事件，若此时元素滑动达到最大值，则触发callback，同时将translateY重设为0，元素回到初始位置


在下拉到松手的过程中，经历了三个阶段：

1. 当前手势滑动位置与初始位置差值大于零时，提示正在进行下拉刷新操作
2. 下拉到一定值时，显示松手释放后的操作提示
3. 下拉到达设定最大值松手时，执行回调，提示正在进行更新操作
```html
<main>
    <p class="refreshText"></p >
    <ul id="refreshContainer">
        <li>111</li>
        <li>222</li>
        <li>333</li>
        <li>444</li>
        <li>555</li>
        ...
    </ul>
</main>
<script>
// 监听touchstart事件，记录初始的值
var _element = document.getElementById('refreshContainer'),
    _refreshText = document.querySelector('.refreshText'),
    _startPos = 0,  // 初始的值
    _transitionHeight = 0; // 移动的距离

_element.addEventListener('touchstart', function(e) {
    _startPos = e.touches[0].pageY; // 记录初始位置
    _element.style.position = 'relative';
    _element.style.transition = 'transform 0s';
}, false);

// 监听touchmove移动事件，记录滑动差值
_element.addEventListener('touchmove', function(e) {
    // e.touches[0].pageY 当前位置
    _transitionHeight = e.touches[0].pageY - _startPos; // 记录差值

    if (_transitionHeight > 0 && _transitionHeight < 60) { 
        _refreshText.innerText = '下拉刷新'; 
        _element.style.transform = 'translateY('+_transitionHeight+'px)';

        if (_transitionHeight > 55) {
            _refreshText.innerText = '释放更新';
        }
    }                
}, false);

// 最后，就是监听touchend离开的事件
_element.addEventListener('touchend', function(e) {
    _element.style.transition = 'transform 0.5s ease 1s';
    _element.style.transform = 'translateY(0px)';
    _refreshText.innerText = '更新中...';
    // todo...

}, false);

</script>
```