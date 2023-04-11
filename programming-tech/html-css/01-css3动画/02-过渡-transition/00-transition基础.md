# transition:过渡
CSS中最简单的动画叫做 transition(转变)。通常，当一个元素的样式属性值发生变化时，
我们会立即看到页面元素发生变化，也就是页面元素从旧的属性值立即变成新的属性值的效果。Transition(转变)

让页面元素不是立即的、而是慢慢的从一种状态变成另外一种状态，从而表现出一种动画过程

元素从一种样式逐渐改变为另一种的效果,有一个div，它的css样式如下：
```css
div {
  width: 100px;
  height: 100px;
  background-color: #87cefa;
  -webkit-transition: width 2s;
  /*时长为2s的宽度变化效果*/
  -moz-transition: width 2s;
  -o-transition: width 2s;
  transition: width 2s;
}

div:hover {
  width: 300px;
}
```

坑：
a.过渡只关系元素的初始状态和结束状态，没有方法可以获取元素在过渡中每一帧的状态
b.元素在初次渲染还没有结束的时候，是没有办法触发过渡的
c.在绝大部分变换样式的切换时，变换组合的个数或位置不一样时，是没有办法触发过渡的

## 属性：
* transition-property – 什么属性将用动画表现，例如, opacity。
* transition-duration – 转变过程持续时间。
* transition-timing-function – 转变时使用的调速函数(比如, linear、 ease-in 或自定义的 cubic bezier 函数)

实例：transition–三种属性的合体简写
```css
div{
  opacity: 1;
  transition: opacity 1s linear;
}
div:hover {
  opacity: 0;
}
```

## 扩展
【opacity属性】
也是一个css3属性，该属性用于设置元素的不透明度级别，所有的浏览器都支持这个属性。
语法：opacity: value|inherit;
参数说明：
value ：规定不透明度。从 0.0 （完全透明）到 1.0（完全不透明）

实例1：
opacity的变化过程将会持续2秒，而left值的变化过程将会持续4秒。
```css
div {
  transition-property: opacity, left;
  transition-duration: 2s, 4s;
}
```

## 其他
* transition-property 
  指定过渡动画的属性（并不是所有的属性都可以动画）
* transition-duration
  指定过渡动画的时间（0也要带单位）
* transition-timing-function
  指定过渡动画的形式（贝塞尔）

* transition-delay
  指定过渡动画的延迟

* transition
  第一个可以被解析成时间的值会赋给transition-duration

* transtionend事件（DOM2),在每个属性完成过渡时都会触发这个事件

* 当属性值的列表长度不一致时,跟时间有关的重复列表,transition-timing-function使用默认值