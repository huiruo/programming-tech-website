## 定义
requestAnimationFrame是一个对浏览器标准 API 的兼容实现，你可能已经熟悉它了。它接受一个函数作为唯一的参数，并且在下一次重绘之前调用此函数。一些基于 JavaScript 的动画库高度依赖于这一 API

## 1.requestAnimationFrame H5新标准-->会在微任务执行完之后，浏览器会有个渲染机制选择时机执行
requestAnimationFrame的用法与setTimeout很相似，只是不需要设置时间间隔而已。requestAnimationFrame使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用。

> window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

适合优化动画：
动画效果会在页面渲染之前调用，保证页面渲染完后会有新的效果，同时这样做之后，合适设置动画效果由浏览器来决定，这样能够节约性能，因为在页面没更新时不管设置多少遍动画，用户都是看不到效果的。

### requestAnimationFrame类似节流的效果：
requestAnimationFrame的回调函数并不能被重复调用，这点和setInterval不同，它和setTimeout类似，回调函数只能被调用一次，只不过setTimeout可以自定义调用时间， requestAnimationFrame的调用时间则是跟着系统的刷新频率走的，所以在实现动画的时候，setTimeout比requestAnimationFrame更加灵活。

它返回一个整数，表示定时器的编号，这个值可以传递给cancelAnimationFrame用于取消这个函数的执行;
>实现动画效果的方法比较多，Javascript 中可以通过定时器 setTimeout 来实现，css3 可以使用 transition 和 animation 来实现，html5 中的 canvas 也可以实现。除此之外，html5 还提供一个专门用于请求动画的API，那就是 requestAnimationFrame，顾名思义就是请求动画帧。

>与setTimeout相比， requestAnimationFrame 最大的优势是由系统来决定回调函数的执行时机。具体一点讲，如果屏幕刷新率是60Hz,那么回调函数就每16.7ms被执行一次，如果刷新率是75Hz，那么这个时间间隔就变成了1000/75=13.3ms，换句话说就是，requestAnimationFrame的步伐跟着系统的刷新步伐走。它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。

### requestAnimationFrame 是宏任务吗
```js
setTimeout(()=>{
    console.log(1)
})
requestAnimationFrame(()=>{
    console.log(2)
})
setTimeout(()=>{
    console.log(4)
})
Promise.resolve(3).then(res=>{
    console.log(res)
})
/*
3
2
1
4
*/
```

>requestAnimationFrame不是宏任务也不是微任务，因为它的执行机制有点特殊，其实它的执行时机是在宏任务和微任务之间的，微任务执行完之后，浏览器会有个渲染机制，这个requestAnimationFrame会在渲染之前执行，但是浏览器这个时候会根据各种条件判断是否进行渲染，比如浏览器17ms渲染一次，如果浏览器发现还不到17ms，那么就不会渲染（浏览器会根据很多因素判断，这只是举个例子），requestAnimationFrame也就不会执行，就会跳过然后执行宏任务。你打印的3214是因为执行完微任务发现正好该渲染了，然后requestAnimationFrame就执行了，而另一个3142是因为没赶上渲染的时机，就先去执行宏任务了，也就是先打印了14。

## 使用场景
### window.requestAnimationFrame() 在动画中使用
>告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

HTML5/CSS3可用动画实现:
* 用CSS3的animattion+keyframes;
* 用css3的transition;
* 最原始的你还可以使用window.setTimout()或者window.setInterval()通过不断更新元素的状态位置等来实现动画，前提是画面的更新频率要达到每秒60次才能让肉眼看到流畅的动画效果。

* 现在又多了一种实现动画的方案，那就是还在草案当中的window.requestAnimationFrame()方法。

### 动画实战
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


### 使用场景1:监听 scroll 函数
```js
// 页面滚动事件（scroll）的监听函数，就很适合用这个 api，推迟到下一次重新渲染。
$(window).on('scroll', function () {
  window.requestAnimationFrame(scrollHandler)
})

// 平滑滚动到页面顶部
const scrollToTop = () => { 
  const c = document.documentElement.scrollTop || document.body.scrollTop 
  if (c > 0) {  
    window.requestAnimationFrame(scrollToTop) 
    window.scrollTo(0, c - c / 8) 
  }
}

scrollToTop()
```
