---
title: 安全-web有两大类漏洞-XSS和CSRF
sidebar_position: 10
---

## 概叙
两大类漏洞: XSS 和 CSRF
* XSS 利用的是网站对用户的信任
* CSRF 利用的则是网站对浏览器（同源策略）的信任。
```
跨站请求攻击，简单地说，是攻击者通过一些技术手段欺骗用户的浏览器去访问一个自己曾经认证过的网站并运行一些操作（如发邮件，发消息，甚至财产操作如转账和购买商品）。由于浏览器曾经认证过，所以被访问的网站会认为是真正的用户操作而去运行。这利用了web中用户身份验证的一个漏洞：简单的身份验证只能保证请求发自某个用户的浏览器，却不能保证请求本身是用户自愿发出的。csrf并不能够拿到用户的任何信息，它只是欺骗用户浏览器，让其以用户的名义进行操作。
```

xss：用户通过各种方式将恶意代码注入到其他用户的页面中。就可以通过脚本获取信息，发起请求，之类的操作。

cookie会自动携带上，而token需要设置header才可。

具体说一下xss层面的劫持和CSRF层面的劫持：

xss: 
```
劫持cookie或者localStorage，从而伪造用户身份相关信息。前端层面token会存在哪儿？不外乎cookie localStorage sessionStorage,这些东西都是通过js代码获取到的。解决方案：过滤标签<>,不信任用户输入， 对用户身份等cookie层面的信息进行http-only处理。
```

CSRF：是后端过于乐观的将header区的cookie取到（所以这才是主要原因，不是因为会自动携带cookie所以不安全，是后端代码不安全而已），并当作用户信息进行相关操作。解决方案也很简单，对于cookie不信任，对每次请求都进行身份验证，比如验证token的处理。


### Cross-site Scripting (跨站脚本攻击)，简称XSS，是一种代码注入攻击。
* 获取页面的数据，如DOM、cookies、localStorage等
* DOS攻击，发送非合理请求，占用服务器资源，使用户无法访问服务器
* 破坏页面结构
* 流量劫持(将页面重定向到其他网址)

### 种类
* 储存型XSS
XSS脚本来自服务器数据库

就是攻击者通过一些方法把XSS代码插入数据库，然后后端从数据库拿数据，把XSS代码当做正常数据返回给前端，前端把XSS代码当做正常数据渲染，然后XSS代码被执行，攻击者得逞。
```
恶意代码被当做正常数据插入到数据库中，当用户正常访问页面的时候，恶意代码从数据库中被取出，在当前页面被触发。用户不会发现自己被攻击。这种XSS可以无差别攻击，影响很大。比如留言板的XSS。
```

* 反射型XSS
XSS脚本来自地址栏

就是服务端取了地址栏的含有XSS代码的参数，拼接在HTML中返回给前端，前端执行，攻击者得逞
```
恶意代码被当做正常数据提交到后台后，由后台进行处理，并立刻返回到前端被触发。这种XSS的攻击方式一般是骗人点链接，恶意代码在url中，有一些安全常识的人可能会发现一些端倪
```

* DOM型XSS
XSS脚本来自地址栏

其实DOM型和反射型基本类似，都是通过URL中的参数中添加XSS代码，区别就是DOM型是前端直接取含有XSS脚本的参数，反射型就是服务端取参数，再返回给前端。
```
和反射型一样，单独提出来是因为它不过后端，由JS直接在前台处理。所以在后端是无法防御的，这个必须要前台过滤。比如当你在一个购物网站搜索“上衣”，返回页面中显示“上衣的搜索结果如下：”，这里的上衣可能就是直接由js获取你提交的值插入的，而不是从后端而来。
```

## 如何避免？
其实以React为例，本身设计模式就已经避免了这种攻击。因为React的jsx语法，是需要经过babel编译转成一个虚拟DOM树（就是个大JSON），然后再通过createElement方法转换成真实的DOM树。在这个过程中，已经对输入的内容进行了转义，且在虚拟DOM树中的 $$typeof 字段对类型进行了一个标记，若这个标记有问题，就无法进行渲染，所以XSS代码无法执行，自然无法攻击成功。

```
虽然React的编译帮我们避免了大部分XSS攻击的可能，但是以下几个方法，还是存在风险

dangerouslySetInnerHTML dangerouslySetInnerHTML是 React 为浏览器 DOM 提供innerHTML的替换方案，为当使用dangerouslySetInnerHTML时，React 将不会对输入进行任何处理并直接渲染到 HTML 中，所以尽量不要用这个方法
在使用url时，比如src、url、href等，若是需要从服务端获取，那么会有可能让攻击者利用储存型XSS攻击，用户提供的 URL 需要在前端或者服务端在入库之前进行验证并过滤。
通过后端返回的对象来创建React组件，后端返回的对象中包含了dangerouslySetInnerHTML方法
本质就是在React不会处理的属性中，有可能有被XSS攻击的风险
```

## 方法2
```
比如接受参数会做一些过滤，把一些字符转义一下，但是转义之后依然会存在着XSS的情况。常见可触发DOM-XSS的属性包括：window.name、document.referer、documen.write、innerHTML、location等
```

### 五种防御方式
**HTML节点内容的XSS防御**
```js
转义掉<<和>> 即转义掉<>即可，转义的时机有两种，一种是写入数据库的时候进行转义，另一种实在解析的时候进行转义。

这里是在显示的时候转义

var escapeHtml = function(str){
  str = str.replace(/>/g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  return str;
}

escapeHtml(content);
```

**HTML属性的XSS防御**
```
转义”&quto; 即转义掉双引号，'转义掉单引号，(另一个要注意的是实际上html的属性可以不包括引号，因此严格的说我们还需要对空格进行转义，但是这样会导致渲染的时候空格数不对，因此我们不转义空格，然后再写html属性的时候全部带上引号)这样属性就不会被提前关闭了

var escapeHtmlProperty = function(str){
  str = str.replace(/"/g, '&quto;');
  str = str.replace(/'/g, '&#39;');
  str = str.replace(/ /g, '&#32;');
  return str;
}

escapeHtml(content);
```

**XSS npm 库来防御**
```js
npm install xss
白名单-使用第三方库XSS，支持指定白名单

var xssFilter = function(html){
    if(!html) return '';

    var xss = require('xss');
    var ret = xss(html, {
        whiteList:{
            img: ['src'],
            a: ['href'],
            font: ['size', 'color']
        },
        onIgnoreTag: function(){
            return '';
        }
    });


    console.log(html, ret);

    return ret;
};
```
