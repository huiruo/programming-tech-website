---
title: 状态码-请求报文之req header-响应报文res header
sidebar_position: 4
---

## 401和403:401表示用户未通过身份授权、验证，403表示用户可能通过了身份验证，但缺少指定权限
401 Unauthorized

* 状态码401标识认证失败，表示请求没有被认证或者认证失败。
* 通常由web服务器返回，而不是web应用。
* 场景：token失效、token缺失、token伪造，导致服务端无法识别身份。

403 Forbidden

* 状态码403表示授权失败，通常表示用户通过了身份验证，但缺少权限对给定的资源进行访问或者操作。
* 通常由web应用返回。
* 场景：用户登录成功，但是无权进行读写操作。

## 状态码
* 1xx 服务器收到请求收到 
1xx开头的请求表示服务端已经收到请求，但是还没有返回信息给客户端

* 2xx 请求成功，如200表示客户端已经成功请求数据

* 3xx 重定向，如302
客户端收到3xx开头的状态码时，表示此时服务端已经不再管客户端所请求地址，让客户端去请求另外的地址
  - 301	Redirect Permanently 永久重定向	配合location，浏览器自动处理

  - 302	Found 临时重定向	配合location，浏览器自动处理

  - 304	Not Modified 资源未被修改	所请求的资源未修改，服务器返回此状态码时，不会返回任何资源。客户端通常会缓存访问过的资源，通过提供一个头信息指出客户端希望只返回在指定日期之后修改的资源

* 4xx 客户端错误:404表示当客户端请求了一个服务端完全不认识的地址时，就会报出4xx的错误
  - 404	Not Found 资源未找到	服务器无法根据客户端的请求找到资源（网页）
  - 403	Forbidden 没有权限	服务器理解请求客户端的请求，但是拒绝执行此请求

* 5xx 服务端错误:500表示此错误来源于服务端，比如服务端写的接口出现了bug等问题
  - 500	Internal server Error 服务器错误
  - 504	Gateway Time-out网关超时	

## 1.Request headers
### 1.授权和链接相关:
* 1.cookie：最重要的请求头之一, 将cookie的值发送给HTTP服务器。
```http
github 相关
cookie: _octo=GH1.1.1688576136.1669619642; preferred_color_mode=dark; tz=Asia%2FShanghai; _device_id=394f17aff8daf3e4dcfbbe990bfbc23f; user_session=KiTT2ivG_Ah0bbT4klDEnZvAaWkw1T1K_4C_OLJuXpHgiLkN; __Host-user_session_same_site=KiTT2ivG_Ah0bbT4klDEnZvAaWkw1T1K_4C_OLJuXpHgiLkN; tz=Asia%2FShanghai; color_mode=%7B%22color_mode%22%3A%22light%22%2C%22light_theme%22%3A%7B%22name%22%3A%22light%22%2C%22color_mode%22%3A%22light%22%7D%2C%22dark_theme%22%3A%7B%22name%22%3A%22dark%22%2C%22color_mode%22%3A%22dark%22%7D%7D; logged_in=yes; dotcom_user=huiruo; has_recent_activity=1; _gh_sess=TTgSlbj%2FhcZyfYy6YmOUr8Ka72eAghRNoNt05jNcv0MOkADYWdwEdGNDu7bOr5oHRC625%2BYcpEnAIy4jZT40yXoq8ZP9lu3aMZcvdzDOjR7utNp0pqGmfHmE8QGO7V6QYRPNGnqsUYjolW2vGcHxBDBGiED79VtCSOa5hAKGXjl54yl7extzr95ClMspzXtup4KNk30uQ0mIXQIbEBF00cnOBobqKFnQFIvzulE2m2ud%2BRWK7ZxT8CXs2E2ryyqEJzE2TXk%2Fy8RhzUbmSlCvH%2Bhxc8GwL5NYMJTzU%2B35%2Fdrhrfjylkuwe%2BHzJRLD39aDNeLlE0OH6Wxq4dfJHeQ584ozRXXEbxKXQtLW502Sg%2BHUAA1t3M8FkYJwFtW02rvz6NKd%2Bib%2B%2BZjK0pS9VxqUUhBexItX%2B%2BRiixhAzL3M4samEcakLc5tpKN%2Bspge03%2BZMdCxXVFeysj3n1zn5nolddFosmVVd%2B3awcu%2FAy36kOJuiQQxjc5PfBaAf0CDB8Zf4EwxBe7ZIJvhbUsgKvfjope6jQLke%2F0o3yGQPXM%2BaG5CWueriQ4xYJ643DHqnKHXTb10mg%3D%3D--amprM4I7s%2Bc9frMv--IvjGYhfoLwUZ%2FJyirNgEZA%3D%3D
```

* 2.Authorization：授权信息，通常出现在对服务器发送的WWW-Authenticate头的应答中。主要用于证明客户端有权查看某个资源。

* 3.connection：连接方式(close 或 keepalive);
```
百度:
Connection: keep-alive

Connection: Keep-Alive 是用于 HTTP持久连接 的字段。

在 HTTP 1.1 中 所有的连接默认都是持续连接，除非特殊声明不支持。目前服务器端默认为 5-15 秒，可以设置。

开启后的优点：TCP 连接数比较少，所以随之而来和 TCP 相关的优点全都来了。其实和 HTTP 没什么关系，主要是大幅降低服务器端因大量新建 TCP 连接造成的 CPU负载，以及 TCP 传输相关的拥塞控制问题。

开启后的缺点：这个协议是为 HTTP1.1 而存在的，已经不完全适合现有的网络状况。以前带宽小，瞬时请求高，所以用这个方法降低 TCP 新建。但现在带宽大，并发高。如果 HTTP 服务存在长轮训或较长间隔请求，而且超过 Keep-Alive 的设置（比如 Keep-Alive 5 秒，但轮训周期是 6 秒），则可能会造成大量的无用途连接，白白占用系统资源。

PS: HTTP/2 没有这玩意，用的是更先进的直接基于TCP层次的连接管理。
```

* Keep-Alive 是一个通用消息头，允许消息发送者暗示连接的状态，还可以用来设置超时时长和最大请求数。
```
Keep-Alive: timeout=5, max=1000
```

### 2.文件相关：
* 1.Content-type发送数据的格式，如application/json
* 2.Accept 浏览器端可以接受的MIME类型。例如：Accept: text/html 代表浏览器可以接受服务器回发的类型为 text/html 也就是我们常说的html文档
```
百度：
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
```

### 3.缓存相关
* cache-control
```
百度：
Cache-Control: max-age=0

指定请求和响应遵循的缓存机制。缓存指令是单向的（响应中出现的缓存指令在请求中未必会出现），且是独立的（在请求消息或响应消息中设置Cache-Control并不会修改另一个消息处理过程中的缓存处理过程）。请求时的缓存指令包括no-cache、no-store、max-age、max-stale、min-fresh、only-if-cached，响应消息中的指令包括public、private、no-cache、no-store、no-transform、must-revalidate、proxy-revalidate、max-age、s-maxage。
```
* expires 
```
指明应该在什么时候认为文档已经过期，从而不再缓存它，重新从服务器获取，会更新缓存。过期之前使用本地缓存。HTTP1.1的客户端和缓存会将非法的日期格式（包括0）看作已经过期。

eg：为了让浏览器不要缓存页面，我们也可以将Expires实体报头域，设置为0。
```

### 4.其他
* Host 指定原始的 URL 中的主机和端口
* User-Agent（简称UA）浏览器内核信息
* Accept-Encoding   浏览器可以接收的算法，如gzip
* Accept-Language 浏览器可接收的语言，如zh-CN
* Accept-Encoding
```
浏览器申明自己可接收的编码方法，通常指定压缩方法，是否支持压缩，支持什么压缩方法（gzip，deflate）;Servlet能够向支持gzip的浏览器返回经gzip编码的HTML页面。
```
* Accept-Charset：可接受的应答的字符集;
* Content-Length：表示请求消息正文的长度。

<br />

## 2.Response headers
### 1.请求相关
* Access-Control-Allow-Origin 表示接受那些域名的请求
* Set-Cookie	服务端向客户端设置cookie，可见服务器向客户端设置了多个 cookie
![](../assets/img-http/setCookie字段.png)
* Allow：服务器支持哪些请求方法（如GET、POST等）。

### 2.缓存相关
* cache-control: max-age=0, private, must-revalidate
* etag: W/"58a1839d41effc52b5e3054974c977b3"
```
ETag/Last-Modified 响应头
重点这二者在协商缓存中对应
if-none-match/If-Modified-Since 请求头
```
### 2.文件
* Content-type	返回数据的格式，如application/json
* Content-length	返回数据的大小，多少字节
* Content-Encoding	返回数据的压缩算法，如gzip
