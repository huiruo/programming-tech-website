---
title: Socks5和http代理区别
sidebar_position: 5
---

## SOCKS工作在比HTTP代理更低的层次：
`HTTP代理只是将HTTP请求转发到所需的HTTP服务器`

SOCKS使用握手协议来通知代理软件其客户端试图进行的连接SOCKS，然后尽可能透明地进行操作，而常规代理可能会解释和重写报头（例如，使用另一种底层协议，例如FTP；然而，HTTP代理只是将HTTP请求转发到所需的HTTP服务器）。


虽然HTTP代理有不同的使用模式，CONNECT方法允许转发TCP连接； HTTP代理通常更了解HTTP协议，执行更高层次的过滤（虽然通常只用于GET和POST方法，而不用于CONNECT方法）。

然而，SOCKS代理还可以转发UDP流量和反向代理，而HTTP代理不能。

## 例子：
* SOCKS：Bill希望通过互联网与Jane沟通，但他们的网络之间存在一个防火墙，Bill不能直接与Jane沟通。所以，Bill连接到他的网络上的SOCKS代理，告知它他想要与Jane创建连接；SOCKS代理打开一个能穿过防火墙的连接，并促进Bill和Jane之间的通信。

* HTTP：Bill希望从Jane的Web服务器下载一个网页。Bill不能直接连接到Jane的服务器，因为在他的网络上设置了防火墙。
为了与该服务器通信，Bill连接到其网络的HTTP代理。他的网页浏览器与代理通信的方式与他直接连接Jane的服务器的方式相同；也就是说，网页浏览器会发送一个标准的HTTP请求头。HTTP代理连接到Jane的服务器，然后将Jane的服务器返回的任何数据传回Bill。
