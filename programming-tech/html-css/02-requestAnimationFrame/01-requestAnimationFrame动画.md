## window.requestAnimationFrame()
>告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

HTML5/CSS3时代，我们要在web里做动画选择其实已经很多了:
你可以用CSS3的animattion+keyframes;
你也可以用css3的transition;
```
当然最原始的你还可以使用window.setTimout()或者window.setInterval()通过不断更新元素的状态位置等来实现动画，前提是画面的更新频率要达到每秒60次才能让肉眼看到流畅的动画效果。
```
现在又多了一种实现动画的方案，那就是还在草案当中的window.requestAnimationFrame()方法。
初识requestAnimationFrame:
https://www.cnblogs.com/Wayou/p/requestAnimationFrame.html

## 动画实战
```js
setCurrentIndex(Element_offsetWidth, Element_offsetLeft) {
  const nav = this.$refs.nav;
  const nav_offestwidth = nav.offsetWidth;
  const to =
    Element_offsetLeft - (nav_offestwidth - Element_offsetWidth) / 2;
  //解析：动画，这二者的效果是一样的
  // this.$refs.nav.scrollLeft = to
  this.scrollLeftTo(nav, to, 0.3);
},
scrollLeftTo(scroller, to, duration) {
  let count = 0;
  let from = scroller.scrollLeft;
  let frames = duration === 0 ? 1 : Math.round((duration * 1000) / 16);
  let _this = this;
  function animate() {
    scroller.scrollLeft += (to - from) / frames;
    if (++count < frames) {
      _this.scrollLeftRafId = _this.raf(animate);
    }
  }
  animate();
},
raf(fn) {
  return window.requestAnimationFrame.call(window, fn);
},
```