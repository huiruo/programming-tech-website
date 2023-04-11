## 1.关键帧的定义
```
　不同于过渡动画只能定义首尾两个状态，关键帧动画可以定义多个状态，或者用关键帧的话来说，过渡动画只能定义第一帧和最后一帧这两个关键帧，而关键帧动画则可以定义任意多的关键帧，因而能实现更复杂的动画效果。
@keyframes mymove{
　　from{初始状态属性}
　　to{结束状态属性}
}
或
@keyframes mymove{
　　0%{初始状态属性}
　　50%（中间再可以添加关键帧）
　　100%{结束状态属性}
}
```

## animation vs transition
为页面设置动画时，往往会用到transition还有animation以及transfrom属性或者用到js。
* 相同点：都是随着时间改变元素的属性值。

### 不同点：
* transition需要触发一个事件(hover事件或click事件等)才会随时间改变其css属性;
* 而animation在不需要触发任何事件的情况下也可以显式的随着时间变化来改变元素css的属性值，从而达到一种动画的效果，css3的animation就需要明确的动画属性值
```
animation 可以配合 @keyframe 可以不触发事件就触发这个动画
```

* transition 触发一次播放一次；而 animation 则是可以设置很多的属性，比如循环次数，动画结束的状态等等；

* transition是从：hover延伸出来的，不管是动态设置的还是非动态设置的过渡效果，只要过渡效果指定的属性值发生了变化就会触发过渡效果。

* 而animation是从flash延伸出来的，使用关键帧的概念，如果是非动态设置的，那么页面加载完后就会触发动画效果；如果是动态设置的，那么设置完后（假设没有设置 delay）就会触发动画效果。后面再改变属性值也不会触发动画效果了，除了一种情况（这种情况不会触发transition定义的过渡效果），就是元素从 display:none 状态变成非 display:none 状态时，也会触发动画效果。


* 其实通常情况下，对于使用js我们更加倾向于使用css来设置动画。
>极端条件下，animation占用的资源相应的比transition多，所以如果能用transition实现，就尽量用transition来实现，如果追求复杂更自由的动画，就可以用animation。

### 在性能方面
```
在性能方面：浏览器有一个主线程和排版线程；主线程一般是对 js 运行的、页面布局、生成位图等等，然后把生成好的位图传递给排版线程，而排版线程会通过 GPU 将位图绘制到页面上，也会向主线程请求位图等等；
```

我们在用使用 animation 的时候这样就可以改变很多属性，像我们改变了 width、height、position 等等这些改变文档流的属性的时候就会引起页面的回流和重绘，对性能影响就比较大，但是我们用 transition 的时候一般会结合 transform 来进行旋转和缩放等不会生成新的位图，不会引起页面的回流

尽量对复杂的动画元素使用绝对定位，使它脱离文档流，否则会引起父元素及其后续元素频繁重排
transform只会造成重绘。
使用visibility替换display:none，因为前者只会引起重绘，后者会造成reflow。
```
01-浏览器请求-渲染的流程-回流重绘.md

## 扩展：reflow(回流):根据生成的渲染树，进行回流(reflow)，得到节点的几何信息（位置，大小）

回流一定会触发重绘，而重绘不一定会回流;在性能优先的前提下，性能消耗 回流 大于 重绘。
```

## 2.animation API
简写: animation:动画名称 动画持续时间 动画的过渡类型 延迟的时间 定义循环次数 定义动画方式

* animation-name
   *检索或设置对象所应用的动画名称
   *必须与规则@keyframes配合使用， eg:@keyframes mymove{} animation-name:mymove;

* animation-duration
   *检索或设置对象动画的持续时间
   *说明：animation-duration:3s; 动画完成使用的时间为3s

* animation-timing-function
   *检索或设置对象动画的过渡类型
   *属性值
      linear：线性过渡。等同于贝塞尔曲线(0.0, 0.0, 1.0, 1.0)
      ease：平滑过渡。等同于贝塞尔曲线(0.25, 0.1, 0.25, 1.0)
      ease-in：由慢到快。等同于贝塞尔曲线(0.42, 0, 1.0, 1.0)
      ease-out：由快到慢。等同于贝塞尔曲线(0, 0, 0.58, 1.0)
      ease-in-out：由慢到快再到慢。等同于贝塞尔曲线(0.42, 0, 0.58, 1.0)
      step-start:马上跳到动画每一结束桢的状态

* animation-delay
    检索或设置对象动画延迟的时间
    说明：animation-delay:0.5s; 动画开始前延迟的时间为0.5s)

* animation-iteration-count
    检索或设置对象动画的循环次数
    属性值
        animation-iteration-count: infinite | number;
	infinite：无限循环
	number: 循环的次数
* animation-direction
    检索或设置对象动画在循环中是否反向运动
    属性值
	normal：正常方向
	reverse：反方向运行
	alternate：动画先正常运行再反方向运行，并持续交替运行
	alternate-reverse：动画先反运行再正方向运行，并持续交替运行
* animation-play-state
   检索或设置对象动画的状态
   属性值
	animation-play-state:running | paused;
	running:运动
	paused: 暂停
	animation-play-state:paused; 当鼠标经过时动画停止，鼠标移开动画继续执行
