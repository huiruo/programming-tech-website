---
title: Socks5
sidebar_position: 4
---

## Socks5
Socks5是属于TCP/IP模型中应用层的协议，因此，网络连接过程可以理解基于Socks5协议的请求由客户机到代理机的整个过程如下：
* 将用户数据添加SOCKS5头部，发到传输层；
* 传输层将SOCKS5协议数据分段，添加TCP/UDP协议数据发到网络层；
* 网络层将TCP/UDP协议数据添加IP协议头，发往链路层；
* 链路层添加帧头与尾，将数据封装成帧发往代理机。

## Socks5工作原理
Socks5客户端 <---socks5---> Socks5服务器 <—正常请求—> 目标主机

Socks5客户端在与Socks5服务器交互的整个过程是有可能暴露在整个互联网中的，因此很容易被监控到，根据协议特征也可以很容易识别出来。

## Shadowsocks Socks5工作原理
Socks5客户端 <---socks5---> sslocal <–密文–> ss-server <—正常请求—> 目标主机
Shadowsocks的处理方式是将Socks5客户端与Socks5服务器的连接提前，Socks5协议的交互完全是在本地进行的，在网络中传输的完全是利用加密算法加密后的密文，这就很好的进行了去特征化，使得传输的数据不是很容易的被特征识别。

## 差异部分：
* 本地的sslocal：sslocal对于Socks5客户端便是Socks5服务器,对于Socks5客户端是透明的，sslocal完成与Socks5客户端所有的交互。
* 远程的ssserver：ssserver对于目标主机同样也是Socks5服务器，对于目标主机是透明的，完成Socks5服务器与目标主机的所有操作。
* sslocal-ssserver:sslocal接收到Socks5客户端发送的数据，会将数据加密，并将配置信息发送到ssserver，ssserver接收到配置信息进行权限验证，然后将数据进行解密，然后将明文发往目标主机；当目标主机响应ssserver，ssserver将接收到的数据进行解包，并将数据加密，发送到sslocal，sslocal接收到加密后的数据进行解密，再发送给Socks 5客户端，这就完成了一次交互。

