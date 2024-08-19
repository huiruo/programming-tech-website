## 参考
https://blog.p2hp.com/archives/11458

问题
但为了允许这一点，每个客户端都需要打开与服务器的连接并保持连接，直到客户端关闭选项卡/离线为止。他们创建持久连接。这使得交互成为有状态的，导致客户端和服务器在每个打开的客户端连接的 WebSocket 服务器的内存中至少存储一些数据。

因此，如果客户端打开了 15 个选项卡，那么他们将有 15 个与服务器的打开连接。这篇文章是尝试减少单个客户端负载的解决方案。

1. Web Workers是 Web 内容在后台线程中运行脚本的一种简单方法。工作线程可以在不干扰用户界面的情况下执行任务。创建后，工作人员可以通过将消息发布到由该代码指定的事件处理程序来向创建它的 JavaScript 代码发送消息（反之亦然）。

2. 共享 Workers是一种 Web Worker，可以从多个浏览上下文（例如多个窗口、iframe 甚至 Worker）进行访问。

3. 广播通道 允许具有相同来源的浏览上下文（即窗口、选项卡、框架或iframe ）之间进行简单的通信。

以上所有定义均来自MDN。

### 使用 SharedWorkers 减少服务器负载
我们可以使用SharedWorker它来解决单个客户端从同一浏览器打开多个连接的问题。我们可以使用 a 打开与服务器的连接，而不是从每个选项卡/浏览器窗口SharedWorker打开连接。

此连接将一直打开，直到网站的所有选项卡都关闭为止。所有打开的选项卡都可以使用单个连接来与服务器通信并从服务器接收消息。

我们将使用广播通道 API 将 Web 套接字的状态更改广播到所有上下文（选项卡）。

## 实战
```js
const  express  =  require("express");
const  path  =  require("path");
const  WebSocket  =  require("ws");
const  app  =  express();

// Use the public directory for static file requests
app.use(express.static("public"));

// Start our WS server at 3001
const wss = new WebSocket.Server({ port: 3001 });

wss.on("connection", ws => {
  console.log('A new client connected!');
  ws.on("message", data => {
    console.log(`Message from client: ${data}`);

    // Modify the input and return the same.
    const  parsed  =  JSON.parse(data);
    ws.send(
      JSON.stringify({
        ...parsed.data,
        // Additional field set from the server using the from field.
        // We'll see how this is set in the next section.
        messageFromServer: `Hello tab id: ${parsed.data.from}`
      })
    );
  });
  ws.on("close", () => {
    console.log("Sad to see you go :(");
  });
});

// Listen for requests for static pages at 3000
const  server  =  app.listen(3000, function() {
  console.log("The server is running on http://localhost:"  +  3000);
});
```

### 创建一个SharedWorker
要在 JavaScript 中创建任何类型的 a Worker，您需要创建一个单独的文件来定义工作线程将执行的操作。

在工作程序文件中，您需要定义初始化该工作程序时要执行的操作。该代码只会在SharedWorker初始化时调用一次。此后，直到连接到该工作程序的最后一个选项卡未关闭/结束与该工作程序的连接为止，该代码无法重新运行。

我们可以定义一个onconnect事件处理程序来处理连接到 this 的每个选项卡SharedWorker。让我们看一下该worker.js文件。

