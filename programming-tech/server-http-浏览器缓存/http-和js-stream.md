---
title: http-和js-stream
sidebar_position: 7
---

## 问题
Transfer-Encoding: chunked 这个 header ，感觉和 JavaScript 中的 stream 很像，但又有些搞不明白的地方，想请教下大家。

在 http 长连接中，对于响应 body 的数据传输由两种方式：

* 使用 Content-Length header 标注数据结束位置，来区分一个 tcp 连接中的多个响应
* 使用流模式，即分块传输(Transfer-Encoding: chunked)，把数据分块传输，并在块的起始位置标注块长度，最后一个块长度为 0 ，表示数据结束来区分一个 tcp 连接中的多个响应


第一种模式，假设是长度是 30g ，传统的处理方式是根据 Content-Length 事先在内存中开辟一个 30g 的 buffer ，等数据把 buffer 填满即意味着 tcp 连接中的这个响应接收完毕，然后再把数据交给业务代码去消费

而把 Content-Length 的响应改用 stream 模式去消费，接收一块数据，就直接交给业务代码去消费，并记下数据的长度，重复这个过程并累加计算数据长度，直到累加长度等于 30g ，也就意味着 tcp 连接中这个响应接收完毕

我这样理解对吗？

所以 JavaScript 中的 stream 只是对消费方式的一种改造，而 http 中的 stream 是对数据的一种组织方式，我这样理解对吗？

### 回答
比如我的长度是 30GB ，那总也得按着带宽一点一点流给你吧，流多少用多少也很正常吧，又不能一下子砸出 30GB 过来;
就算有 length 也是一个流，从这个流读字节，读到 30g 的字节后停下就行了。http 层面上无论如何都是流，js 这层就是“直接用 stream”还是“stream 在原生 API 内部处理完后变成 buffer 再给你”的区别
