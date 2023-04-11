---
title: 鉴权-Token和JWT-cookie-session
sidebar_position: 6
---

## 常见的前后端鉴权方式
* 1.Session-Cookie
* 2.Token 验证（包括 JWT，SSO）
* OAuth2.0（开放授权）

Token 和 JWT 的区别
```
相同：
都是访问资源的令牌
都可以记录用户的信息
都是使服务端无状态化
都是只有验证成功后，客户端才能访问服务端上受保护的资源

区别：
Token：服务端验证客户端发送过来的 Token 时，还需要查询数据库获取用户信息，然后验证 Token 是否有效。

JWT：将 Token 和 Payload 加密后存储于客户端，服务端只需要使用密钥解密进行校验（校验也是 JWT 自己实现的）即可，不需要查询或者减少查询数据库，因为 JWT 自包含了用户信息和加密的数据。
```

## B.什么是 Token（令牌）
```
访问资源接口（API）时所需要的资源凭证

简单 token 的组成： uid(用户唯一的身份标识)、time(当前时间的时间戳)、sign（签名，token 的前几位以哈希算法压缩成的一定长度的十六进制字符串）

特点：
	服务端无状态化、可扩展性好
	支持移动端设备
	安全
	支持跨程序调用
```

```
客户端使用用户名跟密码请求登录

服务端收到请求，去验证用户名与密码

验证成功后，服务端会签发一个 token 并把这个 token 发送给客户端

客户端收到 token 以后，会把它存储起来，比如放在 cookie 里或者 localStorage 里

客户端每次向服务端请求资源的时候需要带着服务端签发的 token

服务端收到请求，然后去验证客户端请求里面带着的 token ，如果验证成功，就向客户端返回请求的数据
```

```
每一次请求都需要携带 token，需要把 token 放到 HTTP 的 Header 里

基于 token 的用户认证是一种服务端无状态的认证方式，服务端不用存放 token 数据。用解析 token 的计算时间换取 session 的存储空间，从而减轻服务器的压力，减少频繁的查询数据库
token 完全由应用管理，所以它可以避开同源策略
```

### B-1.Token 和 Session 的区别
Token 使服务端无状态化，不会存储会话信息。

Session 是一种记录服务器和客户端会话状态的机制，使服务端有状态化，可以记录会话信息。而 Token 是令牌，访问资源接口（API）时所需要的资源凭证。

Session 和 Token 并不矛盾，作为身份认证 Token 安全性比 Session 好，因为每一个请求都有签名还能防止监听以及重放攻击，而 Session 就必须依赖链路层来保障通讯安全了。如果你需要实现有状态的会话，仍然可以增加 Session 来在服务器端保存一些状态。

而 Token ，如果指的是 OAuth Token 或类似的机制的话，提供的是 认证 和 授权 ，认证是针对用户，授权是针对 App 。其目的是让某 App 有权利访问某用户的信息。这里的 Token 是唯一的。不可以转移到其它 App上，也不可以转到其它用户上。

### B-2.使用 token 时需要考虑的问题
如果你认为用数据库来存储 token 会导致查询时间太长，可以选择放在内存当中。比如 redis 很适合你对 token 查询的需求。

token 完全由应用管理，所以它可以避开同源策略

token 可以避免 CSRF 攻击(因为不需要 cookie 了)

移动端对 cookie 的支持不是很好，而 session 需要基于 cookie 实现，所以移动端常用的是 token

<br />


### D.什么是 JWT
JSON Web Token（简称 JWT）是目前最流行的跨域认证解决方案。是一种认证授权机制。

用户的状态不会存储在服务端的内存中，这是一种 无状态的认证机制;

它使用一个签名来验证信息的发送者和接收者，并保证信息在传输过程中不被篡改。
可以使用 HMAC 算法或者是 RSA 的公/私秘钥对 JWT 进行签名。因为数字签名的存在，这些传递的信息是可信的。

JWT本身包含了一些信息，例如用户ID、用户名等，这些信息可以用来判断请求是否来自于某个用户。
```
例如，假设我们想要验证用户“Alice”发送的请求。我们可以通过以下方式实现：

1.在用户“Alice”登录时，后台生成一个JWT，并将其返回给客户端。该JWT中包含了用户的信息，例如用户ID、用户名等。
2.客户端在发送请求时，将JWT添加到请求头中，并将其发送到服务器。
3.服务器接收到请求时，首先验证JWT的签名是否有效，然后解析JWT中的信息，并判断是否为用户“Alice”发送的请求。
```

```
如果是服务器集群，或者是跨域的服务导向架构，就要求 session 数据共享，每台服务器都能够读取 session。如果启用JWT,服务器就不保存任何 session 数据了，也就是说，服务器变成无状态了，从而比较容易实现扩展。
```

作用：
1. 因为 JWT 并不使用 Cookie ，所以你可以使用任何域名提供你的 API 服务而不需要担心跨域资源共享问题（CORS）
```
当用户希望访问一个受保护的路由或者资源的时候，可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP 请求头信息的 Authorization 字段里，使用 Bearer 模式添加 JWT。
```
2.  由于JWT 是自包含的，因此减少了需要查询数据库的需要;
JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。


### 2.使用 JWT 时需要考虑的问题
JWT 最大的优势是服务器不再需要存储 Session，使得服务器认证鉴权业务可以方便扩展。但这也是 JWT 最大的缺点：由于服务器不需要存储 Session 状态，因此使用过程中无法废弃某个 Token 或者更改 Token 的权限。也就是说一旦 JWT 签发了，到期之前就会始终有效，除非服务器部署额外的逻辑。

JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。

JWT 适合一次性的命令认证，颁发一个有效期极短的 JWT，即使暴露了危险也很小，由于每次操作都会生成新的 JWT，因此也没必要保存 JWT，真正实现无状态。

为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。

### JWT 认证流程：
1. 用户输入用户名/密码登录，服务端认证成功后，会返回给客户端一个 JWT

2. 客户端将 token 保存到本地（通常使用 localstorage，也可以使用 cookie）
```
JWT 关于 token的存储有点不靠谱，token由前端存在localStorage或者cookie是不安全的。
更安全的做法是将accessToken存在内存中，
refreshToken由backend通过set-cookie的方式存在http-only的cookie中。

将 token 安全地存储在客户端 - 如果您将 token 存储在 cookie 中，确保使用 HttpOnly 标志来防止通过 XSS 盗窃，并且在所有表单上使用 CSRF 保护。
```

3. 当用户希望访问一个受保护的路由或者资源的时候，需要请求头的 Authorization 字段中使用Bearer 模式添加 JWT，其内容看起来是下面这样

4. 服务端的保护路由将会检查请求头 Authorization 中的 JWT 信息，如果合法，则允许用户的行为

5. 因为 JWT 是自包含的（内部包含了一些会话信息），因此减少了需要查询数据库的需要

6. 因为 JWT 并不使用 Cookie 的，所以你可以使用任何域名提供你的 API 服务而不需要担心跨域资源共享问题（CORS）

7. 因为用户的状态不再存储在服务端的内存中，所以这是一种无状态的认证机制

### 鉴权代码前端：headers.Authorization
```javaScript
// 1.request拦截
this.instance.interceptors.request.use((configParam: any) => {

  const token = getTiemManualToken();
  if (token) {
    configParam.headers.Authorization = token;
  }

  return configParam;
}, (error) => {
  return error;
});


// console.log('instance response 拦截,处理返回结果');
this.instance.interceptors.response.use(res => {
  const { refreshtoken } = res.headers;
  const reqData = res.data as customRequest;
  if (refreshtoken) {
    console.log('刷新token 存在开始设置', refreshtoken);
    setTiemManualToken(refreshtoken);
  } else {
    console.log('刷新token 不存在');
  }

  if (reqData.code === 401) {
    // removeTiemManualToken();
    console.log('没有权限,需要移除token?', reqData);
    removeTiemManualToken();
    store.dispatch({
      type: LOGOUT,
    });
  }

  return res.data;
}, (error) => {})
```


### 3.jwt 和 session 对比
jwt的优缺点都很明显，尤其和session对比，属于两种不同的解决方案。使用哪个需要根据项目来决定。

先来说说jtw，全称为Json Token Web，是一种无状态服务。什么意思呢，简单来说就是后端在判断传过来的账号密码正确后会生成一个加密的token，里面包含了用户及自定义的信息。

前端在接收后保存起来，每次访问需要权限的api时都带上token。服务器接收token时，只要可以正确使用key解密及没有过期，就判断为有权限。这样做的好处在于服务器不需要储存任何状态，只要你传过来的token 可以用key解密及没有过期，那我就信任你。大大缓解了服务器压力。但这样也会带来一个问题，那就是任何人获得了token都可以用来操作，并且更改密码及注销后并不能及时阻止token。所以总结来看，jwt可以大大节约服务器资源，但缺点在于不方便注销。
```
据我自己的使用经验，jwt 前期开发会很快（实现简单），缺点很多回答提到了，由于有踢人（拉黑用户）、换 token （重新登录、修改密码、多设备登录）的需求，实际还是需要一个中心化的东西来管理 token，比如 redis，这样的话就不如直接用传统的 session 方案了，可以考虑：spring-session-data-redis + spring-boot-starter-data-redis 实现一个分布式 session 管理，速度还是很快的。
```
### session则正好弥补了jwt的缺点
而session则正好弥补了jwt的缺点，可以随时在后台注销，注销后用户发过来的session将无法通过。但缺点也显而易见，那就是需要再服务器保留状态，用户一多的话会加大开销。所以综合来看，如果你的网站涉及到交易支付，建议session，方便管理。其余的可以考虑jwt，简单快捷


<br />

## C.什么是 Session
HTTP 是无状态的协议（对于事务处理没有记忆能力，每次客户端和服务端会话完成时，服务端不会保存任何会话信息）。所以服务器与浏览器为了进行会话跟踪（知道是谁在访问我），就必须主动的去维护一个状态，这个状态用于告知服务端前后两个请求是否来自同一浏览器。而这个状态需要通过cookie或者session去实现。

登录一个网站的时候，如果web服务器端使用的是session,那么所有的数据都保存在服务器上面，客户端每次请求服务器的时候会发送 当前会话的session_id，服务器根据当前session_id判断相应的用户数据标志，以确定用户是否登录，或具有某种权限。

session，指的是客户端与服务端维持的一个有状态会话。所以提到session你不能说这是纯服务端的事情，跟客户端也有关。

session 可以基于 cookie 实现的，session 存储在服务器端，sessionId 会被存储到客户端的cookie 中。

session 认证流程：
* 用户第一次请求服务器的时候，服务器根据用户提交的相关信息，创建对应的 Session
* 请求返回时将此 Session 的唯一标识信息 SessionID 返回给浏览器
* 浏览器接收到服务器返回的 SessionID 信息后，会将此信息存入到 Cookie 中，同时 Cookie 记录此 SessionID 属于哪个域名
* 当用户第二次访问服务器的时候，请求会自动判断此域名下是否存在 Cookie 信息，如果存在自动将 Cookie 信息也发送给服务端，服务端会从 Cookie 中获取 SessionID，再根据 SessionID 查找对应的 Session 信息，如果没有找到说明用户没有登录或者登录失效，如果找到 Session 证明用户已经登录可执行后面操作。

根据以上流程可知，SessionID 是连接 Cookie 和 Session 的一道桥梁，大部分系统也是根据此原理来验证用户登录状态。

## 使C-1.用 session 时需要考虑的问题
将 session 存储在服务器里面，当用户同时在线量比较多时，这些 session 会占据较多的内存，需要在服务端定期的去清理过期的 session

当网站采用集群部署的时候，会遇到多台 web 服务器之间如何做 session 共享的问题。因为 session 是由单个服务器创建的，但是处理用户请求的服务器不一定是那个创建 session 的服务器，那么该服务器就无法拿到之前已经放入到 session 中的登录凭证之类的信息了。

当多个应用要共享 session 时，除了以上问题，还会遇到跨域问题，因为不同的应用可能部署的主机不一样，需要在各个应用做好 cookie 跨域的处理。

sessionId 是存储在 cookie 中的，假如浏览器禁止 cookie 或不支持 cookie 怎么办？ 一般会把 sessionId 跟在 url 参数后面即重写 url，所以 session 不一定非得需要靠 cookie 实现

移动端对 cookie 的支持不是很好，而 session 需要基于 cookie 实现，所以移动端常用的是 token


## D.什么是 Cookie
cookie 存储在客户端：cookie是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。

cookie 是不可跨域的： 每个 cookie 都会绑定单一的域名，无法在别的域名下获取使用，一级域名和二级域名之间是允许共享使用的（靠的是 domain）。
```
cookie属性有名，值，max-age，path, domain，secure；
    cookie默认有效期为浏览器会话，一旦用户关闭浏览器，数据就丢失，通过设置max-age=seconds属性告诉浏览器cookie有效期

    cookie作用域通过文档源和文档路径来确定，通过path和domain进行配置，web页面同目录或子目录文档都可访问
```

### D-1.使用 cookie 时需要考虑的问题
因为存储在客户端，容易被客户端篡改，使用前需要验证合法性

不要存储敏感数据，比如用户密码，账户余额

使用 httpOnly 在一定程度上提高安全性

尽量减少 cookie 的体积，能存储的数据量不能超过 4kb

设置正确的 domain 和 path，减少数据传输

cookie 无法跨域

一个浏览器针对一个网站最多存 20 个Cookie，浏览器一般只允许存放 300 个Cookie
移动端对 cookie 的支持不是很好，而 session 需要基于 cookie 实现，所以移动端常用的是 token

<br />

```javaScript
document.cookie = 'nameA=qiu; max-age=9999; pathA=/; domainA=domain; secure';
document.cookie = 'name=aaa; path=/; domain=domain; secure';
// 等于下面：
document.addCookie("userId=828"); 
document.addCookie("userName=hulk"); 
/*
要改变cookie的值，需要使用相同的名字、路径和域，新的值
来设置cookie，同样的方法可以用来改变有效期
设置max-age为0可以删除指定cookie
读取cookie，访问document.cookie返回键值对组成的字符串，
不同键值对之间用'; '分隔。通过解析获得需要的值
*/

// 获取所有cookie
var allCookies = document.cookie;

// 如果没有cookie，则输出提示信息
if (allCookies.length == 0) {
    console.log("There are no cookies.");
}else {
    // 将所有cookie按照"; "分割成数组
    var cookieArray = allCookies.split("; ");

    // 遍历cookie数组，并输出每个cookie的名称和值
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        var equalSignIndex = cookie.indexOf("=");
        var cookieName = cookie.substring(0, equalSignIndex);
        var cookieValue = cookie.substring(equalSignIndex + 1);
        console.log(cookieName + "=" + cookieValue);
    }
}
```

<br />

## A.cookie和Session区别
### cookie和session无法放在一起对比，因为他们维度不同
首先，cookie是一个http头部，而session是一个虚拟概念。cookie可以用于实现session，也可以不。cookie的用法远大于session。

反过来说，session也未必需要用cookie实现。
* 有效期不同： Cookie 可设置为长时间保持，比如我们经常使用的默认登录功能，Session 一般失效时间较短，客户端关闭（默认情况下）或者 Session 超时都会失效。
* 存储大小不同： 单个 Cookie 保存的数据不能超过 4K，Session 可存储数据远高于 Cookie，但是当访问量过多，会占用过多的服务器资源。
* 安全性： Session 比 Cookie 安全，Session 是存储在服务器端的，Cookie 是存储在客户端的。
* 存取值的类型不同：Cookie 只支持存字符串数据，想要设置其他类型的数据，需要将其转换成字符串，Session 可以存任意数据类型。

注意:
* session很容易失效,用户体验很差;
* 虽然cookie不安全,但是可以加密 ;
* cookie一定要设置失效时间,要不然浏览器关闭就消失了;

例如: 记住密码功能就是使用永久cookie写在客户端电脑，下次登录时，自动将cookie信息附加发送给服务端。

### A-2.只要关闭浏览器 ，session 真的就消失了？
注意：
新开的浏览器窗口会生成新的Session，但子窗口除外。子窗口会共用父窗口的Session。例如，在链接上右击，在弹出的快捷菜单中选择“在新窗口中打开”时，子窗口便可以访问父窗口的Session。

不对。对 session 来说，除非程序通知服务器删除一个 session，否则服务器会一直保留，程序一般都是在用户做 log off 的时候发个指令去删除 session。
然而浏览器从来不会主动在关闭之前通知服务器它将要关闭，因此服务器根本不会有机会知道浏览器已经关闭，之所以会有这种错觉，是大部分 session 机制都使用会话 cookie 来保存 session id，而关闭浏览器后这个 session id 就消失了，再次连接服务器时也就无法找到原来的 session。如果服务器设置的 cookie 被保存在硬盘上，或者使用某种手段改写浏览器发出的 HTTP 请求头，把原来的 session id 发送给服务器，则再次打开浏览器仍然能够打开原来的 session。
恰恰是由于关闭浏览器不会导致 session 被删除，迫使服务器为 session 设置了一个失效时间，当距离客户端上一次使用 session 的时间超过这个失效时间时，服务器就认为客户端已经停止了活动，才会把 session 删除以节省存储空间。


### A-3.分布式架构下 session 共享方案
3. session 共享（常用）
使用分布式缓存方案比如 Memcached 、Redis 来缓存 session，但是要求 Memcached 或 Redis 必须是集群

把 session 放到 Redis 中存储，虽然架构上变得复杂，并且需要多访问一次 Redis ，但是这种方案带来的好处也是很大的：
	实现了 session 共享；
	可以水平扩展（增加 Redis 服务器）；
	服务器重启 session 不丢失（不过也要注意 session 在 Redis 中的刷新/失效机制）；
	不仅可以跨服务器 session 共享，甚至可以跨平台（例如网页端和 APP 端）

4. session 持久化
将 session 存储到数据库中，保证 session 的持久化
优点： 服务器出现问题，session 不会丢失
缺点： 如果网站的访问量很大，把 session 存储到数据库中，会对数据库造成很大压力，还需要增加额外的开销维护数据库。
<br />
