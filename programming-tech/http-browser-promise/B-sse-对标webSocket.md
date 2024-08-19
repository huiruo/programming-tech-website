## 但如果只是单向推送消息的话，HTTP 就有这种功能，它就是 Server Send Event。
https://zhuanlan.zhihu.com/p/653136937

一些只需要服务端推送的场景就特别适合 Server Send Event。

这种推送用 WebSocket 就没必要了，可以用 SSE 来做。

那连接断了怎么办呢？

不用担心，浏览器会自动重连。

这点和 WebSocket 不同，WebSocket 如果断开之后是需要手动重连的，而 SSE 不用。

## 例子：很多构建日志都是通过 SSE 的方式实时推送的。
我们来测试下：
```bash
touth log
# tail -f 命令可以实时看到文件的最新内容：
```

我们通过 child_process 模块的 exec 来执行这个命令，然后监听它的 stdout 输出：
```js
// test.js
const { exec } = require("child_process");

const childProcess = exec('tail -f ./log');

childProcess.stdout.on('data', (msg) => {
    console.log(msg);
});

// 用 node 执行它
node ./test.js
```

然后添加一个 sse 的接口：
监听到新的数据之后，把它返回给浏览器。
```js
@Sse('stream2')
stream2() {
const childProcess = exec('tail -f ./log');

return new Observable((observer) => {
  childProcess.stdout.on('data', (msg) => {
    observer.next({ data: { msg: msg.toString() }});
  })
});
```

浏览器连接这个新接口：
```js
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/stream2');
    eventSource.onmessage = ({ data }) => {
      console.log('New message', JSON.parse(data));
    };
  }, []);

  return (
    <div>hello</div>
  );
}

export default App;
```

可以看到，浏览器收到了实时的日志。

## 例子2:日志之类的只是文本，那如果是二进制数据呢？
二进制数据在 node 里是通过 Buffer 存储的。
```js
const { readFileSync } = require("fs");

const buffer = readFileSync('./package.json');

console.log(buffer);
```

而 Buffer 有个 toJSON 方法：
```js
// 这样不就可以通过 sse 的接口返回了么
console.log(buffer.toJSON());

@Sse('stream3')
stream3() {
    return new Observable((observer) => {
        const json = readFileSync('./package.json').toJSON();
        observer.next({ data: { msg: json }});
    });
}
```

前端：
```js
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/stream3');
    eventSource.onmessage = ({ data }) => {
      console.log('New message', JSON.parse(data));
    };
  }, []);

  return (
    <div>hello</div>
  );
}

export default App;
```

基于 sse，除了可以推送文本外，还可以推送任意二进制数据。



### WebSocket 的通信过程是这样的：
首先通过 http 切换协议，服务端返回 101 的状态码后，就代表协议切换成功。

之后就是 WebSocket 格式数据的通信了，一方可以随时向另一方推送消息。

### HTTP 的 Server Send Event 是这样的：
服务端返回的 Content-Type 是 text/event-stream，这是一个流，可以多次返回内容。

Sever Send Event 就是通过这种消息来随时推送数据。

可能你是第一次听说 SSE，但你肯定用过基于它的应用。

比如你用的 CICD 平台，它的日志是实时打印的。

那它是如何实时传输构建日志的呢？

明显需要一段一段的传输，这种一般就是用 SSE 来推送数据。

### 在nestjs
返回的是一个 Observable 对象，然后内部用 observer.next 返回消息。

可以返回任意的 json 数据。
```js
@Sse('stream')
stream() {
    return new Observable((observer) => {
      observer.next({ data: { msg: 'aaa'} });

      setTimeout(() => {
        observer.next({ data: { msg: 'bbb'} });
      }, 2000);

      setTimeout(() => {
        observer.next({ data: { msg: 'ccc'} });
      }, 5000);
    });
}
```

### App.tsx
```js
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/stream');
    eventSource.onmessage = ({ data }) => {
      console.log('New message', JSON.parse(data));
    };
  }, []);

  return (
    <div>hello</div>
  );
}

export default App;
```

这个 EventSource 是浏览器原生 api，就是用来获取 sse 接口的响应的，它会把每次消息传入 onmessage 的回调函数。
```
在 devtools 里可以看到，响应的 Content-Type 是 text/event-stream：

EventStream 里可以看到每一次收到的消息：
```


## sse
* 如果只需要服务端向客户端推送消息，推荐使用SSE

问答工具流式输出确实用的sse，chatgpt就是

eventsource限制挺大的，SSE本质还是流式数据，可以自己封装个fetch，或者github有个第三方库fetch-event-source

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <ul id="ul">
        
    </ul>
</body>
<script>

//生成li元素
function createLi(data){
    let li = document.createElement("li");
    li.innerHTML = String(data.message);
    return li;
}
    
//判断当前浏览器是否支持SSE
  let source = ''
 if (!!window.EventSource) {
    source = new EventSource('http://localhost:8088/sse/');
 }else{
    throw new Error("当前浏览器不支持SSE")
 }

 //对于建立链接的监听
 source.onopen = function(event) {
   console.log(source.readyState);
   console.log("长连接打开");
 };

 //对服务端消息的监听
 source.onmessage = function(event) {
   console.log(JSON.parse(event.data));
   console.log("收到长连接信息");
   let li = createLi(JSON.parse(event.data));
   document.getElementById("ul").appendChild(li)
 };

 //对断开链接的监听
 source.onerror = function(event) {
   console.log(source.readyState);
   console.log("长连接中断");
 };

</script>
</html>
```

## 主要配置
`'Content-Type': 'text/event-stream'`
```js
const express = require('express'); 
const app = express();
const port = 8088;

//设置跨域访问
app.all("*", function(req, res, next) {
	//设置允许跨域的域名，*代表允许任意域名跨域
	res.header("Access-Control-Allow-Origin", '*');
	//允许的header类型
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	//跨域允许的请求方式 
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	// 可以带cookies
	res.header("Access-Control-Allow-Credentials", true);
	if (req.method == 'OPTIONS') {
		res.sendStatus(200);
	} else {
		next();
	}
})

app.get("/sse",(req,res) => {
    res.set({
        'Content-Type': 'text/event-stream', //设定数据类型
        'Cache-Control': 'no-cache',// 长链接拒绝缓存
        'Connection': 'keep-alive' //设置长链接
      });

      console.log("进入到长连接了")
      //持续返回数据
      setInterval(() => {
        console.log("正在持续返回数据中ing")
        const data = {
          message: `Current time is ${new Date().toLocaleTimeString()}`
        };
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }, 1000);  
})

app.listen(port, () => {
	console.log(`项目启动成功-http://localhost:${port}`)
})
```