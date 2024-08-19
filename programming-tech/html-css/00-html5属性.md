---
title: html5属性
sidebar_position: 2
---

## 隐藏dom
* display:none；视觉上消失，也不占位置，但Dom节点还在。
```
v-show： 调用display:none 来控制元素是否展示。
```
* visibility：hidden；视觉上消失，但是还占着位置。 

* v-if ：让Dom节点直接消失。（即：视觉上看不到，也没有位置，dom节点也不在。）

## HTML5 新增特性有哪些
+ Canvas、SVG -- 用于绘画的元素，canvas绘制的图片会失真而SVG绘制的不会失真。
+ video、audio -- 用于播放视频和音频的媒体。
+ Drag 、Drop -- 用于拖放的 。
+ Geolocation -- 用于获取地理位置。
+ localStorage、sessionStorage -- 用于本地离线存储。
```
如果一个站点容易受到 XSS 攻击，LocalStorage 是不安全的
```
+ webSQL、IndexDB
```
LocalStorage的安全性比较低，因为它存储在本地浏览器，是一个全局对象，可以被所有脚本访问和修改，而且没有任何加密机制。如果攻击者获得了对LocalStorage的访问权限，那么他们可以随意读写其中的数据。

相比之下，IndexedDB的安全性较高。IndexedDB的数据是存储在沙盒中的，每个域名都有自己独立的存储空间，不同的域名无法访问彼此的数据
```
+ service Worker -- 独立于其他脚本，不影响页面性能运行在后台的javascript。
+ webSocket -- 单个TCP连接上进行全双工通讯的协议。
+ 新的特殊内容元素 -- 如：article、footer、header、nav、section。
+ 新的表单控件 -- 如：date、time、email、url、search。

## 2.SVG与Canvas区别
+ SVG是基于XML的，可以操作DOM，渲染速度较慢

+ SVG适用于描述XML中的2D图形的语言,SVG更适合用来做动态交互，而且SVG绘图很容易编辑，只需要增加或移除相应的元素就可以了。

+ 在SVG中每个形状都被当做是一个对象，如果SVG发生改变，页面就会发生重绘

svg
1. 不依赖分辨率
2. 支持事件处理器
3. 最适合带有大型渲染区域的应用程序（比如谷歌地图）
4. 复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）
5. 不适合游戏应用

与其他图像格式相比，SVG的优势在于：
```
1. SVG矢量图，而canvas 依赖于分辨率。 所以svg 放大不会失真，但是canvas 绘制的图形会失真。很适合做地图，但是我看百度地图是canvas,高德是svg。
2. SVG图像可通过文本编译器来创建和修改
2. canvas 绘制的图形，只能给 canvas 整个画布添加事件，而不能给某个图形或文件添加事件处理器，但是 svg 支持事件绑定，如果需要添加带有事件的动画效果时，就需要选择 svg。
```

### Canvas（翻译为画布）是HTML5的一个标签，Canvas提供了给JavaScript在浏览器内绘制的能力
* 通过Javascript来绘制2D图形。
+ 比较新的技术,Canvas随时随地绘制2D图形（使用javaScript）,Canvas 提供的绘图能力更底层，适合做到像素级的图形处理，能动态渲染和绘制大数据量的图形。

+ Canvas是一像素一像素地渲染，如果改变某一个位置，整个画布会重绘。
```
1. canvas 适合图像密集型的游戏，频繁地重绘图像，svg 绘制的复杂度高时减慢渲染的速度。

2. 小画布、大数据量的场景适合用 Canvas，譬如热力图、大数据量的散点图等。如果画布非常大，有缩放、平移等高频的交互，或者移动端对内存占用量非常敏感等场景，可以使用 SVG 的方案。
```

Canvas
1. 依赖分辨率
2. 不支持事件处理器
3. 弱的文本渲染能力
4. 能够以 .png 或 .jpg 格式保存结果图像
5. 最适合图像密集型的游戏，其中的许多对象会被频繁重绘

## 3.WebSocket
WebSocket协议为web应用程序客户端和服务端之间提供了一种全双工通信机制。
+ 握手阶段采用HTTP协议，默认端口是80和443

+ 建立在TCP协议基础之上，和http协议同属于应用层

+ 可以发送文本，也可以发送二进制数据。

+ 没有同源限制，客户端可以与任意服务器通信。

+ 协议标识符是ws（如果加密，为wss），如ws://localhost:8023
