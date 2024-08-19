## doc
https://blog.csdn.net/xgangzai/article/details/112256016

## 例子2
web worker是h5的一个新特性，主要是为了解决js在处理一些耗时任务时阻塞页面的渲染交互导致用户体验不好的问题，因为web worker可以为页面额外开启一个自包含的执行环境（js是单线程的），web worker开启一个额外线程靠的是浏览器支持。开启的这个线程用于为js处理那些耗时任务，然后js主线程继续处理页面渲染交互，用户体验就不会变差了。
```
https://juejin.cn/post/7119381282144026638
```

## 例子3
https://blog.csdn.net/sinat_24713805/article/details/126141688

web socket 可以让服务器主动向客户端发送消息,适合开发聊天,多人游戏等协作类的应用.


Web Worker 是一个独立的javascript 线程,运行在后台,适合做费时的大数据计算.

特点:无法访问window或者document对象,不能和前台页面共享数据,不影响前台页面任何操作,可以创建多个worker 线程,每个work代码都要放在一个独立的js文件中

### HTML5提供worker对象创建线程
主页面与web worker 线程通过postMessage传递;通过添加onmessage事件监听消息变化,获取接受到的消息,

web Work能够让javascript实现多线程,擅长处理大数据计算

特点:无法访问window或者document对象,不能和前台页面共享数据,不影响前台页面任何操作,可以创建多个worker 线程,每个work代码都要放在一个独立的js文件中

HTML5提供worker对象创建线程,主页面与web worker 线程通过postMessage传递;通过添加onmessage事件监听消息变化,获取接受到的消息,
```js
/*----主线程  index.js -----*/
var data = {"name":"主线程",index:1};
var myWorker = new Worker("subworker.js");
//主线程监听消息事件
myworker.addEventListener("message",function(oEvent){
    console.log("工作线程的结果:"+onEvent.data["name"]+oEvent.data["index"]);
}.false);
 
//客户端发送消息
myWorker.postMessage(data);
 
$("#stop").click(function(){
    //停止web worker
    myWorker.terminate();
});
 
/*----子线程----*/
onmessage = function(oEvent){
    var data = oEvent.data;
    data["name"] = "我是子线程";
    //子线程向主线程发送消息
    postMessgae(data);
}
```