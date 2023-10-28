## HashRouter->锚点定位
因此不论#后面的路径怎么变化，请求的都相当于是#之前的那个页面。可以很容易的进行前后端不分离的部署(也就是把前端打包后的文件放到服务器端的public或static里)，

因为请求的链接都是ip地址:端口/#/xxxx，因此请求的资源路径永远为/，相当于index.html，而其他的后端API接口都可以正常请求，不会和/冲突，由于前后端不分离也不会产生跨域问题。

### 3.  umijs默认采用hashHistory
> UmiJS 默认采用 hashHistory 而不是 BrowserRouter，这意味着默认情况下 UmiJS 使用的是哈希路由（HashRouter）。哈希路由将路由信息存储在 URL 的片段标识符（hash）中，以 # 开头，例如 http://example.com/#/myroute。这种方式在单页面应用中很有用，因为它不会导致浏览器向服务器发送请求，而只是在客户端中进行路由切换

所以如果如果是单页面需要配置hashHistort,否则跳转会报错

## BrowserRouter->history API
使用 BrowserRouter 需要配置服务器端路由规则以处理不同的 URL 请求，以确保在刷新页面或直接访问某个 URL 时能够正确路由到应用的不同页面。如果你不配置服务器端路由规则，这可能导致在刷新页面时出现 404 错误。

Browser进行组件跳转时可以传递任意参数实现组件间的通信而HashRouter不能(除非手动拼接URL字符串)，因此一般配合Redux使用，实现组件间的数据通信。

因为BrowserRouter模式下请求的链接都是ip地址:端口/xxxx/xxxx，因此相当于每个URL都会访问一个不同的后端地址，如果后端没有覆盖到路由就会产生404错误。

可以通过加入中间件解决，放在服务器端路由匹配的最后，如果前面的API接口都不匹配，则返回index.html页面。但这样也有一些小问题，因为要求前端路由和后端路由的URL不能重复。

比如商品列表组件叫/product/list，而请求商品列表的API也是/product/list，那么就会访问不到页面，而是被API接口匹配到。

解决方法:

进行前后端分离的部署，比如前端地址ip1:端口1，后端接口地址ip2:端口2，使用Nginx反向代理服务器进行请求分发。前端向后端发起请求的URL为nginx所在的服务器+/api/xxx，通过NGINX的配置文件判断，如果URL以api开头则转发至后端接口，否则转发至前端的地址，访问项目只需访问Nginx服务器即可

## window.history常用的方法
window.history是一个堆栈,里面存放了当前浏览器Tab的所有浏览url并依照浏览顺序存放在堆栈中。

在历史堆栈中，每个状态都由一个 URL、一个状态对象和一个标题组成。当用户单击浏览器的“后退”或“前进”按钮时，浏览器会从历史堆栈中弹出状态并加载相应的网页。

### history.back()
让浏览器回到上一页。

### history.forward()
让浏览器前进到下一页。

### history.go(n)
让浏览器跳转到历史堆栈中的某个页面，n表示相对于当前页面的偏移量，可以是正数或负数。

### history.pushState+window.onpopstate实现单页面
`history.pushState(stateObj, title, url)`将一个新的状态添加到历史堆栈中，并且不会导致页面刷新。stateObj是一个可以序列化的对象，用于存储当前状态的信息。title参数不一定被所有浏览器支持，表示页面的标题。url参数表示新的URL。
```
history.pushState() 方法可以向浏览器历史堆栈中添加一个状态， 同时不会触发页面的刷新。

这个方法常常和 window.onpopstate 事件一起使用，用于实现单页应用（Single Page Application，SPA）
```

从某种程度来说，调用 pushState() 和 window.location = "#foo"基本上一样，他们都会在当前的 document 中创建和激活一个新的历史记录。但是 pushState() 有以下优势：

* 新的 URL 可以是任何和当前 URL 同源的 URL。但是设置 window.location 只会在你只设置锚的时候才会使当前的 URL。
* 非强制修改 URL。相反，设置 window.location = "#foo"; 仅仅会在锚的值不是 #foo 情况下创建一条新的历史记录。
* 可以在新的历史记录中关联任何数据。window.location = "#foo"形式的操作，你只可以将所需数据写入锚的字符串中。


在一些业务场景中可能会遇到监听浏览器前进/后退、控制路由等情况。我们可以使用Web API提供的popState事件来处理这些情况，提到popState，应用中，通常pushState配合使用。
```js
window.onpopstate = function(event) {
  alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
};

history.pushState({page: 1}, "title 1", "?page=1");
history.pushState({page: 2}, "title 2", "?page=2");
history.replaceState({page: 3}, "title 3", "?page=3");
history.back(); // 弹出 "location: http://example.com/example.html?page=1, state: {"page":1}"
history.back(); // 弹出 "location: http://example.com/example.html, state: null
history.go(2);  // 弹出 "location: http://example.com/example.html?page=3, state: {"page":3}
```

### history.replaceState(stateObj, title, url)
替换当前历史堆栈中的状态，并且不会导致页面刷新。stateObj,title,url参数的含义与pushState()方法相同。

需要注意的是，使用pushState()和replaceState()方法时，虽然不会导致页面刷新，但是在浏览器地址栏中的URL会发生变化，如果需要监听URL的变化，可以使用popstate事件来实现。