## 1.requestAnimationFrame H5新标准
requestAnimationFrame的用法与setTimeout很相似，只是不需要设置时间间隔而已。requestAnimationFrame使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用。

### requestAnimationFrame类似节流的效果：
requestAnimationFrame的回调函数并不能被重复调用，这点和setInterval不同，它和setTimeout类似，回调函数只能被调用一次，只不过setTimeout可以自定义调用时间， requestAnimationFrame的调用时间则是跟着系统的刷新频率走的，所以在实现动画的时候，setTimeout比requestAnimationFrame更加灵活， requestAnimationFrame比setTimeout表现效果更加优秀。

它返回一个整数，表示定时器的编号，这个值可以传递给cancelAnimationFrame用于取消这个函数的执行;
```
实现动画效果的方法比较多，Javascript 中可以通过定时器 setTimeout 来实现，css3 可以使用 transition 和 animation 来实现，html5 中的 canvas 也可以实现。除此之外，html5 还提供一个专门用于请求动画的API，那就是 requestAnimationFrame，顾名思义就是请求动画帧。

与setTimeout相比， requestAnimationFrame 最大的优势是由系统来决定回调函数的执行时机。具体一点讲，如果屏幕刷新率是60Hz,那么回调函数就每16.7ms被执行一次，如果刷新率是75Hz，那么这个时间间隔就变成了1000/75=13.3ms，换句话说就是，requestAnimationFrame的步伐跟着系统的刷新步伐走。它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。

```

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

```
requestAnimationFrame不是宏任务也不是微任务，因为它的执行机制有点特殊，其实它的执行时机是在宏任务和微任务之间的，微任务执行完之后，浏览器会有个渲染机制，这个requestAnimationFrame会在渲染之前执行，但是浏览器这个时候会根据各种条件判断是否进行渲染，比如浏览器17ms渲染一次，如果浏览器发现还不到17ms，那么就不会渲染（浏览器会根据很多因素判断，这只是举个例子），requestAnimationFrame也就不会执行，就会跳过然后执行宏任务。你打印的3214是因为执行完微任务发现正好该渲染了，然后requestAnimationFrame就执行了，而另一个3142是因为没赶上渲染的时机，就先去执行宏任务了，也就是先打印了14。
```

## 使用场景


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


简单实例：
```js
var progress = 0;
//回调函数
function render() {
    progress += 1; //修改图像的位置
    if (progress < 100) {
           //在动画没有结束前，递归渲染
           window.requestAnimationFrame(render);
    }
}

//第一帧渲染
window.requestAnimationFrame(render);
```
复杂实例：
```js
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Get storage location of u_ModelMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Current rotation angle
  var currentAngle = 0.0;
  // Model matrix
  var modelMatrix = new Matrix4();

  // Start drawing
  var tick = function () {
    console.log("tick---->1")
    currentAngle = animate(currentAngle);  // Update the rotation angle
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);   // Draw the triangle
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  console.log("tick---->")
  tick();
}
```