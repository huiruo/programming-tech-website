---
title: WebSocket和http异同
sidebar_position: 1
---

## 一、HTTP 协议
http 为短连接：客户端发送请求都需要服务器端回送响应.请求结束后，主动释放链接，因此为短连接。通常的做法是，不需要任何数据，
也要保持每隔一段时间向服务器发送"保持连接"的请求。这样可以保证客户端在服务器端是"上线"状态。

HTTP连接使用的是"请求-响应"方式，不仅在请求时建立连接，而且客户端向服务器端请求后，服务器才返回数据

## 概念：轮询
```
客户端需要得知某个状态时（Eg：聊天时对方有无回应消息），客户端需要隔一段时间就去发请求询问服务器是否有新消息。缺点：即使没有新消息，
服务端也会被频繁的问候，而且会有最小延迟（轮询间隔）
```

## 概念：长轮询(long polling)
```
原理和普通轮询大同小异，只是采取阻塞模型。流程：请求发送到服务端，服务端在有消息之前都不会关闭连接，有新消息，服务端发送新消息到客户端，
客户端接收新消息并再次开启一个新的连接。
优点：
减少头部开销
更强的实时性
保持连接状态
更好的二进制支持
支持拓展协议
```


## 一、WebSocket是HTML5出的（协议）
Websocket 的出现就是为了解决 HTTP 在即时通信中存在的不足，HTTP 是通过 Polling 实现即时通信存在很大的资源开销。
```
HTTP有1.1和1.0之说，也就是所谓的keep-alive，把多个HTTP请求合并为一个，但是Websocket其实是一个新协议，跟HTTP协议基本没有关系
首先，Websocket是一个持久化的协议，相对于HTTP这种非持久的协议来说。

WebSocket 解决的第一个问题是，通过第一个 HTTP request 建立了 TCP 连接之后，之后的交换数据都不需要再发 HTTP request了，使得
这个长连接变成了一个真.长连接。但是不需要发送 HTTP header就能交换数据显然和原有的 HTTP 协议是有区别的，所以它需要对服务器和客户端
都进行升级才能实现。在此基础上 WebSocket 还是一个双通道的连接，在同一个 TCP 连接上既可以发也可以收信息。此外还有 multiplexing 功能，
几个不同的 URI 可以复用同一个 WebSocket 连接。这些都是原来的 HTTP 不能做到的。
```
1.Websocket的握手部分是和http一样的，或者说借用了HTTP的协议来握手,连接建立之后便与 HTTP 协议没有任何关系，
Websocket 连接建立之后，client 与 server 可以同时收发数据，全双工通讯。

2.在websocket首次连接的报文中加入了两个不同于普通http的首部字段

3.全双工通信

4.不用每次交换header等信息

### 请求报文
```
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket 
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com

upgrade表示升级协议(切换协议)，connection连接方式为升级后协议

Sec-WebSocket-Key: 一个Base64 encode的值（由浏览器随机生成）

Sec-WebSocket-Protocol: 由用户自定义，区分同一个URL下面的不同服务

Sec-WebSocket-Version: ws版本（早期ws的实现版本不止一个）
```
### 响应报文
```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
Sec-WebSocket-Protocol: chat

Sec-WebSocket-Accept：服务端根据客户端的密钥计算出来
```


实例：
```js
//src\renderer\common\im\IMConnector.ts
/**
  * 连接IM服务器
  */
private connectToServer() {
  const strongThis = this;

  let wsUrl = 'ws://' + this.host + ':' + this.port;

  if (Config.getInstance().debugWSApi) {
    wsUrl = Config.getInstance().debugWSApi;
  }

  // Logger.log('WS API:' + wsUrl);

  //重连时，清空消息daa
  this.datas = new Uint8Array();

  if (this.webscoket) {
    this.webscoket.removeEventListener('open', this.openEvent);
    this.webscoket.removeEventListener('message', this.messageEvent);
    this.webscoket.removeEventListener('close', this.closeEvent);
    this.webscoket.removeEventListener('error', this.errorEvent);
    this.webscoket = null;
  }

  this.webscoket = new WebSocket(wsUrl);

  this.webscoket.addEventListener('open', this.openEvent);
  this.webscoket.addEventListener('message', this.messageEvent);
  this.webscoket.addEventListener('close', this.closeEvent);
  this.webscoket.addEventListener('error', this.errorEvent);
}
```
## WebSocket心跳及重连机制
```
websocket是前后端交互的长连接，在使用的过程中，遇到弱网或者网络暂时断连的情况时，服务端并没有触发onclose的事件，客户端也无法得知当前连接是否已经断开，
服务端会继续向客户端发送多余链接，并且这些数据还会丢失。因此为了保证连接的可持续性和稳定性，我们需要有一套机制来检测客户端和服务端是否处于正常连接状态
，websocket心跳重连就应运而生。

如果不存在检测，那么网络突然断开，造成的后果就是client、server可能还在傻乎乎的发送无用的消息，浪费了资源；
怎样检测呢？原理就是定时向server发送消息，如果接收到server的响应就表明连接依旧存在；
  
1、心跳机制是每隔一段时间会向服务器发送一个数据包：
	告诉服务器（后台）自己还活着，同时客户端（浏览器）会确认服务器端是否还活着
2、如果还活着的话，就会回传一个数据包给客户端
3、服务端断开连接了。客户端需要重连~
```

```javascript
//serverUrl
let socketUrl = 'ws://127.0.0.1:3000';
//保存websocket对象
let socket;
// reConnect函数节流标识符
let flag = true;
//心跳机制
let heart = {
    timeOut:3000,
    timeObj = null,
    serverTimeObj = null,
    start:function(){
        console.log('start');
        let self = this;
        //清除延时器
        this.timeObj && clearTimeout(this.timeObj);
        this.serverTimeObj && clearTimeout(this.serverTimeObj);
        this.timeObj = setTimeout(function(){
            socket.send('兄弟，你还好吗?');//发送消息，服务端返回信息，即表示连接良好，可以在socket的onmessage事件重置心跳机制函数
            //定义一个延时器等待服务器响应，若超时，则关闭连接，重新请求server建立socket连接
            self.serverTimeObj=setTimeout(function(){
                socket.close();
                reConnect(socketUrl);
            },self.timeOut)
        },this.timeOut)
    }
}
//建立websocket连接函数
function createWebsocket(url) {
    try {
        socket = new WebSocket(url);
        init();
    } catch (e) {
        //进行重连;
        console.log('websocket连接错误');
        reConnect(socketUrl);
    }
}
//对WebSocket各种事件进行监听   
function init() {
    socket.onopen = function () {
        //连接已经打开
        //重置心跳机制
        heart.start();
    }
    socket.onmessage = function (event) {
        //通过event.data获取server发送的信息
        //对数据进行操作
        console.log(event.data);
        //收到消息表示连接正常，所以重置心跳机制
        heart.start();
    }
    socket.onerror = function () {
        //报错+重连
        console.log('socket连接出错');
        reConnect(socketUrl);
    }
    socket.onclose = function () {
        console.log('socket连接关闭');
    }
}

//重连函数
//因为重连函数会被socket事件频繁触发，所以通过函数节流限制重连请求发送
function reConnect(url) {
    if (!flag) {
        return;
    }
    flag = false;
    setTimeout(function () {
        createWebsocket(url);
        flag = true;
    }, 3000)
}
```